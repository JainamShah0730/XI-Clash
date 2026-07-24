import { useEffect, useState } from "react";
import TeamBuilder from "./components/TeamBuilder.jsx";
import MatchViewer from "./components/MatchViewer.jsx";
import AuthPanel from "./components/AuthPanel.jsx";
import { fetchCurrentUser, clearToken } from "./lib/auth.js";

export default function App() {
    const [tab, setTab] = useState("builder");
    const [user, setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

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
            <div style={{
                display: "flex", gap: "0.5rem", padding: "0.9rem 1.2rem",
                background: "var(--surface)", borderBottom: "1px solid var(--surface-line)", alignItems: "center"
            }}>
                <h1 style={{ fontSize: "1.3rem", marginRight: "1.5rem", color: "var(--gold)" }}>XI CLASH</h1>
                {["builder", "match"].map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        style={{
                            background: "transparent", border: "none", borderBottom: tab === t ? "2px solid var(--gold)" : "2px solid transparent",
                            borderRadius: 0, color: tab === t ? "var(--text)" : "var(--text-dim)", padding: "0.5rem 0.2rem"
                        }}
                    >
                        {t === "builder" ? "Team Builder" : "Play Match"}
                    </button>
                ))}
                <span style={{ marginLeft: "auto", color: "var(--text-dim)", fontSize: "0.85rem" }}>{user.username}</span>
                <button onClick={handleLogout}>Log Out</button>
            </div>

            {tab === "builder" ? <TeamBuilder /> : <MatchViewer />}
        </div>
    );
}