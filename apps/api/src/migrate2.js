import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { pool } from "./db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sqlPath = join(__dirname, "..", "..", "..", "db", "migrations", "002_coach_tactic_split.sql");

async function migrate() {
    const sql = readFileSync(sqlPath, "utf-8");
    const client = await pool.connect();
    try {
        console.log(`Running ${sqlPath}...`);
        await client.query(sql);
        console.log("Migration applied successfully.");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();