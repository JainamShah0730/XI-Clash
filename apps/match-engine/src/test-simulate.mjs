import { computeTeamProfile } from "./simulation/teamProfile.js";
import { simulateMatch } from "./simulation/simulateMatch.js";

// Home: your real "Dream XI" breakdown from the earlier /teams response
const homeBreakdown = [
    { name: "Alisson", slotPositionType: "GK", effectiveRating: 88 },
    { name: "Trent Alexander-Arnold", slotPositionType: "FB", effectiveRating: 87 },
    { name: "Virgil van Dijk", slotPositionType: "CB", effectiveRating: 89 },
    { name: "Ruben Dias", slotPositionType: "CB", effectiveRating: 87 },
    { name: "Achraf Hakimi", slotPositionType: "FB", effectiveRating: 86 },
    { name: "Rodri", slotPositionType: "CM", effectiveRating: 90 },
    { name: "Kevin De Bruyne", slotPositionType: "CM", effectiveRating: 90 },
    { name: "Jude Bellingham", slotPositionType: "CM", effectiveRating: 90 },
    { name: "Bukayo Saka", slotPositionType: "W", effectiveRating: 88 },
    { name: "Erling Haaland", slotPositionType: "ST", effectiveRating: 91 },
    { name: "Vinicius Jr", slotPositionType: "W", effectiveRating: 89 }
];

// Away: a deliberately weaker mock squad to see the rating gap play out
const awayBreakdown = [
    { name: "Keeper B", slotPositionType: "GK", effectiveRating: 74 },
    { name: "FB Left B", slotPositionType: "FB", effectiveRating: 72 },
    { name: "CB1 B", slotPositionType: "CB", effectiveRating: 73 },
    { name: "CB2 B", slotPositionType: "CB", effectiveRating: 71 },
    { name: "FB Right B", slotPositionType: "FB", effectiveRating: 72 },
    { name: "CM1 B", slotPositionType: "CM", effectiveRating: 75 },
    { name: "CM2 B", slotPositionType: "CM", effectiveRating: 74 },
    { name: "CM3 B", slotPositionType: "CM", effectiveRating: 73 },
    { name: "W Left B", slotPositionType: "W", effectiveRating: 76 },
    { name: "ST B", slotPositionType: "ST", effectiveRating: 78 },
    { name: "W Right B", slotPositionType: "W", effectiveRating: 75 }
];

const homeCoach = { aggression: 40, attack_bias: 65, def_line_height: 60 };
const awayCoach = { aggression: 65, attack_bias: 45, def_line_height: 40 };

const home = { profile: computeTeamProfile(homeBreakdown, homeCoach) };
const away = { profile: computeTeamProfile(awayBreakdown, awayCoach) };

const result = simulateMatch({ home, away, seed: "test-match-001" });

console.log(`\n=== FINAL SCORE: Home ${result.score.home} - ${result.score.away} Away ===\n`);
for (const e of result.events) {
    console.log(`[${e.minute}'] ${e.message}`);
}
console.log("\nRed cards:", result.redCards);
console.log("Yellow cards:", result.yellowCounts);