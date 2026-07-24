export const POSITIONS = ["GK", "CB", "FB", "DM", "CM", "AM", "W", "ST"];

// How "far" one position is from another, used to compute out-of-position penalties.
// 0 = exact match. Higher = bigger mismatch. Missing pairs default to a max penalty distance.
const DISTANCE = {
    GK: { GK: 0 },
    CB: { CB: 0, FB: 1, DM: 2 },
    FB: { FB: 0, CB: 1, W: 2, DM: 2 },
    DM: { DM: 0, CB: 2, CM: 1 },
    CM: { CM: 0, DM: 1, AM: 1 },
    AM: { AM: 0, CM: 1, W: 1, ST: 2 },
    W: { W: 0, FB: 2, AM: 1, ST: 2 },
    ST: { ST: 0, AM: 2, W: 2 }
};

const MAX_DISTANCE_PENALTY = 3; // any pair not explicitly listed is treated this far apart

// Returns a multiplier 0-1 applied to a player's rating based on how well their
// primary/secondary position fits the slot they're assigned to.
export function positionFitMultiplier(playerPrimary, playerSecondary, slotPositionType) {
    const distTo = (from) => {
        if (!from) return MAX_DISTANCE_PENALTY;
        if (from === slotPositionType) return 0;
        return DISTANCE[from]?.[slotPositionType] ?? MAX_DISTANCE_PENALTY;
    };

    const dist = Math.min(distTo(playerPrimary), distTo(playerSecondary));

    switch (dist) {
        case 0: return 1.0;    // exact position
        case 1: return 0.88;   // adjacent position
        case 2: return 0.68;   // stretch position
        default: return 0.5;   // way out of position
    }
}

// position_weight per formation "band" — used when computing team OVR so formations
// that push more attackers weigh ST/W more heavily than a defensive-minded one.
export const POSITION_WEIGHTS = {
    GK: 1.0,
    CB: 1.0,
    FB: 0.9,
    DM: 1.0,
    CM: 1.0,
    AM: 1.05,
    W: 1.0,
    ST: 1.1
};