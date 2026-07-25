export default function Pitch({ formation, assignments, onSlotClick }) {
    if (!formation) return <p style={{ color: "var(--text-dim)" }}>Select a formation to see the pitch.</p>;

    const VIEW_H = 140;
    // Symmetrically expand the ends of the pitch (near y=0 and y=100) 
    // to prevent GK/CB overlap, while keeping the midfield (y=50) perfectly centered.
    const spreadY = (y) => {
        const t = y / 100;
        return t + 0.1 * Math.sin(2 * Math.PI * t);
    };
    const toScreenY = (y) => VIEW_H - 8 - spreadY(y) * (VIEW_H - 16);
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
                // Clamp x to prevent cards from bleeding over the touchlines (card half-width is 7)
                const cx = Math.max(9, Math.min(91, slot.x));

                return (
                    <g key={slot.slot_id} transform={`translate(${cx}, ${cy})`} onClick={() => onSlotClick(slot)} style={{ cursor: "pointer" }}>
                        {assigned ? (
                            <g transform="translate(0, -1.5)">
                                {/* Card Background */}
                                <rect x="-7" y="-6" width="14" height="12" rx="1.2" fill="#0f172a" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" />
                                
                                {/* Top Row: Position and OVR */}
                                <text x="-5.5" y="-3" fontSize="1.6" fill="#10b981" fontFamily="var(--font-mono)" fontWeight="700">
                                    {slot.position_type}
                                </text>
                                <text x="5.5" y="-3" textAnchor="end" fontSize="1.6" fill="#fff" fontFamily="var(--font-mono)" fontWeight="700">
                                    {assigned.ovr_base || 85}
                                </text>
                                
                                {/* Middle Row: Player Name */}
                                <text y="1" textAnchor="middle" fontSize="1.5" fill="var(--text)" fontFamily="var(--font-body)" fontWeight="600">
                                    {assigned.name.split(" ").slice(-1)[0]}
                                </text>
                                
                                {/* Bottom Row: Chemistry Dots */}
                                <g transform="translate(0, 3.5)">
                                    <circle cx="-1.2" cy="0" r="0.5" fill="var(--gold)" />
                                    <circle cx="0" cy="0" r="0.5" fill="var(--gold)" />
                                    <circle cx="1.2" cy="0" r="0.5" fill="var(--gold)" />
                                </g>
                            </g>
                        ) : (
                            <g transform="translate(0, -1.5)">
                                <rect x="-7" y="-6" width="14" height="12" rx="1.2" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.3" strokeDasharray="1 1" />
                                <text y="-1.2" textAnchor="middle" fontSize="2.4" fill="rgba(255,255,255,0.4)" fontFamily="var(--font-mono)" fontWeight="700">
                                    {slot.position_type}
                                </text>
                                <text y="3" textAnchor="middle" fontSize="1.5" fill="rgba(255,255,255,0.25)" fontFamily="var(--font-body)" fontWeight="600">
                                    + Add
                                </text>
                            </g>
                        )}
                    </g>
                );
            })}
        </svg>
    );
}