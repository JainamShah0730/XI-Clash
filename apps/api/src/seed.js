import { pool } from "./db.js";
import { globalPlayers, indianPlayers, formations, coaches, tactics, legendaryPlayers } from "./seedData.js";


// Illustrative attributes only — for scaffold testing, not any official rating.


async function seed() {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        console.log("Seeding formations...");
        for (const f of formations) {
            await client.query(
                `INSERT INTO formations (name, slots_json) VALUES ($1, $2)
                 ON CONFLICT (name) DO UPDATE SET slots_json = EXCLUDED.slots_json`,
                [f.name, JSON.stringify(f.slots)]
            );
        }

        console.log("Seeding tactics...");
        for (const t of tactics) {
            await client.query(
                `INSERT INTO tactics (name, style, aggression, attack_bias, def_line_height)
   VALUES ($1, $2, $3, $4, $5) ON CONFLICT (name) DO NOTHING`,
                [t.name, t.style, t.aggression, t.attack_bias, t.def_line_height]
            );
        }

        console.log("Seeding coaches...");
        for (const c of coaches) {
            await client.query(
                `INSERT INTO coaches (name, preferred_style) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING`,
                [c.name, c.preferred_style]
            );
        }

        console.log("Seeding players...");
        const allPlayers = [...globalPlayers, ...indianPlayers, ...legendaryPlayers];
        for (const p of allPlayers) {
            await client.query(
                `INSERT INTO players
     (name, real_club, nation, league, position_primary, position_secondary, pac, sho, pas, dri, def, phy, ovr_base)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
     ON CONFLICT (name) DO NOTHING`,
                [p.name, p.real_club, p.nation, p.league, p.position_primary, p.position_secondary,
                p.pac, p.sho, p.pas, p.dri, p.def, p.phy, p.ovr_base]
            );
        }

        await client.query("COMMIT");
        console.log(`Done — ${formations.length} formations, ${coaches.length} coaches, ${allPlayers.length} players.`);
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Seed failed:", err);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();