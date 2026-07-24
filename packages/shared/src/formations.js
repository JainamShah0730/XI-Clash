// Coordinates are on a 0-100 x 0-100 pitch (x: left->right, y: own goal->opponent goal)
// position_type must be one of the POSITIONS in positions.js

export const FORMATIONS = {
    "4-3-3": {
        name: "4-3-3",
        slots: [
            { slot_id: "GK", position_type: "GK", x: 50, y: 5 },
            { slot_id: "LB", position_type: "FB", x: 15, y: 25 },
            { slot_id: "CB1", position_type: "CB", x: 38, y: 20 },
            { slot_id: "CB2", position_type: "CB", x: 62, y: 20 },
            { slot_id: "RB", position_type: "FB", x: 85, y: 25 },
            { slot_id: "CM1", position_type: "CM", x: 30, y: 45 },
            { slot_id: "CM2", position_type: "CM", x: 50, y: 40 },
            { slot_id: "CM3", position_type: "CM", x: 70, y: 45 },
            { slot_id: "LW", position_type: "W", x: 15, y: 75 },
            { slot_id: "ST", position_type: "ST", x: 50, y: 85 },
            { slot_id: "RW", position_type: "W", x: 85, y: 75 }
        ]
    },
    "4-4-2": {
        name: "4-4-2",
        slots: [
            { slot_id: "GK", position_type: "GK", x: 50, y: 5 },
            { slot_id: "LB", position_type: "FB", x: 15, y: 25 },
            { slot_id: "CB1", position_type: "CB", x: 38, y: 20 },
            { slot_id: "CB2", position_type: "CB", x: 62, y: 20 },
            { slot_id: "RB", position_type: "FB", x: 85, y: 25 },
            { slot_id: "LM", position_type: "W", x: 15, y: 50 },
            { slot_id: "CM1", position_type: "CM", x: 38, y: 45 },
            { slot_id: "CM2", position_type: "CM", x: 62, y: 45 },
            { slot_id: "RM", position_type: "W", x: 85, y: 50 },
            { slot_id: "ST1", position_type: "ST", x: 38, y: 80 },
            { slot_id: "ST2", position_type: "ST", x: 62, y: 80 }
        ]
    },
    "3-5-2": {
        name: "3-5-2",
        slots: [
            { slot_id: "GK", position_type: "GK", x: 50, y: 5 },
            { slot_id: "CB1", position_type: "CB", x: 25, y: 24 },
            { slot_id: "CB2", position_type: "CB", x: 50, y: 22 },
            { slot_id: "CB3", position_type: "CB", x: 75, y: 24 },
            { slot_id: "LWB", position_type: "FB", x: 10, y: 45 },
            { slot_id: "CM1", position_type: "CM", x: 35, y: 45 },
            { slot_id: "DM", position_type: "DM", x: 50, y: 35 },
            { slot_id: "CM2", position_type: "CM", x: 65, y: 45 },
            { slot_id: "RWB", position_type: "FB", x: 90, y: 45 },
            { slot_id: "ST1", position_type: "ST", x: 38, y: 80 },
            { slot_id: "ST2", position_type: "ST", x: 62, y: 80 }
        ]
    },
    "4-2-3-1": {
        name: "4-2-3-1",
        slots: [
            { slot_id: "GK", position_type: "GK", x: 50, y: 5 },
            { slot_id: "LB", position_type: "FB", x: 15, y: 25 },
            { slot_id: "CB1", position_type: "CB", x: 38, y: 20 },
            { slot_id: "CB2", position_type: "CB", x: 62, y: 20 },
            { slot_id: "RB", position_type: "FB", x: 85, y: 25 },
            { slot_id: "DM1", position_type: "DM", x: 38, y: 38 },
            { slot_id: "DM2", position_type: "DM", x: 62, y: 38 },
            { slot_id: "AM", position_type: "AM", x: 50, y: 60 },
            { slot_id: "LW", position_type: "W", x: 15, y: 65 },
            { slot_id: "RW", position_type: "W", x: 85, y: 65 },
            { slot_id: "ST", position_type: "ST", x: 50, y: 85 }
        ]
    },

    "3-4-3": {
        name: "3-4-3",
        slots: [
            { slot_id: "GK", position_type: "GK", x: 50, y: 5 },
            { slot_id: "CB1", position_type: "CB", x: 25, y: 24 },
            { slot_id: "CB2", position_type: "CB", x: 50, y: 22 },
            { slot_id: "CB3", position_type: "CB", x: 75, y: 24 },
            { slot_id: "LWB", position_type: "FB", x: 10, y: 45 },
            { slot_id: "CM1", position_type: "CM", x: 38, y: 42 },
            { slot_id: "CM2", position_type: "CM", x: 62, y: 42 },
            { slot_id: "RWB", position_type: "FB", x: 90, y: 45 },
            { slot_id: "LW", position_type: "W", x: 20, y: 78 },
            { slot_id: "ST", position_type: "ST", x: 50, y: 85 },
            { slot_id: "RW", position_type: "W", x: 80, y: 78 }
        ]
    },
    "5-3-2": {
        name: "5-3-2",
        slots: [
            { slot_id: "GK", position_type: "GK", x: 50, y: 5 },
            { slot_id: "LWB", position_type: "FB", x: 8, y: 30 },
            { slot_id: "CB1", position_type: "CB", x: 28, y: 24 },
            { slot_id: "CB2", position_type: "CB", x: 50, y: 22 },
            { slot_id: "CB3", position_type: "CB", x: 72, y: 24 },
            { slot_id: "RWB", position_type: "FB", x: 92, y: 30 },
            { slot_id: "CM1", position_type: "CM", x: 32, y: 48 },
            { slot_id: "CM2", position_type: "CM", x: 50, y: 42 },
            { slot_id: "CM3", position_type: "CM", x: 68, y: 48 },
            { slot_id: "ST1", position_type: "ST", x: 38, y: 82 },
            { slot_id: "ST2", position_type: "ST", x: 62, y: 82 }
        ]
    },
    "4-1-4-1": {
        name: "4-1-4-1",
        slots: [
            { slot_id: "GK", position_type: "GK", x: 50, y: 5 },
            { slot_id: "LB", position_type: "FB", x: 15, y: 25 },
            { slot_id: "CB1", position_type: "CB", x: 38, y: 20 },
            { slot_id: "CB2", position_type: "CB", x: 62, y: 20 },
            { slot_id: "RB", position_type: "FB", x: 85, y: 25 },
            { slot_id: "DM", position_type: "DM", x: 50, y: 35 },
            { slot_id: "LM", position_type: "W", x: 15, y: 55 },
            { slot_id: "CM1", position_type: "CM", x: 38, y: 52 },
            { slot_id: "CM2", position_type: "CM", x: 62, y: 52 },
            { slot_id: "RM", position_type: "W", x: 85, y: 55 },
            { slot_id: "ST", position_type: "ST", x: 50, y: 85 }
        ]
    },
    "4-3-1-2": {
        name: "4-3-1-2",
        slots: [
            { slot_id: "GK", position_type: "GK", x: 50, y: 5 },
            { slot_id: "LB", position_type: "FB", x: 15, y: 25 },
            { slot_id: "CB1", position_type: "CB", x: 38, y: 20 },
            { slot_id: "CB2", position_type: "CB", x: 62, y: 20 },
            { slot_id: "RB", position_type: "FB", x: 85, y: 25 },
            { slot_id: "CM1", position_type: "CM", x: 30, y: 42 },
            { slot_id: "CM2", position_type: "CM", x: 50, y: 38 },
            { slot_id: "CM3", position_type: "CM", x: 70, y: 42 },
            { slot_id: "AM", position_type: "AM", x: 50, y: 62 },
            { slot_id: "ST1", position_type: "ST", x: 38, y: 85 },
            { slot_id: "ST2", position_type: "ST", x: 62, y: 85 }
        ]
    },
    "4-5-1": {
        name: "4-5-1",
        slots: [
            { slot_id: "GK", position_type: "GK", x: 50, y: 5 },
            { slot_id: "LB", position_type: "FB", x: 15, y: 25 },
            { slot_id: "CB1", position_type: "CB", x: 38, y: 20 },
            { slot_id: "CB2", position_type: "CB", x: 62, y: 20 },
            { slot_id: "RB", position_type: "FB", x: 85, y: 25 },
            { slot_id: "LM", position_type: "W", x: 12, y: 50 },
            { slot_id: "DM", position_type: "DM", x: 50, y: 38 },
            { slot_id: "CM1", position_type: "CM", x: 35, y: 48 },
            { slot_id: "CM2", position_type: "CM", x: 65, y: 48 },
            { slot_id: "RM", position_type: "W", x: 88, y: 50 },
            { slot_id: "ST", position_type: "ST", x: 50, y: 85 }
        ]
    }
};