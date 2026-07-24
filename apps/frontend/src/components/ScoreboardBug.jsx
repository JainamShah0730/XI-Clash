export default function ScoreboardBug({ score, minute, homeName = "HOME", awayName = "AWAY", flash }) {
    return (
        <div style={{
            display: "inline-flex", alignItems: "stretch", fontFamily: "var(--font-mono)",
            background: "var(--surface)", border: "1px solid var(--surface-line)",
            borderRadius: 8, overflow: "hidden", boxShadow: "0 6px 20px rgba(0,0,0,0.4)"
        }}>
            <div style={{ background: "var(--home)", width: 6 }} />
            <div style={{ padding: "0.5rem 0.9rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-dim)", letterSpacing: "0.05em" }}>{homeName}</span>
                <span
                    style={{
                        fontSize: "1.6rem", fontWeight: 700, color: flash ? "var(--goal-green)" : "var(--text)",
                        transition: "color 0.4s ease", minWidth: "2ch", textAlign: "center"
                    }}
                >
                    {score.home}
                </span>
                <span style={{ color: "var(--text-dim)" }}>–</span>
                <span
                    style={{
                        fontSize: "1.6rem", fontWeight: 700, color: flash ? "var(--goal-green)" : "var(--text)",
                        transition: "color 0.4s ease", minWidth: "2ch", textAlign: "center"
                    }}
                >
                    {score.away}
                </span>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-dim)", letterSpacing: "0.05em" }}>{awayName}</span>
                <span style={{
                    marginLeft: "0.6rem", padding: "0.15rem 0.5rem", borderRadius: 4,
                    background: "var(--gold)", color: "#1a1305", fontSize: "0.8rem", fontWeight: 700
                }}>
                    {minute}'
                </span>
            </div>
            <div style={{ background: "var(--away)", width: 6 }} />
        </div>
    );
}