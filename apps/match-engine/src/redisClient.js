import { createClient } from "redis";
import "dotenv/config";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const pubClient = createClient({ url: REDIS_URL });
export const subClient = pubClient.duplicate();

pubClient.on("error", (err) => console.error("Redis pubClient error:", err));
subClient.on("error", (err) => console.error("Redis subClient error:", err));

export async function connectRedis() {
    await Promise.all([pubClient.connect(), subClient.connect()]);
    console.log("Connected to Redis.");
}