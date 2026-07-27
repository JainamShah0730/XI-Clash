import { computeTeamProfile } from "./simulation/teamProfile.js";
import { simulateMatch } from "./simulation/simulateMatch.js";
import { pubClient } from "./redisClient.js";
import { generatePreMatchPreview, generateMomentumSummary, generatePostMatchAnalysis } from "./lib/commentaryAI.js";

const MS_PER_SIM_MINUTE = 800;
const ROOM_TTL_SECONDS = 3600; // auto-expire abandoned lobbies after an hour

// Local-only registry for interval handles — these can't be stored in Redis
// (they're process-specific), so this map just prevents double-starting a
// match on the instance that owns it. Lobby data itself lives in Redis.
const localIntervals = new Map();

function roomKey(matchId) {
    return `match:${matchId}:room`;
}

async function getRoom(matchId) {
    const raw = await pubClient.get(roomKey(matchId));
    if (raw) return JSON.parse(raw);
    return {
        home: { socketId: null, team: null, roster: [], ready: false },
        away: { socketId: null, team: null, roster: [], ready: false },
        started: false
    };
}

async function saveRoom(matchId, room) {
    await pubClient.set(roomKey(matchId), JSON.stringify(room), { EX: ROOM_TTL_SECONDS });
}

async function deleteRoom(matchId) {
    await pubClient.del(roomKey(matchId));
}

export function registerMatchHandlers(io) {
    io.on("connection", (socket) => {
        console.log(`socket connected: ${socket.id}`);

        socket.on("join_match", async ({ matchId, role }) => {
            if (role !== "home" && role !== "away") {
                socket.emit("error_message", { message: "role must be 'home' or 'away'" });
                return;
            }

            const room = await getRoom(matchId);

            if (room[role].socketId && room[role].socketId !== socket.id) {
                socket.emit("error_message", { message: `${role} side is already taken in this match.` });
                return;
            }

            room[role].socketId = socket.id;
            await saveRoom(matchId, room);

            socket.join(matchId);
            socket.data.matchId = matchId;
            socket.data.role = role;

            io.to(matchId).emit("status", {
                message: `${role} player joined.`,
                homeConnected: !!room.home.socketId,
                awayConnected: !!room.away.socketId
            });

            socket.emit("joined_match");
        });

        socket.on("submit_team", async ({ matchId, role, playerBreakdown, coach, roster, bench, userId }) => {

            if (role !== "home" && role !== "away") {
                socket.emit("error_message", { message: "role must be 'home' or 'away'" });
                return;
            }

            const room = await getRoom(matchId);

            if (room[role].socketId !== socket.id) {
                socket.emit("error_message", { message: "You are not registered as this role in this match." });
                return;
            }

            room[role].team = { playerBreakdown, coach, bench: bench || [] };
            room[role].roster = roster || [];
            room[role].userId = userId || null;
            room[role].ready = true;
            await saveRoom(matchId, room);

            const otherRole = role === "home" ? "away" : "home";
            io.to(matchId).emit("status", {
                message: `${role} team submitted.`,
                homeReady: room.home.ready,
                awayReady: room.away.ready
            });

            if (!room[otherRole].ready) {
                socket.emit("status", { message: `Waiting for ${otherRole} to submit their team...` });
                return;
            }

            if (room.started || localIntervals.has(matchId)) return; // already running somewhere
            // Claim this match synchronously BEFORE any async work to prevent
            // the TOCTOU race where both players' submit_team handlers pass
            // the guard and fire startMatch twice (causing double events/scores).
            localIntervals.set(matchId, true);
            await startMatch(io, matchId, room);
        });

        socket.on("disconnect", async () => {
            console.log(`socket disconnected: ${socket.id}`);
            const { matchId, role } = socket.data;
            if (!matchId || !role) return;

            const room = await getRoom(matchId);
            if (!room.home.socketId && !room.away.socketId) return; // room already gone

            room[role].socketId = null;
            if (!room.started) {
                room[role].ready = false;
                room[role].team = null;
            }
            await saveRoom(matchId, room);

            io.to(matchId).emit("status", { message: `${role} player disconnected.` });
        });
    });
}

async function startMatch(io, matchId, room) {
    room.started = true;
    await saveRoom(matchId, room);
    // localIntervals is already set as a sentinel by the caller

    const homeProfile = { profile: computeTeamProfile(room.home.team.playerBreakdown, room.home.team.coach, room.home.team.bench) };
    const awayProfile = { profile: computeTeamProfile(room.away.team.playerBreakdown, room.away.team.coach, room.away.team.bench) };

    const result = simulateMatch({ home: homeProfile, away: awayProfile, seed: matchId });

    io.to(matchId).emit("rosters", { home: room.home.roster, away: room.away.roster });
    io.to(matchId).emit("status", { message: "Generating AI match preview..." });

    // Pre-match preview — awaited before kickoff so it can be shown immediately.
    // If DeepSeek is unavailable or errors, this resolves to null and we just skip it.
    const preview = await generatePreMatchPreview("Home", "Away", homeProfile.profile, awayProfile.profile);

    // Momentum summaries every ~15 sim-minutes — computed upfront (not mid-stream)
    // so the whole event timeline stays deterministic and pre-computed, same as
    // the rest of the simulation. Each summary gets inserted as a normal event
    // in the timeline, timestamped at the window's end minute.
    const WINDOW = 15;
    let runningScore = { home: 0, away: 0 };
    let cursorMinute = 0;
    const aiEvents = [];

    for (let windowEnd = WINDOW; windowEnd <= 90; windowEnd += WINDOW) {
        const windowEvents = result.events.filter((e) => e.minute > cursorMinute && e.minute <= windowEnd);
        for (const e of windowEvents) {
            if (e.type === "goal") runningScore[e.team]++;
        }

        const summary = await generateMomentumSummary(windowEvents, runningScore, `minute ${cursorMinute}-${windowEnd}`);
        if (summary) {
            aiEvents.push({
                minute: windowEnd,
                type: "ai_commentary",
                team: null,
                message: summary
            });
        }
        cursorMinute = windowEnd;
    }

    // Post-match analysis, generated once the full result is known
    const postMatch = await generatePostMatchAnalysis(result.score, result.events, "Home", "Away");

    // Merge AI events into the timeline and re-sort by minute so they stream
    // in the right place alongside normal match events.
    const mergedEvents = [...result.events, ...aiEvents].sort((a, b) => a.minute - b.minute);

    io.to(matchId).emit("kickoff", {
        message: "Both teams ready — match starting!",
        preview: preview || undefined
    });

    let cursor = 0;
    room.intervalId = setInterval(() => {
        if (cursor >= mergedEvents.length) {
            clearInterval(room.intervalId);
            localIntervals.delete(matchId);
            io.to(matchId).emit("match_ended", {
                score: result.score,
                redCards: result.redCards,
                yellowCounts: result.yellowCounts,
                analysis: postMatch || undefined
            });

            // Report result for Elo update — fire-and-forget-ish, but logged if it fails
            // so a broken Elo call never blocks or crashes the match itself.
            reportEloResult(room.home.userId, room.away.userId, result.score).catch((err) => {
                console.error("Failed to report match result for Elo:", err);
            });

            deleteRoom(matchId);
            return;
        }
        io.to(matchId).emit("match_event", mergedEvents[cursor]);
        cursor++;
    }, MS_PER_SIM_MINUTE);

    localIntervals.set(matchId, room.intervalId); // upgrade sentinel to real interval handle
}

const API_URL = process.env.API_URL || "http://localhost:4000";

async function reportEloResult(homeUserId, awayUserId, score) {
    const res = await fetch(`${API_URL}/matches/report-result`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            homeUserId,
            awayUserId,
            homeScore: score.home,
            awayScore: score.away
        })
    });
    const data = await res.json();
    if (data.skipped) {
        console.log("Elo skipped:", data.reason);
    } else if (data.error) {
        console.error("Elo report error:", data.error);
    } else {
        console.log(`Elo updated — home: ${data.home.newRating} (${data.home.change >= 0 ? "+" : ""}${data.home.change}), away: ${data.away.newRating} (${data.away.change >= 0 ? "+" : ""}${data.away.change})`);
    }
}