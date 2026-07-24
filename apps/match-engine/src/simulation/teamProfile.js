const POSITION_GROUPS = {
    GK: "GK", CB: "DEF", FB: "DEF", DM: "MID", CM: "MID", AM: "MID", W: "ATT", ST: "ATT"
};

// playerBreakdown: from POST /teams response (starting XI)
// bench: raw player rows from team_bench (no slot assigned, so we use ovr_base
// directly — no position-fit penalty applied, since bench players aren't tied
// to a specific slot until they actually come on).
export function computeTeamProfile(playerBreakdown, coach, bench = []) {
    const buckets = { GK: [], DEF: [], MID: [], ATT: [] };
    for (const p of playerBreakdown) {
        const group = POSITION_GROUPS[p.slotPositionType] || "MID";
        buckets[group].push({ name: p.name, rating: p.effectiveRating });
    }

    const benchByGroup = { GK: [], DEF: [], MID: [], ATT: [] };
    for (const p of bench) {
        const group = POSITION_GROUPS[p.position_primary] || "MID";
        benchByGroup[group].push({ name: p.name, rating: p.ovr_base });
    }

    const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b.rating, 0) / arr.length : 60);

    return {
        ratings: { GK: avg(buckets.GK), DEF: avg(buckets.DEF), MID: avg(buckets.MID), ATT: avg(buckets.ATT) },
        buckets,
        bench: benchByGroup,
        coach: coach || { aggression: 50, attack_bias: 50, def_line_height: 50, style: "balanced" }
    };
}