import "dotenv/config";

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

// Low max_tokens deliberately — this is meant to read like punchy broadcast
// commentary, not an essay. Also keeps cost/latency down since this runs
// several times per match.
export async function callDeepSeek(systemPrompt, userPrompt, maxTokens = 2000) {
    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
    if (!DEEPSEEK_API_KEY) {
        console.warn("DEEPSEEK_API_KEY not set — skipping AI commentary.");
        return null;
    }

    try {
        const res = await fetch(DEEPSEEK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-v4-pro",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                max_tokens: maxTokens,
                temperature: 0.85
            })
        });

        if (!res.ok) {
            console.error("DeepSeek API error:", res.status, await res.text());
            return null;
        }

        const data = await res.json();
        return data.choices?.[0]?.message?.content?.trim() || null;
    } catch (err) {
        console.error("DeepSeek call failed:", err);
        return null; // AI commentary is an enhancement, never block the match on it
    }
}