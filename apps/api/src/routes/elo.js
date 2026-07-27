import { Router } from "express";
import { pool } from "../db.js";
import { calculateEloChange } from "@xi-clash/shared";

const router = Router();

// POST /matches/report-result — called by the match-engine when a match ends.
// Not user-facing (no requireAuth) since it's an internal service-to-service
// call; a reasonable follow-up would be a shared internal secret header check,
// left out here for simplicity since this is a single-instance dev/portfolio deploy.
router.post("/matches/report-result", async (req, res) => {
    const { homeUserId, awayUserId, homeScore, awayScore } = req.body;

    if (!homeUserId || !awayUserId) {
        return res.json({ skipped: true, reason: "One or both teams had no owning user (e.g. anonymous/legacy team) — Elo not updated." });
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const usersRes = await client.query("SELECT id, elo_rating FROM users WHERE id = ANY($1::uuid[])", [[homeUserId, awayUserId]]);
        const homeUser = usersRes.rows.find((u) => u.id === homeUserId);
        const awayUser = usersRes.rows.find((u) => u.id === awayUserId);

        if (!homeUser || !awayUser) {
            await client.query("ROLLBACK");
            return res.status(404).json({ error: "One or both users not found" });
        }

        const { newHomeRating, newAwayRating, homeChange, awayChange } = calculateEloChange(
            homeUser.elo_rating, awayUser.elo_rating, homeScore, awayScore
        );

        await client.query("UPDATE users SET elo_rating = $1 WHERE id = $2", [newHomeRating, homeUserId]);
        await client.query("UPDATE users SET elo_rating = $1 WHERE id = $2", [newAwayRating, awayUserId]);

        await client.query("COMMIT");
        res.json({
            home: { userId: homeUserId, newRating: newHomeRating, change: homeChange },
            away: { userId: awayUserId, newRating: newAwayRating, change: awayChange }
        });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("POST /matches/report-result failed:", err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

export default router;