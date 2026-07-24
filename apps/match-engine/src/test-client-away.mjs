import { io } from "socket.io-client";

const socket = io("http://localhost:4100");
const matchId = "test-match-room-2";

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

socket.on("connect", () => {
    console.log("[AWAY] connected as", socket.id);
    socket.emit("join_match", { matchId, role: "away" });

    // Deliberately wait longer than home, so you can SEE the "waiting for opponent" message on home's side
    setTimeout(() => {
        console.log("[AWAY] submitting team...");
        socket.emit("submit_team", {
            matchId,
            role: "away",
            playerBreakdown: awayBreakdown,
            coach: { aggression: 65, attack_bias: 45, def_line_height: 40 }
        });
    }, 4000);
});

socket.on("status", (d) => console.log("[AWAY status]", d.message));
socket.on("error_message", (d) => console.log("[AWAY error]", d.message));
socket.on("kickoff", (d) => console.log(`\n[AWAY] ${d.message}\n`));
socket.on("match_event", (e) => console.log(`[AWAY][${e.minute}'] ${e.message}`));
socket.on("match_ended", (d) => {
    console.log(`\n[AWAY] FULL TIME — ${JSON.stringify(d.score)}`);
    socket.disconnect();
});