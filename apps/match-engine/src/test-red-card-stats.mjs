import { computeTeamProfile } from "./simulation/teamProfile.js";
import { simulateMatch } from "./simulation/simulateMatch.js";

const evenBreakdown = (label) => [
    { name: `${label} GK`, slotPositionType: "GK", effectiveRating: 82 },
    { name: `${label} CB1`, slotPositionType: "CB", effectiveRating: 82 },
    { name: `${label} CB2`, slotPositionType: "CB", effectiveRating: 82 },
    { name: `${label} FB1`, slotPositionType: "FB", effectiveRating: 82 },
    { name: `${label} FB2`, slotPositionType: "FB", effectiveRating: 82 },
    { name: `${label} CM1`, slotPositionType: "CM", effectiveRating: 82 },
    { name: `${label} CM2`, slotPositionType: "CM", effectiveRating: 82 },
    { name: `${label} CM3`, slotPositionType: "CM", effectiveRating: 82 },
    { name: `${label} W1`, slotPositionType: "W", effectiveRating: 82 },
    { name: `${label} ST`, slotPositionType: "ST", effectiveRating: 82 },
    { name: `${label} W2`, slotPositionType: "W", effectiveRating: 82 }
];

const coach = { aggression: 50, attack_bias: 50, def_line_height: 50 };
const home = { profile: computeTeamProfile(evenBreakdown("Home"), coach) };
const away = { profile: computeTeamProfile(evenBreakdown("Away"), coach) };

let noCardDiffs = [];   // (home goals - away goals) when nobody sent off
let homeRedDiffs = [];  // when HOME had a player sent off
let awayRedDiffs = [];  // when AWAY had a player sent off

for (let i = 0; i < 500; i++) {
    const seed = `stat-test-${i}`;
    const result = simulateMatch({ home, away, seed });
    const diff = result.score.home - result.score.away;

    const homeSentOff = result.redCards.some((name) => name.startsWith("Home"));
    const awaySentOff = result.redCards.some((name) => name.startsWith("Away"));

    if (result.redCards.length === 0) noCardDiffs.push(diff);
    else if (homeSentOff && !awaySentOff) homeRedDiffs.push(diff);
    else if (awaySentOff && !homeSentOff) awayRedDiffs.push(diff);
    // matches with reds on both sides are skipped — too noisy to interpret simply
}

const avg = (arr) => (arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2) : "n/a");

console.log(`No cards:        avg (home-away) diff = ${avg(noCardDiffs)}   (n=${noCardDiffs.length})`);
console.log(`Home sent off:   avg (home-away) diff = ${avg(homeRedDiffs)}   (n=${homeRedDiffs.length})`);
console.log(`Away sent off:   avg (home-away) diff = ${avg(awayRedDiffs)}   (n=${awayRedDiffs.length})`);