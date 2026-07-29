import { useEffect, useState } from "react";
import TeamBuilder from "./components/TeamBuilder.jsx";
import MatchViewer from "./components/MatchViewer.jsx";
import AuthPanel from "./components/AuthPanel.jsx";
import { fetchCurrentUser, clearToken } from "./lib/auth.js";
import DraftRoom from "./components/DraftRoom.jsx";
import DraftAssign from "./components/DraftAssign.jsx";
import Leaderboard from "./components/Leaderboard.jsx";
import LearnHub from "./components/LearnHub.jsx";


export default function App() {
    const [tab, setTab] = useState("builder");
    const [user, setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [draftedRoster, setDraftedRoster] = useState(null);

    useEffect(() => {
        fetchCurrentUser().then((u) => {
            setUser(u);
            setCheckingAuth(false);
        });
    }, []);

    function handleLogout() {
        clearToken();
        setUser(null);
    }

    if (checkingAuth) return <p style={{ padding: "1rem" }}>Loading...</p>;

    if (!user) {
        return (
            <div style={{ fontFamily: "sans-serif", minHeight: "100vh" }}>
                <h1 style={{ padding: "1rem 1rem 0" }}>XI Clash</h1>
                <AuthPanel onAuthenticated={setUser} />
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh" }}>
            <div className="app-header">
                <h1 style={{ fontSize: "1.3rem", marginRight: "1.5rem", color: "var(--gold)" }}>Football Arena</h1>
                {["builder", "draft", "match", "leaderboard", "learn"].map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        style={{
                            background: "transparent", border: "none", borderBottom: tab === t ? "2px solid var(--gold)" : "2px solid transparent",
                            borderRadius: 0, color: tab === t ? "var(--text)" : "var(--text-dim)", padding: "0.5rem 0.2rem"
                        }}
                    >
                        {t === "builder" ? "Team Builder" : t === "draft" ? "Draft Mode" : t === "match" ? "Play Match" : t === "leaderboard" ? "Leaderboard" : "Learn"}
                    </button>
                ))}
                <span className="mono" style={{ marginLeft: "auto", color: "var(--text-dim)", fontSize: "0.8rem" }}>
                    {user.username} <span style={{ color: "var(--gold)" }}>· {user.elo_rating}</span>
                </span>
                <button onClick={handleLogout}>Log Out</button>
            </div>

            {tab === "builder" && <TeamBuilder />}
            {tab === "match" && <MatchViewer onEloUpdate={() => fetchCurrentUser().then(setUser)} />}
            {tab === "draft" && !draftedRoster && <DraftRoom onDraftComplete={setDraftedRoster} />}
            {tab === "draft" && draftedRoster && (
                <DraftAssign draftedRoster={draftedRoster} onSaved={() => { setDraftedRoster(null); setTab("match"); }} />
            )}
            {tab === "leaderboard" && <Leaderboard currentUsername={user.username} />}
            {tab === "learn" && <LearnHub />}
        </div>
    );
}