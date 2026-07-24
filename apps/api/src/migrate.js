import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { pool } from "./db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(__dirname, "..", "..", "..", "db", "schema.sql");

async function migrate() {
    const sql = readFileSync(schemaPath, "utf-8");
    const client = await pool.connect();
    try {
        console.log(`Running schema from ${schemaPath}...`);
        await client.query(sql);
        console.log("Schema applied successfully.");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();