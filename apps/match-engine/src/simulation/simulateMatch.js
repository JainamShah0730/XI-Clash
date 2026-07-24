import seedrandom from "seedrandom";

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
function cloneBuckets(buckets) {
    return { GK: [...buckets.GK], DEF: [...buckets.DEF], MID: [...buckets.MID], ATT: [...buckets.ATT] };
}

export const EVENT_TYPES = {
    KICK_OFF: "kick_off", GOAL: "goal", SHOT_OFF: "shot_off_target", SHOT_SAVED: "shot_saved",
    FOUL: "foul", YELLOW: "yellow_card", RED: "red_card", CORNER: "corner", OFFSIDE: "offside",
    INJURY: "injury", SUBSTITUTION: "substitution", HALF_TIME: "half_time", FULL_TIME: "full_time"
};

const RED_CARD_PENALTY_PER_PLAYER = 0.12;
const MIN_MAN_DOWN_FACTOR = 0.55;
const MAX_SUBS_PER_TEAM = 5;

function manDownFactor(sentOffCount) {
    return clamp(1 - sentOffCount * RED_CARD_PENALTY_PER_PLAYER, MIN_MAN_DOWN_FACTOR, 1);
}

function findGroupOf(buckets, playerName) {
    for (const group of ["GK", "DEF", "MID", "ATT"]) {
        if (buckets[group].some((p) => p.name === playerName)) return group;
    }
    return null;
}

export function simulateMatch({ home, away, seed }) {
    const rng = seedrandom(String(seed));
    const events = [];
    const score = { home: 0, away: 0 };
    const yellowCounts = {};
    const sentOff = new Set();
    const sentOffCountBySide = { home: 0, away: 0 };
    const subsUsedBySide = { home: 0, away: 0 };

    // Mutable per-match copies — original profile objects stay untouched
    const cloneBench = (b) => ({ GK: [...b.GK], DEF: [...b.DEF], MID: [...b.MID], ATT: [...b.ATT] });
    const teams = {
        home: { ...home.profile, buckets: cloneBuckets(home.profile.buckets), bench: cloneBench(home.profile.bench) },
        away: { ...away.profile, buckets: cloneBuckets(away.profile.buckets), bench: cloneBench(away.profile.bench) }
    };

    const log = (minute, type, side, detail = {}) => events.push({ minute, type, team: side, ...detail });
    const fatigue = (minute) => (minute > 60 ? (minute - 60) * 0.08 : 0);

    function attemptSubstitution(side, minute, outPlayer, reason) {
        const team = teams[side];
        if (subsUsedBySide[side] >= MAX_SUBS_PER_TEAM) return false;

        const group = findGroupOf(team.buckets, outPlayer.name);
        if (!group) return false;

        const benchPool = team.bench[group];
        if (!benchPool || !benchPool.length) {
            // Try adjacent groups as fallback (e.g. MID sub for ATT)
            const fallbackOrder = { GK: [], DEF: ["MID"], MID: ["DEF", "ATT"], ATT: ["MID"] };
            let fallbackSub = null;
            for (const fb of (fallbackOrder[group] || [])) {
                if (team.bench[fb] && team.bench[fb].length) {
                    fallbackSub = team.bench[fb].shift();
                    team.buckets[group] = team.buckets[group].filter((p) => p.name !== outPlayer.name);
                    team.buckets[group].push(fallbackSub);
                    break;
                }
            }
            if (!fallbackSub) return false;

            subsUsedBySide[side]++;
            const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b.rating, 0) / arr.length : 60);
            team.ratings[group] = avg(team.buckets[group]);

            log(minute, EVENT_TYPES.SUBSTITUTION, side, {
                player: fallbackSub.name,
                playerOut: outPlayer.name,
                playerIn: fallbackSub.name,
                message: `Substitution: ${fallbackSub.name} replaces ${outPlayer.name}${reason ? ` (${reason})` : ""}.`
            });
            return true;
        }

        const substitute = benchPool.shift();
        team.buckets[group] = team.buckets[group].filter((p) => p.name !== outPlayer.name);
        team.buckets[group].push(substitute);
        subsUsedBySide[side]++;

        const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b.rating, 0) / arr.length : 60);
        team.ratings[group] = avg(team.buckets[group]);

        log(minute, EVENT_TYPES.SUBSTITUTION, side, {
            player: substitute.name,
            playerOut: outPlayer.name,
            playerIn: substitute.name,
            message: `Substitution: ${substitute.name} replaces ${outPlayer.name}${reason ? ` (${reason})` : ""}.`
        });
        return true;
    }

    log(0, EVENT_TYPES.KICK_OFF, null, { message: "Kick-off." });

    for (let minute = 1; minute <= 90; minute++) {
        if (minute === 46) log(45, EVENT_TYPES.HALF_TIME, null, { message: "Half-time." });

        for (const side of ["home", "away"]) {
            const oppSide = side === "home" ? "away" : "home";
            const att = teams[side];
            const def = teams[oppSide];

            const attManDown = manDownFactor(sentOffCountBySide[side]);
            const defManDown = manDownFactor(sentOffCountBySide[oppSide]);

            const attRating = (att.ratings.ATT - fatigue(minute)) * attManDown;
            const defRating = (def.ratings.DEF - fatigue(minute)) * defManDown;
            const midDiff = (att.ratings.MID * attManDown) - (def.ratings.MID * defManDown);

            const attackChance = clamp(
                0.10 + (attRating - defRating) / 400 + (att.coach.attack_bias - 50) / 800 + midDiff / 1000 + (1 - defManDown) * 0.06,
                0.04, 0.34
            );

            if (rng() < attackChance) {
                const bigChanceProb = clamp(0.3 + (attRating - defRating) / 200, 0.1, 0.6);
                const isBigChance = rng() < bigChanceProb;
                const scorerPool = att.buckets.ATT.length ? att.buckets.ATT : att.buckets.MID;
                const scorer = pick(rng, scorerPool);

                const baseGoalProb = isBigChance
                    ? clamp(0.32 + (attRating - defRating) / 150, 0.12, 0.55)
                    : clamp(0.10 + (attRating - defRating) / 220, 0.03, 0.25);
                const gkFactor = (100 - def.ratings.GK * defManDown) / 100;
                const goalProb = clamp(baseGoalProb * (0.6 + gkFactor), 0.02, 0.6);

                if (rng() < goalProb) {
                    score[side]++;
                    log(minute, EVENT_TYPES.GOAL, side, { player: scorer.name, message: `GOAL! ${scorer.name} scores!` });
                } else if (rng() < 0.55) {
                    log(minute, EVENT_TYPES.SHOT_SAVED, side, { player: scorer.name, message: `${scorer.name}'s effort is saved.` });
                } else {
                    log(minute, EVENT_TYPES.SHOT_OFF, side, { player: scorer.name, message: `${scorer.name} shoots wide.` });
                }
            } else if (rng() < 0.10) {
                log(minute, EVENT_TYPES.CORNER, side, { message: "Corner kick." });
            } else if (rng() < 0.05) {
                log(minute, EVENT_TYPES.OFFSIDE, side, { message: "Flagged for offside." });
            }

            const foulChance = clamp(0.05 + (def.coach.aggression - 50) / 600 + fatigue(minute) / 100 + (1 - defManDown) * 0.03, 0.02, 0.20);
            if (rng() < foulChance) {
                const foulPool = [...def.buckets.DEF, ...def.buckets.MID].filter((p) => !sentOff.has(p.name));
                const fallbackPool = def.buckets.ATT.filter((p) => !sentOff.has(p.name));
                const pool = foulPool.length ? foulPool : fallbackPool;
                if (pool.length) {
                    const fouler = pick(rng, pool);
                    log(minute, EVENT_TYPES.FOUL, oppSide, { player: fouler.name, message: `Foul by ${fouler.name}.` });

                    const cardRoll = rng();
                    if (cardRoll < 0.03) {
                        sentOff.add(fouler.name);
                        sentOffCountBySide[oppSide]++;
                        log(minute, EVENT_TYPES.RED, oppSide, { player: fouler.name, message: `RED CARD! ${fouler.name} is sent off!` });
                    } else if (cardRoll < 0.20) {
                        yellowCounts[fouler.name] = (yellowCounts[fouler.name] || 0) + 1;
                        if (yellowCounts[fouler.name] >= 2) {
                            sentOff.add(fouler.name);
                            sentOffCountBySide[oppSide]++;
                            log(minute, EVENT_TYPES.RED, oppSide, { player: fouler.name, message: `Second yellow — ${fouler.name} is off!` });
                        } else {
                            log(minute, EVENT_TYPES.YELLOW, oppSide, { player: fouler.name, message: `Yellow card for ${fouler.name}.` });
                        }
                    }
                }
            }

            // Injury -> attempt a real substitution
            if (rng() < 0.003) {
                const teamObj = teams[side];
                const allActive = [...teamObj.buckets.GK, ...teamObj.buckets.DEF, ...teamObj.buckets.MID, ...teamObj.buckets.ATT]
                    .filter((p) => !sentOff.has(p.name));

                if (allActive.length) {
                    const injured = pick(rng, allActive);
                    log(minute, EVENT_TYPES.INJURY, side, { player: injured.name, message: `${injured.name} is down injured.` });
                    attemptSubstitution(side, minute, injured, "injured");
                }
            }

            // Tactical substitutions — managers make changes from minute 55+
            // Higher chance when trailing or when fatigue is high
            if (minute >= 55 && subsUsedBySide[side] < MAX_SUBS_PER_TEAM) {
                const isTrailing = (side === "home" && score.home < score.away) ||
                    (side === "away" && score.away < score.home);
                const fatigueLevel = fatigue(minute);

                // Base ~4% chance per minute past 55, increased when trailing or fatigued
                const tacticalSubChance = clamp(
                    0.04 + (isTrailing ? 0.05 : 0) + fatigueLevel * 0.01,
                    0.02, 0.20
                );

                if (rng() < tacticalSubChance) {
                    const teamObj = teams[side];
                    // Pick from outfield players only (never sub the GK tactically)
                    const outfieldActive = [...teamObj.buckets.DEF, ...teamObj.buckets.MID, ...teamObj.buckets.ATT]
                        .filter((p) => !sentOff.has(p.name));

                    if (outfieldActive.length) {
                        // Prefer subbing in attackers when trailing, defenders when leading
                        let targetPlayer;
                        if (isTrailing && teamObj.buckets.DEF.filter((p) => !sentOff.has(p.name)).length > 1) {
                            const defActive = teamObj.buckets.DEF.filter((p) => !sentOff.has(p.name));
                            targetPlayer = pick(rng, defActive);
                        } else {
                            targetPlayer = pick(rng, outfieldActive);
                        }
                        attemptSubstitution(side, minute, targetPlayer, "tactical");
                    }
                }
            }
        }
    }

    const stoppage = Math.floor(rng() * 5) + 1;
    log(90 + stoppage, EVENT_TYPES.FULL_TIME, null, { message: `Full-time: ${score.home} - ${score.away}.` });

    return { events, score, redCards: [...sentOff], yellowCounts, subsUsed: subsUsedBySide };
}