import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/formations", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM formations ORDER BY name");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/coaches", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM coaches ORDER BY name");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/tactics", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM tactics ORDER BY name");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;