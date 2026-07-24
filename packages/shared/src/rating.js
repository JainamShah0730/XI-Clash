import { positionFitMultiplier, POSITION_WEIGHTS } from "./positions.js";
import { calculateChemistry } from "./chemistry.js";

// startingXI: [{ player: {...}, slotPositionType: "ST" }, ...]  (11 entries)
// coach: { style, aggression, attack_bias, def_line_height }
export function calculateTeam({ startingXI, coach }) {
    const players = startingXI.map((entry) => entry.player);
    const chemistry = calculateChemistry(players);

    let weightedSum = 0;
    let weightTotal = 0;

    const playerBreakdown = startingXI.map(({ player, slotPositionType }) => {
        const fit = positionFitMultiplier(
            player.position_primary,
            player.position_secondary,
            slotPositionType
        );
        const effectiveRating = Math.round(player.ovr_base * fit);
        const weight = POSITION_WEIGHTS[slotPositionType] ?? 1.0;

        weightedSum += effectiveRating * weight;
        weightTotal += weight;

        return {
            name: player.name,
            slotPositionType,
            fit,
            effectiveRating
        };
    });

    const baseOVR = weightedSum / weightTotal;

    // Chemistry bonus: 0-100 chem maps to +0 to +3 OVR
    const chemistryBonus = (chemistry / 100) * 3;

    // Placeholder coach fit bonus — refine later once formation/style matchups
    // are defined in more detail. For now: aggressive coaches on high-press
    // formations get a small bump, everything else is neutral.
    const coachBonus = coach ? 0 : 0; // TODO: expand this

    const teamOVR = Math.round(baseOVR + chemistryBonus + coachBonus);

    return {
        teamOVR,
        chemistry,
        playerBreakdown
    };
}