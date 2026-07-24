export default function MatchPitch({ homeRoster, awayRoster, lastEvent, cardedPlayers }) {
    // Power-curve mapping stretches the defensive end so GK / CB tokens don't overlap.
    // raw t in [0,1] → pow(t, 0.8) expands small y values (own-goal region).
    const spreadY = (y) => Math.pow(y / 100, 0.8);
    const toHomeScreen = (slot) => ({ sx: 5 + spreadY(slot.y) * 56, sy: 8 + (slot.x / 100) * 59 });
    const toAwayScreen = (slot) => ({ sx: 115 - spreadY(slot.y) * 56, sy: 8 + (slot.x / 100) * 59 });

    const findPlayerScreenPos = (name) => {
        const h = homeRoster.find((p) => p.name === name);
        if (h) return toHomeScreen(h);
        const a = awayRoster.find((p) => p.name === name);
        if (a) return toAwayScreen(a);
        return null;
    };

    const highlightPos = lastEvent?.player ? findPlayerScreenPos(lastEvent.player) : null;
    const ballTarget = highlightPos || { sx: 60, sy: 37.5 };

    const flashColor = lastEvent?.type === "goal" ? "var(--goal-green)"
        : lastEvent?.type === "red_card" ? "var(--red-card)"
            : lastEvent?.type === "yellow_card" ? "var(--yellow-card)"
                : lastEvent?.type === "injury" || lastEvent?.type === "substitution" ? "#a78bfa"
                    : null;

    const stripeCount = 10;

    function renderTeamTokens(roster, toScreen, side) {
        return roster.map((p) => {
            const { sx, sy } = toScreen(p);
            const card = cardedPlayers[p.name];
            const isHighlighted = lastEvent?.player === p.name;
            const baseColor = side === "home" ? "var(--home)" : "var(--away)";

            return (
                <g key={p.slot_id} transform={`translate(${sx}, ${sy})`}>
                    {isHighlighted && (
                        <circle r="4.5" fill="none" stroke={flashColor || "#fff"} strokeWidth="0.6">
                            <animate attributeName="r" values="3.5;6;3.5" dur="0.9s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.9;0.15;0.9" dur="0.9s" repeatCount="indefinite" />
                        </circle>
                    )}
                    <circle r="3.2" fill={baseColor} stroke="#0a0f1c" strokeWidth="0.4" />
                    {card && (
                        <rect x="2" y="-4.5" width="1.6" height="2.5" rx="0.2" fill={card === "red" ? "var(--red-card)" : "var(--yellow-card)"} />
                    )}
                    <text y="6" textAnchor="middle" fontSize="2.2" fill="var(--text)" fontFamily="var(--font-body)" fontWeight="600">
                        {p.name.split(" ").slice(-1)[0]}
                    </text>
                </g>
            );
        });
    }

    return (
        <svg viewBox="0 0 120 75" style={{ width: "100%", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.45)" }}>
            {Array.from({ length: stripeCount }).map((_, i) => (
                <rect
                    key={i}
                    x={2 + (i * 116) / stripeCount} y="2"
                    width={116 / stripeCount} height="71"
                    fill={i % 2 === 0 ? "var(--pitch-dark)" : "var(--pitch-light)"}
                />
            ))}
            <rect x="2" y="2" width="116" height="71" fill="none" stroke="var(--pitch-line)" strokeWidth="0.5" />
            <line x1="60" y1="2" x2="60" y2="73" stroke="var(--pitch-line)" strokeWidth="0.5" />
            <circle cx="60" cy="37.5" r="9" fill="none" stroke="var(--pitch-line)" strokeWidth="0.4" />
            <circle cx="60" cy="37.5" r="0.8" fill="var(--pitch-line)" />
            
            {[2, 100].map((x, idx) => (
                <g key={idx}>
                    <rect x={x} y="19" width="18" height="37" fill="none" stroke="var(--pitch-line)" strokeWidth="0.4" />
                    <rect x={x} y="28" width="8" height="19" fill="none" stroke="var(--pitch-line)" strokeWidth="0.4" />
                </g>
            ))}

            {renderTeamTokens(homeRoster, toHomeScreen, "home")}
            {renderTeamTokens(awayRoster, toAwayScreen, "away")}

            {/* ball trail */}
            <circle cx={ballTarget.sx} cy={ballTarget.sy} r="2.8" fill={flashColor || "#fff"} opacity="0.18"
                style={{ transition: "cx 0.6s cubic-bezier(0.22,1,0.36,1), cy 0.6s cubic-bezier(0.22,1,0.36,1)" }} />
            <circle cx={ballTarget.sx} cy={ballTarget.sy} r="1.5" fill={flashColor || "#fff"} stroke="#000" strokeWidth="0.2"
                style={{ transition: "cx 0.6s cubic-bezier(0.22,1,0.36,1), cy 0.6s cubic-bezier(0.22,1,0.36,1)" }} />
        </svg>
    );
}