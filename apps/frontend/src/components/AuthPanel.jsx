import { useState } from "react";
import { login, register } from "../lib/auth.js";

export default function AuthPanel({ onAuthenticated }) {
    const [mode, setMode] = useState("login"); // "login" | "register"
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const user = mode === "login" ? await login(username, password) : await register(username, password);
            onAuthenticated(user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="card" style={{ maxWidth: 320, margin: "4rem auto" }}>
            <h2>{mode === "login" ? "Log In" : "Create Account"}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
                />
                {error && (
                    <div style={{ color: "#ef4444", fontSize: "0.9rem" }}>
                        <p style={{ margin: "0 0 0.3rem" }}>{error}</p>
                        {mode === "login" && <p style={{ margin: 0, color: "var(--text-dim)", fontSize: "0.8rem" }}>If you previously had an account, it may have been reset. Try creating a new one.</p>}
                    </div>
                )}
                <button type="submit" disabled={loading} style={{ padding: "0.6rem 1.2rem", width: "100%" }}>
                    {loading ? "..." : mode === "login" ? "Log In" : "Create Account"}
                </button>
            </form>
            <p style={{ marginTop: "1rem", textAlign: "center" }}>
                {mode === "login" ? "No account?" : "Already have an account?"}{" "}
                <button onClick={() => setMode(mode === "login" ? "register" : "login")} style={{ background: "none", border: "none", color: "#4ade80", cursor: "pointer" }}>
                    {mode === "login" ? "Create one" : "Log in"}
                </button>
            </p>
        </div>
    );
}