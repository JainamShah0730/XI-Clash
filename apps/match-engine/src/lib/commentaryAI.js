import { callDeepSeek } from "./deepseek.js";

const SYSTEM_PROMPT = `You are a sharp, concise football (soccer) broadcast commentator.
Write like a real TV pundit — punchy, specific, no fluff, no hashtags, no emoji.
Keep it to 2-3 sentences maximum. Never invent stats or events not given to you.`

export async function generatePreMatchPreview(homeTeamName, awayTeamName, homeProfile, awayProfile) {
    const prompt = `Home team "${homeTeamName}" — attack ${homeProfile.ratings.ATT.toFixed(0)}, midfield ${homeProfile.ratings.MID.toFixed(0)}, defense ${homeProfile.ratings.DEF.toFixed(0)}, tactic style: ${homeProfile.coach.style}.
Away team "${awayTeamName}" — attack ${awayProfile.ratings.ATT.toFixed(0)}, midfield ${awayProfile.ratings.MID.toFixed(0)}, defense ${awayProfile.ratings.DEF.toFixed(0)}, tactic style: ${awayProfile.coach.style}.
Give a short pre-match tactical preview.`;

    return callDeepSeek(SYSTEM_PROMPT, prompt, 2000)
}

export async function generateMomentumSummary(eventsInWindow, score, minuteRangeLabel) {
    const eventLines = eventsInWindow.map((e) => `[${e.minute}'] ${e.message}`).join("\n");
    const prompt = `Score is currently Home ${score.home} - ${score.away} Away.
Events from ${minuteRangeLabel}:
${eventLines || "Quiet spell, not much happening."}
Give a brief momentum update — who's on top right now and why.`;

    return callDeepSeek(SYSTEM_PROMPT, prompt, 2000)
}

export async function generatePostMatchAnalysis(finalScore, allEvents, homeTeamName, awayTeamName) {
    const goals = allEvents.filter((e) => e.type === "goal").map((e) => `[${e.minute}'] ${e.player} (${e.team})`)
    const cards = allEvents.filter((e) => e.type === "red_card" || e.type === "yellow_card").map((e) => `[${e.minute}'] ${e.type} - ${e.player}`)

    const prompt = `Final score : ${homeTeamName} ${finalScore.home} - ${finalScore.away} ${awayTeamName}.
    Goals: ${goals.join(";") || "none"}.
    Cards: ${cards.join(";") || "none"}.
    Give a short post-match analysis of how the game was decided. `

    return callDeepSeek(SYSTEM_PROMPT, prompt, 2000)
}
