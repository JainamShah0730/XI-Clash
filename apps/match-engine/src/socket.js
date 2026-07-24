import { computeTeamProfile } from "./simulation/teamProfile.js";
import { simulateMatch } from "./simulation/simulateMatch.js";
import { pubClient } from "./redisClient.js";

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

        socket.on("submit_team", async ({ matchId, role, playerBreakdown, coach, roster, bench }) => {
            const room = await getRoom(matchId);

            if (room[role].socketId !== socket.id) {
                socket.emit("error_message", { message: "You are not registered as this role in this match." });
                return;
            }

            room[role].team = { playerBreakdown, coach, bench: bench || [] };
            room[role].roster = roster || [];
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

    const homeProfile = { profile: computeTeamProfile(room.home.team.playerBreakdown, room.home.team.coach, room.home.team.bench) };
    const awayProfile = { profile: computeTeamProfile(room.away.team.playerBreakdown, room.away.team.coach, room.away.team.bench) };

    const result = simulateMatch({ home: homeProfile, away: awayProfile, seed: matchId });

    io.to(matchId).emit("rosters", { home: room.home.roster, away: room.away.roster });
    io.to(matchId).emit("kickoff", { message: "Both teams ready — match starting!" });

    let cursor = 0;
    const intervalId = setInterval(async () => {
        if (cursor >= result.events.length) {
            clearInterval(intervalId);
            localIntervals.delete(matchId);
            io.to(matchId).emit("match_ended", {
                score: result.score,
                redCards: result.redCards,
                yellowCounts: result.yellowCounts
            });
            await deleteRoom(matchId);
            return;
        }
        io.to(matchId).emit("match_event", result.events[cursor]);
        cursor++;
    }, MS_PER_SIM_MINUTE);

    localIntervals.set(matchId, intervalId);
}