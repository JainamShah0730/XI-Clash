import { Router } from "express";
import { pool } from "../db.js";
import { calculateTeam } from "@xi-clash/shared";
import { requireAuth } from "../lib/auth.js";
import { attachUserIfPresent } from "../lib/auth.js";


const router = Router();

// GET /teams — list recent saved teams, for the Match Viewer's team picker
router.get("/teams", attachUserIfPresent, async (req, res) => {
    const mine = req.query.mine === "true";
    const whereClause = mine && req.user ? "WHERE t.user_id = $1" : "";
    const params = mine && req.user ? [req.user.id] : [];

    try {
        const { rows } = await pool.query(
            `SELECT t.id, t.name, t.club_identity, t.created_at,
              f.name AS formation_name, c.name AS coach_name, tc.name AS tactic_name
       FROM teams t
       JOIN formations f ON f.id = t.formation_id
       LEFT JOIN coaches c ON c.id = t.coach_id
       LEFT JOIN tactics tc ON tc.id = t.tactic_id
       ${whereClause}
       ORDER BY t.created_at DESC
       LIMIT 50`,
            params
        );
        res.json(rows);
    } catch (err) {
        console.error("GET /teams failed:", err);
        res.status(500).json({ error: err.message });
    }
});

// POST /teams/preview — same calc as saving, but doesn't write to DB.
router.post("/teams/preview", async (req, res) => {
    const { formation_id, coach_id, tactic_id, name, club_identity, players, bench } = req.body;

    try {
        const formationRes = await pool.query("SELECT slots_json FROM formations WHERE id = $1", [formation_id]);
        if (!formationRes.rows.length) return res.status(400).json({ error: "Formation not found" });
        const slots = formationRes.rows[0].slots_json;
        const slotTypeById = Object.fromEntries(slots.map((s) => [s.slot_id, s.position_type]));

        const tacticRes = tactic_id ? await pool.query("SELECT * FROM tactics WHERE id = $1", [tactic_id]) : { rows: [] };
        const tactic = tacticRes.rows[0] || null;

        const coachRes = coach_id ? await pool.query("SELECT * FROM coaches WHERE id = $1", [coach_id]) : { rows: [] };
        const coach = coachRes.rows[0] || null;

        const playerIds = (players || []).map((p) => p.player_id);
        const playersRes = playerIds.length
            ? await pool.query("SELECT * FROM players WHERE id = ANY($1::uuid[])", [playerIds])
            : { rows: [] };
        const playerById = Object.fromEntries(playersRes.rows.map((p) => [p.id, p]));

        const startingXI = (players || [])
            .filter((p) => playerById[p.player_id])
            .map((p) => ({
                player: playerById[p.player_id],
                slotPositionType: slotTypeById[p.slot_id]
            }));

        if (!startingXI.length) {
            return res.json({ teamOVR: 0, chemistry: 0, coachFit: false, playerBreakdown: [] });
        }

        const calc = calculateTeam({ startingXI, tactic, coach });
        res.json(calc);
    } catch (err) {
        console.error("POST /teams/preview failed:", err);
        res.status(500).json({ error: err.message });
    }
});

// POST /teams  { user_id, formation_id, coach_id, tactic_id, name, club_identity, players: [{player_id, slot_id}] }
router.post("/teams", requireAuth, async (req, res) => {
    const { formation_id, coach_id, tactic_id, name, club_identity, players, bench } = req.body;
    const user_id = req.user.id; // trust the authenticated token, not client input

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const formationRes = await client.query("SELECT slots_json FROM formations WHERE id = $1", [formation_id]);
        if (!formationRes.rows.length) throw new Error("Formation not found");
        const slots = formationRes.rows[0].slots_json;
        const slotTypeById = Object.fromEntries(slots.map((s) => [s.slot_id, s.position_type]));

        const tacticRes = tactic_id ? await client.query("SELECT * FROM tactics WHERE id = $1", [tactic_id]) : { rows: [] };
        const tactic = tacticRes.rows[0] || null;

        const coachRes = coach_id ? await client.query("SELECT * FROM coaches WHERE id = $1", [coach_id]) : { rows: [] };
        const coach = coachRes.rows[0] || null;

        const playerIds = (players || []).map((p) => p.player_id);
        const playersRes = await client.query("SELECT * FROM players WHERE id = ANY($1::uuid[])", [playerIds]);
        const playerById = Object.fromEntries(playersRes.rows.map((p) => [p.id, p]));

        const startingXI = (players || []).map((p) => ({
            player: playerById[p.player_id],
            slotPositionType: slotTypeById[p.slot_id]
        }));

        const calc = calculateTeam({ startingXI, tactic, coach });

        const teamResult = await client.query(
            `INSERT INTO teams (user_id, formation_id, coach_id, tactic_id, name, club_identity)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [user_id, formation_id, coach_id, tactic_id, name, club_identity]
        );
        const teamId = teamResult.rows[0].id;

        for (const p of players || []) {
            await client.query(
                `INSERT INTO team_players (team_id, player_id, slot_id) VALUES ($1, $2, $3)`,
                [teamId, p.player_id, p.slot_id]
            );
        }

        for (let i = 0; i < (bench || []).length && i < 5; i++) {
            await client.query(
                `INSERT INTO team_bench (team_id, player_id, bench_order) VALUES ($1, $2, $3)`,
                [teamId, bench[i].player_id, i + 1]
            );
        }


        await client.query("COMMIT");
        res.status(201).json({ id: teamId, ...calc });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("POST /teams failed:", err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// GET /teams/:id  -> team + its players + slot assignments
// GET /teams/:id — full team detail including live-computed OVR/chemistry
// and tactic info, ready to hand straight to the match-engine.
router.get("/teams/:id", async (req, res) => {
    try {
        const teamRes = await pool.query("SELECT * FROM teams WHERE id = $1", [req.params.id]);
        if (!teamRes.rows.length) return res.status(404).json({ error: "Team not found" });
        const team = teamRes.rows[0];

        const formationRes = await pool.query("SELECT * FROM formations WHERE id = $1", [team.formation_id]);
        const slots = formationRes.rows[0].slots_json;
        const slotTypeById = Object.fromEntries(slots.map((s) => [s.slot_id, s.position_type]));

        const tacticRes = team.tactic_id ? await pool.query("SELECT * FROM tactics WHERE id = $1", [team.tactic_id]) : { rows: [] };
        const tactic = tacticRes.rows[0] || null;

        const coachRes = team.coach_id ? await pool.query("SELECT * FROM coaches WHERE id = $1", [team.coach_id]) : { rows: [] };
        const coach = coachRes.rows[0] || null;

        const playersRes = await pool.query(
            `SELECT tp.slot_id, p.* FROM team_players tp JOIN players p ON p.id = tp.player_id WHERE tp.team_id = $1`,
            [req.params.id]
        );
        const benchRes = await pool.query(
            `SELECT tb.bench_order, p.*
       FROM team_bench tb JOIN players p ON p.id = tb.player_id
       WHERE tb.team_id = $1 ORDER BY tb.bench_order`,
            [req.params.id]
        );

        const startingXI = playersRes.rows.map((p) => ({
            player: p,
            slotPositionType: slotTypeById[p.slot_id]
        }));

        const calc = calculateTeam({ startingXI, tactic, coach });

        res.json({
            ...team,
            formation: formationRes.rows[0], // now includes full slots_json, not just the name
            tactic,
            coach,
            players: playersRes.rows,
            bench: benchRes.rows, // each row already has slot_id + name from the join
            ...calc
        });
    } catch (err) {
        console.error("GET /teams/:id failed:", err);
        res.status(500).json({ error: err.message });
    }
});
export default router;