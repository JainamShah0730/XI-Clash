import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Leaderboard({ currentUsername }) {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/leaderboard`)
            .then((r) => r.json())
            .then(setRows)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const rankColor = (rank) => {
        if (rank === 0) return "var(--gold)";
        if (rank === 1) return "#c7d2e0";
        if (rank === 2) return "#c98a4a";
        return "var(--text-dim)";
    };

    return (
        <div style={{ padding: "1rem", maxWidth: 640 }}>
            <h2 style={{ marginBottom: "1rem" }}>Leaderboard</h2>
            <div className="card">
                {loading && <p style={{ color: "var(--text-dim)" }}>Loading...</p>}
                {!loading && rows.length === 0 && <p style={{ color: "var(--text-dim)" }}>No ranked players yet — play a match to get on the board.</p>}

                {rows.map((row, i) => {
                    const isYou = row.username === currentUsername;
                    return (
                        <div
                            key={row.username}
                            style={{
                                display: "flex", alignItems: "center", gap: "1rem",
                                padding: "0.7rem 0.5rem",
                                borderBottom: i < rows.length - 1 ? "1px solid var(--line)" : "none",
                                background: isYou ? "rgba(0,229,199,0.06)" : "transparent",
                                borderRadius: isYou ? 6 : 0
                            }}
                        >
                            <span className="mono" style={{ width: "2ch", fontWeight: 700, color: rankColor(i) }}>
                                {i + 1}
                            </span>
                            <span style={{ flex: 1, fontWeight: isYou ? 700 : 500 }}>
                                {row.username}{isYou && <span style={{ color: "var(--cyan)", fontSize: "0.75rem", marginLeft: "0.5rem" }}>(you)</span>}
                            </span>
                            <span className="mono" style={{ color: "var(--gold)", fontWeight: 700, fontSize: "1.1rem" }}>
                                {row.elo_rating}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}