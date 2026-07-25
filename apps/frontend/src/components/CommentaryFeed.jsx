import { useEffect, useRef } from "react";

const eventBorder = {
    goal: "var(--goal-green)",
    red_card: "var(--red-card)",
    yellow_card: "var(--yellow-card)",
    substitution: "#a78bfa",
    injury: "#a78bfa",
    half_time: "var(--text-dim)",
    full_time: "var(--gold)",
    ai_commentary: "var(--cyan)"
};

export default function CommentaryFeed({ events, style }) {
    const bottomRef = useRef(null);
    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [events]);

    return (
        <div className="card" style={{ height: "100%", overflowY: "auto", padding: "0.6rem", ...style }}>
            {events.map((e, i) => (
                e.type === "ai_commentary" ? (
                    <div key={i} style={{
                        margin: "0.5rem 0", padding: "0.7rem 0.8rem",
                        background: "rgba(0,229,199,0.06)", border: "1px solid var(--cyan)",
                        borderRadius: 6, fontStyle: "italic", fontSize: "0.9rem"
                    }}>
                        <span className="mono badge-cyan" style={{ marginRight: "0.5rem" }}>AI · {e.minute}'</span>
                        {e.message}
                    </div>
                ) : (
                    <div key={i} style={{ borderLeft: `3px solid ${eventBorder[e.type] || "var(--line)"}`, padding: "0.4rem 0.6rem", margin: "0.2rem 0", animation: "slideIn 0.25s ease" }}>
                        <span className="mono badge-gold" style={{ marginRight: "0.5rem" }}>{e.minute}'</span>
                        <span style={{ color: eventBorder[e.type] ? "var(--text)" : "var(--text-dim)" }}>{e.message}</span>
                    </div>
                )
            ))}
            <div ref={bottomRef} />
            <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}