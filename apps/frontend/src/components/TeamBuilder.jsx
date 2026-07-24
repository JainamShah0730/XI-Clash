import { useEffect, useState } from "react";
import Pitch from "./Pitch.jsx";
import PlayerSearch from "./PlayerSearch.jsx";
import CustomSelect from "./CustomSelect.jsx";
import { authFetch } from "../lib/auth.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function TeamBuilder() {
    const [formations, setFormations] = useState([]);
    const [coaches, setCoaches] = useState([]);
    const [tactics, setTactics] = useState([]);
    const [formationId, setFormationId] = useState("");
    const [coachId, setCoachId] = useState("");
    const [tacticId, setTacticId] = useState("");
    const [assignments, setAssignments] = useState({});
    const [activeSlot, setActiveSlot] = useState(null);
    const [preview, setPreview] = useState({ teamOVR: 0, chemistry: 0, coachFit: false, playerBreakdown: [] });
    const [teamName, setTeamName] = useState("My Dream XI");
    const [saveStatus, setSaveStatus] = useState("");
    const [benchAssignments, setBenchAssignments] = useState({}); // "BENCH1".."BENCH5" -> player
    useEffect(() => {
        fetch(`${API_URL}/formations`).then((r) => r.json()).then((data) => {
            setFormations(data);
            if (data.length) setFormationId(data[0].id);
        });
        fetch(`${API_URL}/coaches`).then((r) => r.json()).then((data) => {
            setCoaches(data);
            if (data.length) setCoachId(data[0].id);
        });
        fetch(`${API_URL}/tactics`).then((r) => r.json()).then(setTactics);
    }, []);

    const selectedFormation = formations.find((f) => f.id === formationId);
    const selectedCoach = coaches.find((c) => c.id === coachId);

    // Tactics sorted so ones matching the selected coach's preferred_style appear first
    const sortedTactics = [...tactics].sort((a, b) => {
        const aMatch = selectedCoach && a.style === selectedCoach.preferred_style;
        const bMatch = selectedCoach && b.style === selectedCoach.preferred_style;
        return (bMatch ? 1 : 0) - (aMatch ? 1 : 0);
    });

    // Default tactic to the best-fit one whenever the coach changes
    useEffect(() => {
        if (!selectedCoach || !tactics.length) return;
        const bestFit = tactics.find((t) => t.style === selectedCoach.preferred_style);
        setTacticId(bestFit ? bestFit.id : tactics[0].id);
    }, [coachId, tactics]);

    useEffect(() => {
        setAssignments({});
        setActiveSlot(null);
    }, [formationId]);

    useEffect(() => {
        if (!formationId || !tacticId) return;
        const players = Object.entries(assignments).map(([slot_id, player]) => ({ slot_id, player_id: player.id }));

        fetch(`${API_URL}/teams/preview`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ formation_id: formationId, coach_id: coachId, tactic_id: tacticId, players })
        })
            .then((r) => r.json())
            .then(setPreview)
            .catch(console.error);
    }, [assignments, coachId, tacticId, formationId]);

    function handleSlotClick(slot) {
        const isBench = slot.slot_id.startsWith("BENCH");
        const current = isBench ? benchAssignments[slot.slot_id] : assignments[slot.slot_id];

        if (current) {
            if (isBench) {
                const next = { ...benchAssignments };
                delete next[slot.slot_id];
                setBenchAssignments(next);
            } else {
                const next = { ...assignments };
                delete next[slot.slot_id];
                setAssignments(next);
            }
            setActiveSlot(null);
        } else {
            setActiveSlot(slot);
        }
    }

    function handlePickPlayer(player) {
        if (activeSlot.slot_id.startsWith("BENCH")) {
            setBenchAssignments((prev) => ({ ...prev, [activeSlot.slot_id]: player }));
        } else {
            setAssignments((prev) => ({ ...prev, [activeSlot.slot_id]: player }));
        }
        setActiveSlot(null);
    }

    const filledCount = Object.keys(assignments).length;
    const totalSlots = selectedFormation?.slots_json.length || 11;
    const selectedPlayerIds = new Set([
        ...Object.values(assignments).map((p) => p.id),
        ...Object.values(benchAssignments).map((p) => p.id)
    ]);
    async function handleSave() {
        if (filledCount < totalSlots) {
            setSaveStatus(`Fill all ${totalSlots} slots first (${filledCount}/${totalSlots} done).`);
            return;
        }
        const players = Object.entries(assignments).map(([slot_id, player]) => ({ slot_id, player_id: player.id }));

        setSaveStatus("Saving...");
        try {
            const res = await authFetch(`/teams`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    formation_id: formationId,
                    coach_id: coachId,
                    tactic_id: tacticId,
                    name: teamName,
                    club_identity: null,
                    players,
                    bench: Object.values(benchAssignments).map((p) => ({ player_id: p.id }))
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Save failed");
            setSaveStatus(`Saved! Team ID: ${data.id}`);
        } catch (err) {
            setSaveStatus(`Error: ${err.message}`);
        }
    }

    return (
        <div className="team-builder-layout">
            {/* Left Column: Controls & Stats */}
            <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1.2rem", overflowY: "auto" }}>
                <h2 style={{ color: "var(--gold)", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "0.5rem" }}>Tactics</h2>
                
                <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem", position: "relative", zIndex: 30 }}>
                    <span style={{ fontSize: "0.9rem", color: "var(--text-dim)", fontWeight: 600 }}>Formation</span>
                    <CustomSelect 
                        value={formationId} 
                        onChange={setFormationId} 
                        options={formations.map((f) => ({ value: f.id, label: f.name }))} 
                    />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem", position: "relative", zIndex: 20 }}>
                    <span style={{ fontSize: "0.9rem", color: "var(--text-dim)", fontWeight: 600 }}>Coach</span>
                    <CustomSelect 
                        value={coachId} 
                        onChange={setCoachId} 
                        options={coaches.map((c) => ({ value: c.id, label: `${c.name} — prefers ${c.preferred_style}` }))} 
                    />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem", position: "relative", zIndex: 10 }}>
                    <span style={{ fontSize: "0.9rem", color: "var(--text-dim)", fontWeight: 600 }}>Playing Style</span>
                    <CustomSelect 
                        value={tacticId} 
                        onChange={setTacticId} 
                        options={sortedTactics.map((t) => {
                            const isBestFit = selectedCoach && t.style === selectedCoach.preferred_style;
                            return { value: t.id, label: `${isBestFit ? "⭐ " : ""}${t.name} (${t.style})` };
                        })} 
                    />
                </label>

                <div style={{ marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: "bold" }}>
                        <span>OVR: <span style={{ color: "var(--gold)" }}>{preview.teamOVR || "—"}</span></span>
                        <span>CHEM: <span style={{ color: "var(--goal-green)" }}>{preview.chemistry || 0}%</span></span>
                    </div>
                    {preview.coachFit && <div style={{ color: "var(--goal-green)", fontSize: "0.85rem", fontWeight: 600 }}>⭐ Coach & tactic match!</div>}
                    <div style={{ fontSize: "0.85rem", color: "var(--text-dim)", textAlign: "center" }}>
                        {filledCount}/{totalSlots} slots filled
                    </div>
                    <input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Team Name" style={{ width: "100%" }} />
                    <button className="btn-primary" onClick={handleSave} style={{ width: "100%" }}>Save Team</button>
                    {saveStatus && <p style={{ textAlign: "center", fontSize: "0.9rem", margin: 0, color: "var(--gold)" }}>{saveStatus}</p>}
                </div>
            </div>

            {/* Center Column: Pitch & Bench */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", overflowY: "auto", padding: "0.5rem" }}>
                <div style={{ width: "100%", maxWidth: 640 }}>
                    <Pitch formation={selectedFormation} assignments={assignments} onSlotClick={handleSlotClick} />
                </div>
                
                <div className="card" style={{ width: "100%", maxWidth: 640, padding: "1rem" }}>
                    <h3 style={{ marginBottom: "0.8rem", fontSize: "1rem", color: "var(--text-dim)" }}>Substitutes</h3>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "space-between" }}>
                        {[1, 2, 3, 4, 5].map((n) => {
                            const slotId = `BENCH${n}`;
                            const player = benchAssignments[slotId];
                            const isActive = activeSlot?.slot_id === slotId;
                            return (
                                <div
                                    key={slotId}
                                    onClick={() => handleSlotClick({ slot_id: slotId, position_type: null })}
                                    style={{
                                        flex: 1, padding: "0.6rem 0.2rem", 
                                        background: player ? "rgba(255,255,255,0.05)" : "transparent",
                                        border: isActive ? "2px solid var(--gold)" : player ? "1px solid rgba(255,255,255,0.2)" : "1px dashed rgba(255,255,255,0.2)", 
                                        borderRadius: 8, cursor: "pointer", textAlign: "center",
                                        fontSize: "0.85rem", fontWeight: 600, transition: "all 0.2s ease",
                                        color: player ? "var(--text)" : "var(--text-dim)",
                                        boxShadow: isActive ? "0 0 12px rgba(232, 179, 61, 0.4)" : "none"
                                    }}
                                >
                                    {player ? player.name.split(" ").slice(-1)[0] : `Sub ${n}`}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Right Column: Player Search */}
            <PlayerSearch onPickPlayer={handlePickPlayer} activeSlot={activeSlot} excludedIds={selectedPlayerIds} />
        </div>
    );
}