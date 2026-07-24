import { io } from "socket.io-client";

const socket = io("http://localhost:4100");

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

const matchId = "test-match-room-1";

socket.on("connect", () => {
    console.log("Connected as", socket.id);
    socket.emit("join_match", { matchId });
    socket.emit("ready", {
        matchId,
        home: { playerBreakdown: homeBreakdown, coach: { aggression: 40, attack_bias: 65, def_line_height: 60 } },
        away: { playerBreakdown: awayBreakdown, coach: { aggression: 65, attack_bias: 45, def_line_height: 40 } },
        seed: "socket-test-001"
    });
});

socket.on("kickoff", (data) => console.log(`\n${data.message}\n`));
socket.on("match_event", (e) => console.log(`[${e.minute}'] ${e.message}`));
socket.on("match_ended", (data) => {
    console.log(`\nFULL TIME — Score: ${JSON.stringify(data.score)}`);
    console.log("Red cards:", data.redCards);
    console.log("Yellow cards:", data.yellowCounts);
    socket.disconnect();
});