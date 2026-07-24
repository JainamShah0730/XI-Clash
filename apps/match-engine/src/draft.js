import { pubClient } from "./redisClient.js";

const API_URL = process.env.API_URL || "http://localhost:4000";
const DRAFT_TTL_SECONDS = 3600;
const ROUNDS = 11; // each side ends up with 11 players

function draftKey(draftId) {
    return `draft:${draftId}:room`;
}

// Snake order: round 0 = home,away | round 1 = away,home | round 2 = home,away ...
function buildTurnOrder() {
    const order = [];
    for (let round = 0; round < ROUNDS; round++) {
        const pair = round % 2 === 0 ? ["home", "away"] : ["away", "home"];
        order.push(...pair);
    }
    return order; // length 22
}

async function getDraft(draftId) {
    const raw = await pubClient.get(draftKey(draftId));
    if (raw) return JSON.parse(raw);
    return {
        home: { socketId: null, roster: [] },
        away: { socketId: null, roster: [] },
        pool: [],
        turnOrder: buildTurnOrder(),
        pickIndex: 0,
        started: false
    };
}

async function saveDraft(draftId, draft) {
    await pubClient.set(draftKey(draftId), JSON.stringify(draft), { EX: DRAFT_TTL_SECONDS });
}

async function deleteDraft(draftId) {
    await pubClient.del(draftKey(draftId));
}

export function registerDraftHandlers(io) {
    io.on("connection", (socket) => {
        socket.on("join_draft", async ({ draftId, role }) => {
            if (role !== "home" && role !== "away") {
                socket.emit("draft_error", { message: "role must be 'home' or 'away'" });
                return;
            }

            const draft = await getDraft(draftId);
            if (draft[role].socketId && draft[role].socketId !== socket.id) {
                socket.emit("draft_error", { message: `${role} side is already taken in this draft.` });
                return;
            }

            draft[role].socketId = socket.id;
            await saveDraft(draftId, draft);

            socket.join(`draft:${draftId}`);
            socket.data.draftId = draftId;
            socket.data.role = role;

            io.to(`draft:${draftId}`).emit("draft_status", {
                message: `${role} player joined.`,
                homeConnected: !!draft.home.socketId,
                awayConnected: !!draft.away.socketId
            });

            // Once both sides are connected, fetch the pool and start the draft
            if (draft.home.socketId && draft.away.socketId && !draft.started) {
                try {
                    const res = await fetch(`${API_URL}/players/random`);
                    const pool = await res.json();
                    if (!res.ok) throw new Error(pool.error || "Failed to fetch player pool");
                    
                    draft.pool = pool;
                    draft.started = true;
                    await saveDraft(draftId, draft);

                    io.to(`draft:${draftId}`).emit("draft_started", {
                        pool: draft.pool,
                        turn: draft.turnOrder[draft.pickIndex],
                        pickIndex: draft.pickIndex,
                        totalPicks: draft.turnOrder.length
                    });
                } catch (err) {
                    console.error("Failed to fetch draft pool:", err);
                    io.to(`draft:${draftId}`).emit("draft_error", { message: "Failed to load player pool. Try again." });
                }
            }
        });

        socket.on("pick_player", async ({ draftId, role, playerId }) => {
            const draft = await getDraft(draftId);

            if (!draft.started) {
                socket.emit("draft_error", { message: "Draft hasn't started yet." });
                return;
            }
            if (draft[role].socketId !== socket.id) {
                socket.emit("draft_error", { message: "You are not registered as this role in this draft." });
                return;
            }
            if (draft.turnOrder[draft.pickIndex] !== role) {
                socket.emit("draft_error", { message: "It's not your turn." });
                return;
            }

            const playerIdx = draft.pool.findIndex((p) => p.id === playerId);
            if (playerIdx === -1) {
                socket.emit("draft_error", { message: "That player is no longer available." });
                return;
            }

            const [player] = draft.pool.splice(playerIdx, 1);
            draft[role].roster.push(player);
            draft.pickIndex++;
            await saveDraft(draftId, draft);

            const isComplete = draft.pickIndex >= draft.turnOrder.length;

            io.to(`draft:${draftId}`).emit("draft_update", {
                pool: draft.pool,
                homeRoster: draft.home.roster,
                awayRoster: draft.away.roster,
                turn: isComplete ? null : draft.turnOrder[draft.pickIndex],
                pickIndex: draft.pickIndex,
                lastPick: { role, player }
            });

            if (isComplete) {
                io.to(`draft:${draftId}`).emit("draft_complete", {
                    homeRoster: draft.home.roster,
                    awayRoster: draft.away.roster
                });
                await deleteDraft(draftId);
            }
        });

        socket.on("disconnect", async () => {
            const { draftId, role } = socket.data;
            if (!draftId || !role) return;

            const draft = await getDraft(draftId);
            if (!draft.home.socketId && !draft.away.socketId) return;

            draft[role].socketId = null;
            await saveDraft(draftId, draft);
            io.to(`draft:${draftId}`).emit("draft_status", { message: `${role} player disconnected.` });
        });
    });
}