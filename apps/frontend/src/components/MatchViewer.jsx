import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import MatchPitch from "./MatchPitch.jsx";
import CommentaryFeed from "./CommentaryFeed.jsx";
import ScoreboardBug from "./ScoreboardBug.jsx";
import CustomSelect from "./CustomSelect.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const MATCH_ENGINE_URL = import.meta.env.VITE_MATCH_ENGINE_URL || "http://localhost:4100";

function randomMatchCode() {
    return Math.random().toString(36).slice(2, 8).toUpperCase();
}

// Combine a team's formation slots + assigned players into a flat roster
// the pitch component can render directly: [{ slot_id, x, y, position_type, name }]
function buildRoster(team) {
    if (!team?.formation?.slots_json || !team?.players) return [];
    const slotById = Object.fromEntries(team.formation.slots_json.map((s) => [s.slot_id, s]));
    return team.players.map((p) => {
        const slot = slotById[p.slot_id] || {};
        return { slot_id: p.slot_id, x: slot.x ?? 50, y: slot.y ?? 50, position_type: slot.position_type, name: p.name };
    });
}

export default function MatchViewer() {
    const [teams, setTeams] = useState([]);
    const [selectedTeamId, setSelectedTeamId] = useState("");
    const [role, setRole] = useState("home");
    const [matchId, setMatchId] = useState(randomMatchCode());
    const [scoreFlash, setScoreFlash] = useState(false);
    const [statusMsg, setStatusMsg] = useState("");
    const [connected, setConnected] = useState(false);
    const [kickedOff, setKickedOff] = useState(false);
    const [events, setEvents] = useState([]);
    const [score, setScore] = useState({ home: 0, away: 0 });
    const [minute, setMinute] = useState(0);
    const [matchEnded, setMatchEnded] = useState(null);
    const [cardedPlayers, setCardedPlayers] = useState({});

    const [homeRoster, setHomeRoster] = useState([]);
    const [awayRoster, setAwayRoster] = useState([]);

    const socketRef = useRef(null);

    useEffect(() => {
        fetch(`${API_URL}/teams`).then((r) => r.json()).then((data) => {
            setTeams(data);
            if (data.length) setSelectedTeamId(data[0].id);
        });
    }, []);

    useEffect(() => {
        return () => socketRef.current?.disconnect();
    }, []);

    async function handleJoinAndSubmit() {
        if (!selectedTeamId) return;

        const teamRes = await fetch(`${API_URL}/teams/${selectedTeamId}`);
        const team = await teamRes.json();
        const roster = buildRoster(team);
        if (role === "home") setHomeRoster(roster); else setAwayRoster(roster);

        const socket = io(MATCH_ENGINE_URL);
        socketRef.current = socket;

        socket.on("connect", () => {
            setConnected(true);
            socket.emit("join_match", { matchId, role });
        });

        socket.on("joined_match", () => {
            socket.emit("submit_team", {
                matchId,
                role,
                playerBreakdown: team.playerBreakdown,
                coach: team.tactic || { aggression: 50, attack_bias: 50, def_line_height: 50 },
                roster,
                bench: team.bench || []
            });
        });

        socket.on("status", (d) => setStatusMsg(d.message));
        socket.on("error_message", (d) => setStatusMsg(`Error: ${d.message}`));
        socket.on("kickoff", (d) => { setKickedOff(true); setStatusMsg(d.message); });
        socket.on("rosters", (d) => {
            setHomeRoster(d.home || []);
            setAwayRoster(d.away || []);
        });
        socket.on("match_event", (e) => {
            setEvents((prev) => [...prev, e]);
            setMinute(e.minute);
            if (e.type === "goal") {
                setScore((prev) => ({ ...prev, [e.team]: prev[e.team] + 1 }));
                setScoreFlash(true);
                setTimeout(() => setScoreFlash(false), 900);
            }
            if (e.type === "yellow_card" && e.player) {
                setCardedPlayers((prev) => ({ ...prev, [e.player]: prev[e.player] === "yellow" ? "red" : "yellow" }));
            }
            if (e.type === "red_card" && e.player) {
                setCardedPlayers((prev) => ({ ...prev, [e.player]: "red" }));
            }
            if (e.type === "substitution" && e.playerOut && e.playerIn) {
                const swapRoster = (roster) => roster.map((p) =>
                    p.name === e.playerOut ? { ...p, name: e.playerIn } : p
                );
                setHomeRoster((prev) => (e.team === "home" ? swapRoster(prev) : prev));
                setAwayRoster((prev) => (e.team === "away" ? swapRoster(prev) : prev));
            }
        });

        socket.on("match_ended", (d) => { setMatchEnded(d); setStatusMsg("Full-time!"); });
    }

    const lastEvent = events[events.length - 1];

    if (!kickedOff) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 60px)", padding: "1rem" }}>
                <div className="card" style={{ width: "100%", maxWidth: 460, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <h2 style={{ textAlign: "center", color: "var(--gold)", fontSize: "1.8rem" }}>Match Setup</h2>
                    
                    <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <span style={{ fontWeight: 600, color: "var(--text-dim)" }}>Match Code (Share this with opponent)</span>
                        <input 
                            value={matchId} 
                            onChange={(e) => setMatchId(e.target.value.toUpperCase())} 
                            style={{ fontSize: "1.2rem", textAlign: "center", letterSpacing: "2px", fontWeight: "bold" }} 
                        />
                    </label>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem", position: "relative", zIndex: 20 }}>
                            <span style={{ fontWeight: 600, color: "var(--text-dim)" }}>Side</span>
                            <CustomSelect 
                                value={role} 
                                onChange={setRole} 
                                options={[
                                    { value: "home", label: "Home (Blue)" },
                                    { value: "away", label: "Away (Orange)" }
                                ]} 
                            />
                        </label>
                        
                        <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem", position: "relative", zIndex: 10 }}>
                            <span style={{ fontWeight: 600, color: "var(--text-dim)" }}>Your Team</span>
                            <CustomSelect 
                                value={selectedTeamId} 
                                onChange={setSelectedTeamId} 
                                options={teams.map((t) => ({ value: t.id, label: `${t.name} (${t.formation_name})` }))} 
                            />
                        </label>
                    </div>

                    <button onClick={handleJoinAndSubmit} disabled={!selectedTeamId} className="btn-primary" style={{ padding: "0.8rem", fontSize: "1.1rem", marginTop: "0.5rem" }}>
                        Join Match & Submit Team
                    </button>
                    
                    {statusMsg && <div style={{ textAlign: "center", padding: "0.5rem", borderRadius: 8, background: "rgba(0,0,0,0.2)", color: "var(--gold)", fontSize: "0.9rem" }}>{statusMsg}</div>}
                    {connected && !kickedOff && <div style={{ textAlign: "center", color: "var(--text-dim)", fontSize: "0.9rem" }}>Connected — waiting for opponent...</div>}
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: "1rem", height: "calc(100vh - 60px)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Scoreboard */}
            <div style={{ marginBottom: "0.75rem", display: "flex", justifyContent: "center" }}>
                <ScoreboardBug score={score} minute={minute} flash={scoreFlash} />
            </div>

            {/* Main content: pitch left, commentary right */}
            <div className="match-viewer-layout">
                {/* Pitch column */}
                <div style={{ flex: "1 1 55%", minWidth: 0 }}>
                    <MatchPitch
                        homeRoster={homeRoster}
                        awayRoster={awayRoster}
                        lastEvent={lastEvent}
                        cardedPlayers={cardedPlayers}
                    />

                    {/* Last event flash bar */}
                    {lastEvent && (
                        <div style={{
                            marginTop: "0.5rem", padding: "0.5rem 0.75rem", borderRadius: 8,
                            background: "var(--surface)", border: "1px solid var(--surface-line)",
                            textAlign: "center", fontSize: "0.9rem", fontWeight: 600,
                            color: lastEvent.type === "goal" ? "var(--goal-green)"
                                : lastEvent.type === "red_card" ? "var(--red-card)"
                                : lastEvent.type === "yellow_card" ? "var(--yellow-card)"
                                : "var(--text)"
                        }}>
                            {lastEvent.message}
                        </div>
                    )}
                </div>

                {/* Commentary column */}
                <div style={{ flex: "1 1 45%", minWidth: 0, display: "flex", flexDirection: "column" }}>
                    <CommentaryFeed events={events} style={{ flex: 1 }} />
                </div>
            </div>

            {/* Full-time summary */}
            {matchEnded && (
                <div className="card" style={{
                    marginTop: "0.75rem", border: "1px solid var(--goal-green)",
                    display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap"
                }}>
                    <h3 style={{ color: "var(--gold)" }}>Full-Time — {matchEnded.score.home} - {matchEnded.score.away}</h3>
                    <span style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>
                        Red cards: {matchEnded.redCards.length ? matchEnded.redCards.join(", ") : "None"}
                    </span>
                    <span style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>
                        Yellow cards: {Object.keys(matchEnded.yellowCounts).length
                            ? Object.entries(matchEnded.yellowCounts).map(([n, c]) => `${n} (${c})`).join(", ")
                            : "None"}
                    </span>
                </div>
            )}
        </div>
    );
}