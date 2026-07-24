import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const MATCH_ENGINE_URL = import.meta.env.VITE_MATCH_ENGINE_URL || "http://localhost:4100";

function randomDraftCode() {
    return "D" + Math.random().toString(36).slice(2, 7).toUpperCase();
}

export default function DraftRoom({ onDraftComplete }) {
    const [draftId, setDraftId] = useState(randomDraftCode());
    const [role, setRole] = useState("home");
    const [joined, setJoined] = useState(false);
    const [statusMsg, setStatusMsg] = useState("");
    const [started, setStarted] = useState(false);
    const [pool, setPool] = useState([]);
    const [homeRoster, setHomeRoster] = useState([]);
    const [awayRoster, setAwayRoster] = useState([]);
    const [turn, setTurn] = useState(null);
    const [pickIndex, setPickIndex] = useState(0);
    const [lastPick, setLastPick] = useState(null);

    const socketRef = useRef(null);
    const myRoster = role === "home" ? homeRoster : awayRoster;
    const myTurn = turn === role;

    useEffect(() => () => socketRef.current?.disconnect(), []);

    function handleJoin() {
        const socket = io(MATCH_ENGINE_URL);
        socketRef.current = socket;

        socket.on("connect", () => {
            setJoined(true);
            socket.emit("join_draft", { draftId, role });
        });

        socket.on("draft_status", (d) => setStatusMsg(d.message));
        socket.on("draft_error", (d) => setStatusMsg(`Error: ${d.message}`));

        socket.on("draft_started", (d) => {
            setStarted(true);
            setPool(d.pool);
            setTurn(d.turn);
            setPickIndex(d.pickIndex);
        });

        socket.on("draft_update", (d) => {
            setPool(d.pool);
            setHomeRoster(d.homeRoster);
            setAwayRoster(d.awayRoster);
            setTurn(d.turn);
            setPickIndex(d.pickIndex);
            setLastPick(d.lastPick);
        });

        socket.on("draft_complete", (d) => {
            onDraftComplete(role === "home" ? d.homeRoster : d.awayRoster);
        });
    }

    function handlePick(player) {
        if (!myTurn) return;
        socketRef.current.emit("pick_player", { draftId, role, playerId: player.id });
    }

    if (!joined) {
        return (
            <div className="card" style={{ maxWidth: 420, margin: "2rem auto" }}>
                <h2>Start a Draft</h2>
                <p style={{ color: "var(--text-dim)" }}>Both players pick from a shared pool of 40 real players, alternating turns. No prior team building — pure knowledge, live.</p>
                <label style={{ display: "block", marginBottom: "0.75rem" }}>
                    Draft Code:{" "}
                    <input value={draftId} onChange={(e) => setDraftId(e.target.value.toUpperCase())} style={{ padding: "0.4rem" }} />
                </label>
                <label style={{ display: "block", marginBottom: "0.75rem" }}>
                    You are:{" "}
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="home">Home</option>
                        <option value="away">Away</option>
                    </select>
                </label>
                <button className="btn-primary" onClick={handleJoin}>Join Draft</button>
            </div>
        );
    }

    if (!started) {
        return (
            <div className="card" style={{ maxWidth: 420, margin: "2rem auto" }}>
                <p>{statusMsg || "Connecting..."}</p>
                <p style={{ color: "var(--text-dim)" }}>Waiting for both players to join draft <span className="mono">{draftId}</span>...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h2 style={{ margin: 0 }}>
                    {myTurn ? "Your pick" : "Opponent's pick"} — {pickIndex}/22
                </h2>
                {lastPick && (
                    <span style={{ color: "var(--text-dim)" }}>
                        Last: <strong style={{ color: "var(--text)" }}>{lastPick.player.name}</strong> → {lastPick.role}
                    </span>
                )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: "1rem" }}>
                <div className="card" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.5rem", maxHeight: 460, overflowY: "auto" }}>
                    {pool.map((p) => (
                        <div
                            key={p.id}
                            onClick={() => handlePick(p)}
                            style={{
                                padding: "0.5rem", borderRadius: 6, border: "1px solid var(--surface-line)",
                                background: myTurn ? "var(--surface-2)" : "var(--surface)",
                                cursor: myTurn ? "pointer" : "not-allowed",
                                opacity: myTurn ? 1 : 0.6
                            }}
                        >
                            <div style={{ fontWeight: 600 }}>{p.name}</div>
                            <div className="mono" style={{ fontSize: "0.75rem", color: "var(--gold)" }}>{p.position_primary} · {p.ovr_base}</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>{p.real_club}</div>
                        </div>
                    ))}
                </div>

                <div className="card">
                    <h3>Your Squad ({myRoster.length}/11)</h3>
                    {myRoster.map((p) => (
                        <div key={p.id} style={{ padding: "0.3rem 0", borderBottom: "1px solid var(--surface-line)" }}>
                            {p.name} <span className="mono" style={{ color: "var(--gold)" }}>{p.position_primary}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}