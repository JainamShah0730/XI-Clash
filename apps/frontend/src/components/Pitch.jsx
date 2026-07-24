export default function Pitch({ formation, assignments, onSlotClick }) {
    if (!formation) return <p style={{ color: "var(--text-dim)" }}>Select a formation to see the pitch.</p>;

    const VIEW_H = 140;
    const toScreenY = (y) => VIEW_H - 6 - (y / 100) * (VIEW_H - 20);
    const stripeCount = 10;

    return (
        <svg viewBox={`0 0 100 ${VIEW_H}`} style={{ width: "100%", maxWidth: 460, borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
            <defs>
                <linearGradient id="pitchVignette" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#000" stopOpacity="0.25" />
                    <stop offset="15%" stopColor="#000" stopOpacity="0" />
                    <stop offset="85%" stopColor="#000" stopOpacity="0" />
                    <stop offset="100%" stopColor="#000" stopOpacity="0.25" />
                </linearGradient>
            </defs>

            {/* mow-stripe grass */}
            {Array.from({ length: stripeCount }).map((_, i) => (
                <rect
                    key={i}
                    x="2" y={2 + (i * (VIEW_H - 4)) / stripeCount}
                    width="96" height={(VIEW_H - 4) / stripeCount}
                    fill={i % 2 === 0 ? "var(--pitch-dark)" : "var(--pitch-light)"}
                />
            ))}

            {/* markings */}
            <rect x="2" y="2" width="96" height={VIEW_H - 4} fill="none" stroke="var(--pitch-line)" strokeWidth="0.5" />
            <line x1="2" y1={VIEW_H / 2} x2="98" y2={VIEW_H / 2} stroke="var(--pitch-line)" strokeWidth="0.5" />
            <circle cx="50" cy={VIEW_H / 2} r="9" fill="none" stroke="var(--pitch-line)" strokeWidth="0.5" />
            <circle cx="50" cy={VIEW_H / 2} r="0.6" fill="var(--pitch-line)" />
            {/* penalty + six-yard boxes, both ends */}
            {[6, VIEW_H - 6].map((baseY, idx) => {
                const isTop = idx === 0;
                return (
                    <g key={idx}>
                        <rect x="26" y={isTop ? baseY : baseY - 16} width="48" height={16} fill="none" stroke="var(--pitch-line)" strokeWidth="0.4" />
                        <rect x="38" y={isTop ? baseY : baseY - 6} width="24" height={6} fill="none" stroke="var(--pitch-line)" strokeWidth="0.4" />
                    </g>
                );
            })}

            <rect x="2" y="2" width="96" height={VIEW_H - 4} fill="url(#pitchVignette)" />

            {formation.slots_json.map((slot) => {
                const assigned = assignments[slot.slot_id];
                const cy = toScreenY(slot.y);

                return (
                    <g key={slot.slot_id} transform={`translate(${slot.x}, ${cy})`} onClick={() => onSlotClick(slot)} style={{ cursor: "pointer" }}>
                        {assigned ? (
                            <>
                                <circle r="4.3" fill="var(--home)" stroke="#fff" strokeWidth="0.4" />
                                <circle r="4.3" fill="none" stroke="var(--gold)" strokeWidth="0.3" opacity="0.6" />
                            </>
                        ) : (
                            <circle r="4.3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.35)" strokeWidth="0.4" strokeDasharray="1.2 1" />
                        )}
                        <text y="0.9" textAnchor="middle" fontSize="2.6" fill="#fff" fontFamily="var(--font-mono)" fontWeight="700">
                            {slot.position_type}
                        </text>
                        {assigned && (
                            <text y="7" textAnchor="middle" fontSize="2.3" fill="var(--text)" fontFamily="var(--font-body)" fontWeight="600">
                                {assigned.name.split(" ").slice(-1)[0]}
                            </text>
                        )}
                    </g>
                );
            })}
        </svg>
    );
}