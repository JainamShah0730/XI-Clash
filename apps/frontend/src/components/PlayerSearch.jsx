import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function PlayerSearch({ onPickPlayer, activeSlot, excludedIds }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);

        const params = new URLSearchParams();
        if (query) params.set("search", query);
        if (activeSlot?.position_type) params.set("position", activeSlot.position_type);

        const timeout = setTimeout(() => {
            fetch(`${API_URL}/players?${params.toString()}`, { signal: controller.signal })
                .then((r) => r.json())
                .then((data) => setResults(data))
                .catch((err) => { if (err.name !== "AbortError") console.error(err); })
                .finally(() => setLoading(false));
        }, 250); // debounce typing

        return () => { clearTimeout(timeout); controller.abort(); };
    }, [query, activeSlot]);

    const visibleResults = results.filter((p) => !excludedIds?.has(p.id));
    return (
        <div className="card" style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, padding: "1.2rem" }}>
            <h3 style={{ marginTop: 0, marginBottom: "0.8rem", color: "var(--gold)", fontSize: "1.3rem" }}>
                {activeSlot ? `Pick a player for ${activeSlot.slot_id} (${activeSlot.position_type})` : "Select a slot on the pitch first"}
            </h3>
            <input
                type="text"
                placeholder="Search by name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ width: "100%", marginBottom: "1rem" }}
                disabled={!activeSlot}
            />
            {loading && <p style={{ color: "var(--text-dim)" }}>Searching...</p>}
            <div style={{ flex: 1, overflowY: "auto", paddingRight: "0.5rem" }}>
                {visibleResults.map((p) => (
                    <div
                        key={p.id}
                        onClick={() => activeSlot && onPickPlayer(p)}
                        style={{
                            padding: "0.6rem 0.5rem",
                            borderBottom: "1px solid rgba(255,255,255,0.08)",
                            cursor: activeSlot ? "pointer" : "default",
                            opacity: activeSlot ? 1 : 0.5,
                            display: "flex",
                            justifyContent: "space-between",
                            transition: "background 0.15s ease",
                            borderRadius: "6px",
                            backgroundColor: "transparent"
                        }}
                        onMouseEnter={(e) => activeSlot && (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                        <span><span style={{ fontWeight: 600 }}>{p.name}</span> <small style={{ color: "var(--text-dim)", marginLeft: "0.2rem" }}>({p.position_primary}{p.position_secondary ? `/${p.position_secondary}` : ""}) — {p.real_club}</small></span>
                        <strong style={{ color: "var(--text)" }}>{p.ovr_base}</strong>
                    </div>
                ))}
                {!loading && activeSlot && visibleResults.length === 0 && <p style={{ color: "var(--text-dim)" }}>No players found.</p>}
            </div>
        </div>
    );
}