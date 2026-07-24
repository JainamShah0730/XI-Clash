import { useEffect, useState } from "react";
import Pitch from "./Pitch.jsx";
import { authFetch } from "../lib/auth.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function DraftAssign({ draftedRoster, onSaved }) {
    const [formations, setFormations] = useState([]);
    const [coaches, setCoaches] = useState([]);
    const [tactics, setTactics] = useState([]);
    const [formationId, setFormationId] = useState("");
    const [coachId, setCoachId] = useState("");
    const [tacticId, setTacticId] = useState("");
    const [assignments, setAssignments] = useState({});
    const [activeSlot, setActiveSlot] = useState(null);
    const [teamName, setTeamName] = useState("Draft XI");
    const [saveStatus, setSaveStatus] = useState("");

    useEffect(() => {
        fetch(`${API_URL}/formations`).then((r) => r.json()).then((data) => {
            setFormations(data);
            if (data.length) setFormationId(data[0].id);
        });
        fetch(`${API_URL}/coaches`).then((r) => r.json()).then((data) => {
            setCoaches(data);
            if (data.length) setCoachId(data[0].id);
        });
        fetch(`${API_URL}/tactics`).then((r) => r.json()).then((data) => {
            setTactics(data);
            if (data.length) setTacticId(data[0].id);
        });
    }, []);

    const selectedFormation = formations.find((f) => f.id === formationId);
    const assignedIds = new Set(Object.values(assignments).map((p) => p.id));
    const unassigned = draftedRoster.filter((p) => !assignedIds.has(p.id));

    function handleSlotClick(slot) {
        if (assignments[slot.slot_id]) {
            const next = { ...assignments };
            delete next[slot.slot_id];
            setAssignments(next);
        } else {
            setActiveSlot(slot);
        }
    }

    function handleAssign(player) {
        if (!activeSlot) return;
        setAssignments((prev) => ({ ...prev, [activeSlot.slot_id]: player }));
        setActiveSlot(null);
    }

    const filledCount = Object.keys(assignments).length;
    const totalSlots = selectedFormation?.slots_json.length || 11;

    async function handleSave() {
        if (filledCount < totalSlots || unassigned.length > 0) {
            setSaveStatus(`Assign all ${totalSlots} drafted players to slots first.`);
            return;
        }
        const players = Object.entries(assignments).map(([slot_id, player]) => ({ slot_id, player_id: player.id }));

        setSaveStatus("Saving...");
        try {
            const res = await authFetch(`/teams`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ formation_id: formationId, coach_id: coachId, tactic_id: tacticId, name: teamName, club_identity: null, players, bench: [] })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Save failed");
            setSaveStatus(`Saved! Team ID: ${data.id}`);
            onSaved?.(data.id);
        } catch (err) {
            setSaveStatus(`Error: ${err.message}`);
        }
    }

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem", padding: "1rem" }}>
            <div>
                <h2>Assign Your Drafted XI</h2>
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                    <label>Formation: <select value={formationId} onChange={(e) => { setFormationId(e.target.value); setAssignments({}); }}>
                        {formations.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select></label>
                    <label>Coach: <select value={coachId} onChange={(e) => setCoachId(e.target.value)}>
                        {coaches.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select></label>
                    <label>Tactic: <select value={tacticId} onChange={(e) => setTacticId(e.target.value)}>
                        {tactics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select></label>
                </div>

                <Pitch formation={selectedFormation} assignments={assignments} onSlotClick={handleSlotClick} />

                <div className="card" style={{ marginTop: "1rem" }}>
                    <p>{filledCount}/{totalSlots} slots filled</p>
                    <input value={teamName} onChange={(e) => setTeamName(e.target.value)} style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }} />
                    <button className="btn-primary" onClick={handleSave}>Save Drafted Team</button>
                    {saveStatus && <p>{saveStatus}</p>}
                </div>
            </div>

            <div className="card">
                <h3>{activeSlot ? `Pick for ${activeSlot.slot_id} (${activeSlot.position_type})` : "Click a slot, then a player"}</h3>
                {unassigned.map((p) => (
                    <div
                        key={p.id}
                        onClick={() => handleAssign(p)}
                        style={{ padding: "0.5rem", borderBottom: "1px solid var(--surface-line)", cursor: activeSlot ? "pointer" : "default", opacity: activeSlot ? 1 : 0.6 }}
                    >
                        {p.name} <span className="mono" style={{ color: "var(--gold)" }}>{p.position_primary}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}