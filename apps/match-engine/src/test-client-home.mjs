import { io } from "socket.io-client";

const socket = io("http://localhost:4100");
const matchId = "test-match-room-2";

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

socket.on("connect", () => {
    console.log("[HOME] connected as", socket.id);
    socket.emit("join_match", { matchId, role: "home" });

    setTimeout(() => {
        console.log("[HOME] submitting team...");
        socket.emit("submit_team", {
            matchId,
            role: "home",
            playerBreakdown: homeBreakdown,
            coach: { aggression: 40, attack_bias: 65, def_line_height: 60 }
        });
    }, 1000);
});

socket.on("status", (d) => console.log("[HOME status]", d.message));
socket.on("error_message", (d) => console.log("[HOME error]", d.message));
socket.on("kickoff", (d) => console.log(`\n[HOME] ${d.message}\n`));
socket.on("match_event", (e) => console.log(`[HOME][${e.minute}'] ${e.message}`));
socket.on("match_ended", (d) => {
    console.log(`\n[HOME] FULL TIME — ${JSON.stringify(d.score)}`);
    socket.disconnect();
});