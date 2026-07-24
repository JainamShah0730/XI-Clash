import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// GET /players?search=messi&position=W&club=Barcelona
router.get("/players", async (req, res) => {
    const { search, position, club, nation, league } = req.query;

    const conditions = [];
    const values = [];

    if (search) {
        values.push(`%${search}%`);
        conditions.push(`name ILIKE $${values.length}`);
    }
    if (position) {
        values.push(position);
        conditions.push(`(position_primary = $${values.length} OR position_secondary = $${values.length})`);
    }
    if (club) {
        values.push(club);
        conditions.push(`real_club = $${values.length}`);
    }
    if (nation) {
        values.push(nation);
        conditions.push(`nation = $${values.length}`);
    }
    if (league) {
        values.push(league);
        conditions.push(`league = $${values.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const query = `SELECT * FROM players ${where} ORDER BY ovr_base DESC LIMIT 50`;

    try {
        const { rows } = await pool.query(query, values);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /players/random — a balanced pool for Draft Mode, weighted so both
// players can realistically field a full legal XI (not, say, 30 strikers).
router.get("/players/random", async (req, res) => {
    const counts = { GK: 4, CB: 6, FB: 6, DM: 3, CM: 6, AM: 3, W: 6, ST: 6 };

    try {
        const subqueries = Object.entries(counts).map(
            ([pos, n], i) => `(SELECT * FROM players WHERE position_primary = $${i + 1} ORDER BY random() LIMIT ${n})`
        );
        const query = subqueries.join(" UNION ALL ");
        const values = Object.keys(counts);

        const { rows } = await pool.query(query, values);
        // Shuffle the combined pool so it's not visibly grouped by position
        const shuffled = rows.sort(() => Math.random() - 0.5);
        res.json(shuffled);
    } catch (err) {
        console.error("GET /players/random failed:", err);
        res.status(500).json({ error: err.message });
    }
});

router.get("/players/:id", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM players WHERE id = $1", [req.params.id]);
        if (!rows.length) return res.status(404).json({ error: "Player not found" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;