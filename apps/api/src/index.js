import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoute from "./routes/auth.js";
import healthRoute from "./routes/health.js";
import playersRoute from "./routes/players.js";
import teamsRoute from "./routes/teams.js";
import metaRoute from "./routes/meta.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
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