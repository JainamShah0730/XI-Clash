import { calculateTeam } from "./rating.js";

// Fake data — swap in real players once you've seeded the DB
const mockPlayers = [
    { name: "GK Test", position_primary: "GK", ovr_base: 85, real_club: "Club A", nation: "England", league: "EPL" },
    { name: "CB1 Test", position_primary: "CB", ovr_base: 84, real_club: "Club A", nation: "England", league: "EPL" },
    { name: "ST Test", position_primary: "ST", ovr_base: 90, real_club: "Club B", nation: "Argentina", league: "La Liga" }
];

const startingXI = [
    { player: mockPlayers[0], slotPositionType: "GK" },
    { player: mockPlayers[1], slotPositionType: "CB" },
    { player: mockPlayers[2], slotPositionType: "ST" }
];

const result = calculateTeam({ startingXI, coach: null });
console.log(JSON.stringify(result, null, 2));