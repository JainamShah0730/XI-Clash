import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import "dotenv/config";
import { registerDraftHandlers } from "./draft.js";
import { registerMatchHandlers } from "./socket.js";
import { pubClient, subClient, connectRedis } from "./redisClient.js";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: { origin: process.env.CORS_ORIGIN || "*" }
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

async function start() {
    await connectRedis();
    io.adapter(createAdapter(pubClient, subClient));

    registerMatchHandlers(io);
    registerDraftHandlers(io);
    const port = process.env.PORT || 4100;
    httpServer.listen(port, () => {
        console.log(`XI Clash match-engine listening on http://localhost:${port} (Redis adapter active)`);
    });
}

start().catch((err) => {
    console.error("Failed to start match-engine:", err);
    process.exit(1);
});