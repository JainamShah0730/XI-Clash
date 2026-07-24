import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoute from "./routes/auth.js";
import healthRoute from "./routes/health.js";
import playersRoute from "./routes/players.js";
import teamsRoute from "./routes/teams.js";
import metaRoute from "./routes/meta.js";

const app = express();

// CORS: accept comma-separated origins in CORS_ORIGIN, or fall back to
// allowing *.onrender.com + localhost in development.
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim())
    : null;

app.use(cors({
    origin: (origin, cb) => {
        // Allow requests with no origin (curl, server-to-server, mobile)
        if (!origin) return cb(null, true);
        // Always allow Vercel and Render subdomains unconditionally for convenience, plus localhost
        if (
            origin.endsWith(".onrender.com") ||
            origin.endsWith(".vercel.app") ||
            origin.startsWith("http://localhost")
        ) return cb(null, true);
        
        // Explicit allow-list for custom domains
        if (allowedOrigins && allowedOrigins.includes(origin)) return cb(null, true);
        
        cb(null, false);
    },
    credentials: true
}));
app.use(express.json());

app.use(healthRoute);
app.use(playersRoute);
app.use(teamsRoute);
app.use(metaRoute);
app.use(authRoute);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`XI Clash API listening on http://localhost:${port}`);
});