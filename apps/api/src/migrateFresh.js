import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { pool } from "./db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sqlPath = join(__dirname, "..", "..", "..", "db", "schema-final.sql");

async function migrate() {
    const sql = readFileSync(sqlPath, "utf-8");
    const client = await pool.connect();
    try {
        console.log(`Running ${sqlPath}...`);
        await client.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
        await client.query(sql);
        console.log("Fresh schema applied successfully.");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();