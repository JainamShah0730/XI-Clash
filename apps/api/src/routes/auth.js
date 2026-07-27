import { Router } from "express";
import bcrypt from "bcrypt";
import { pool } from "../db.js";
import { signToken, requireAuth } from "../lib/auth.js";

const router = Router();
const SALT_ROUNDS = 10;

router.post("/auth/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "username and password are required" });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    try {
        const existing = await pool.query("SELECT id FROM users WHERE username = $1", [username]);
        if (existing.rows.length) {
            return res.status(409).json({ error: "That username is already taken" });
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        const { rows } = await pool.query(
            "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, elo_rating",
            [username, passwordHash]
        );
        const user = rows[0];
        res.status(201).json({ user, token: signToken(user) });
    } catch (err) {
        console.error("POST /auth/register failed:", err);
        res.status(500).json({ error: err.message });
    }
});

router.post("/auth/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "username and password are required" });
    }

    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        const user = rows[0];

        // Deliberately vague error either way — don't reveal whether the
        // username exists, that's a basic security practice against enumeration.
        if (!user || !user.password_hash) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const safeUser = { id: user.id, username: user.username, elo_rating: user.elo_rating };
        res.json({ user: safeUser, token: signToken(safeUser) });
    } catch (err) {
        console.error("POST /auth/login failed:", err);
        res.status(500).json({ error: err.message });
    }
});

// GET /auth/me — lets the frontend verify a stored token is still valid on page load
router.get("/auth/me", requireAuth, async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT id, username, elo_rating FROM users WHERE id = $1", [req.user.id]);
        if (!rows.length) return res.status(404).json({ error: "User not found" });
        res.json({ user: rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /leaderboard — top players by Elo rating, public (no auth required to view)
router.get("/leaderboard", async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT username, elo_rating
       FROM users
       ORDER BY elo_rating DESC
       LIMIT 20`
        );
        res.json(rows);
    } catch (err) {
        console.error("GET /leaderboard failed:", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;