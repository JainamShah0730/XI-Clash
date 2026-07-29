import { useState } from "react";

const TOPICS = {
    rules: {
        label: "Rules & Basics",
        sections: [
            {
                title: "How a match works",
                body: "A match is 90 minutes, split into two 45-minute halves with a short break at half-time. The referee adds \"stoppage time\" at the end of each half to make up for time lost to injuries, substitutions, and other stoppages. Whoever scores more goals wins — if it's level, most league matches simply end in a draw. Knockout matches (cups, tournaments) may add 30 minutes of extra time and then a penalty shootout if it's still level."
            },
            {
                title: "Offside",
                body: "An attacking player is offside if, at the moment the ball is passed to them, they're nearer the opponent's goal line than both the ball and the second-last opponent (usually the last outfield defender) — and they're actively involved in the play. It doesn't apply in your own half, and it doesn't apply at throw-ins, goal kicks, or corners. It exists to stop attackers just camping out near the goal waiting for a long ball."
            },
            {
                title: "Fouls & cards",
                body: "A foul is called for things like tripping, pushing, or dangerous tackles. A yellow card is a formal warning; two yellows in one match equal a red card and an early trip to the locker room. A straight red (for a serious foul or violent conduct) sends a player off immediately — their team then plays the rest of the match with one fewer player, exactly the disadvantage XI Clash's match engine simulates."
            },
            {
                title: "Penalties & free kicks",
                body: "A foul inside the defending team's penalty area (the big box around the goal) results in a penalty kick — one shooter, one goalkeeper, from 12 yards out. A foul outside the box gives a free kick instead, which can be direct (shoot straight at goal) or indirect depending on the offense."
            },
            {
                title: "Substitutions",
                body: "Most competitions allow 5 substitutions per team per match (this varies by competition and has changed over the years). Once a player is subbed off, they can't return to that match — which is exactly why an injury in XI Clash permanently swaps in a bench player rather than the original returning later."
            }
        ]
    },
    positions: {
        label: "Positions & Formations",
        sections: [
            {
                title: "Goalkeeper (GK)",
                body: "The only player allowed to use their hands, and only inside their own penalty area. Last line of defense."
            },
            {
                title: "Defenders — Centre-Back (CB) & Full-Back (FB)",
                body: "Centre-backs sit in the middle of the defense, focused on stopping the opposition's central attackers and winning aerial duels. Full-backs patrol the wide areas — traditionally defensive, but in modern football they often push forward to support attacks too, which is why XI Clash treats FB as reasonably close to both CB and W on the position-fit scale."
            },
            {
                title: "Midfielders — DM, CM, AM",
                body: "The engine room. Defensive Midfielders (DM) sit deepest, shielding the back line and breaking up opposition attacks. Central Midfielders (CM) are the all-rounders, linking defense to attack. Attacking Midfielders (AM) play higher up, just behind the strikers, focused on creating chances."
            },
            {
                title: "Attackers — Winger (W) & Striker (ST)",
                body: "Wingers play out wide and attack down the flanks, using pace and dribbling to beat defenders and cross or cut inside. Strikers lead the line centrally — their main job is finishing chances and scoring goals."
            },
            {
                title: "Why formation matters in XI Clash",
                body: "A formation (like 4-3-3 or 4-2-3-1) just describes how many players occupy each area of the pitch. Real teams pick formations to suit their squad's strengths — a team full of strong wingers might favor a 4-3-3 to get them the ball wide; a team with dominant central midfielders might prefer a 4-2-3-1 to overload the middle. Slotting a player into a position far from their natural role (like a striker at center-back) is exactly what the game's position-fit penalty is modeling."
            }
        ]
    },
    competitions: {
        label: "Competitions",
        sections: [
            {
                title: "Domestic Leagues",
                body: "Each country runs its own top-flight league where clubs play each other home and away across a season — the Premier League (England), La Liga (Spain), Bundesliga (Germany), Serie A (Italy), and Ligue 1 (France) are the five most-watched leagues in the world, and where most of the players in XI Clash's roster currently play their club football."
            },
            {
                title: "UEFA Champions League (UCL)",
                body: "The top continental club competition in Europe — the best-performing teams from each domestic league qualify each season to compete against each other for the biggest prize in club football. Since the 2024-25 season it uses a \"Swiss model\" league phase (every team plays a set number of different opponents rather than being split into small groups) before moving into a knockout bracket."
            },
            {
                title: "FIFA World Cup",
                body: "The biggest tournament in the sport — national teams (not clubs) compete every four years for the title. The 2026 edition, co-hosted by the USA, Canada, and Mexico, is the first to expand the tournament to 48 teams, up from 32."
            },
            {
                title: "UEFA Euro (European Championship)",
                body: "The continental championship for European national teams, also held every four years (offset two years from the World Cup). Comparable in prestige to the World Cup, just restricted to European nations."
            },
            {
                title: "Domestic Cups",
                body: "Most countries also run a separate knockout cup competition alongside their league (like England's FA Cup) — single-elimination, open to a much wider range of clubs than just the top division, which is why cup competitions are famous for occasional giant-killing upsets."
            }
        ]
    },
    glossary: {
        label: "XI Clash Glossary",
        sections: [
            { title: "OVR (Overall Rating)", body: "A single number summarizing how good a player or team is, derived from their individual attributes and, for a team, adjusted by chemistry and position fit." },
            { title: "Chemistry", body: "How well your starting XI's real-world links (shared club, nation, league) mesh together — higher chemistry gives a small boost to your Team OVR." },
            { title: "Position Fit", body: "How well a player's real position matches the formation slot you've assigned them to — an exact match counts fully, but a striker played at center-back gets a heavy penalty." },
            { title: "Elo Rating", body: "Your overall skill ranking, which rises when you beat higher-rated opponents and falls when you lose to lower-rated ones — the same rating system used in chess." },
            { title: "Tactic vs. Coach", body: "Your Coach is a named identity with a preferred playing style; the Tactic is the actual set of in-match parameters (aggression, attacking bias, defensive line) you choose to run — picking a tactic that matches your coach's preference grants a small bonus." }
        ]
    }
};

export default function LearnHub() {
    const [activeTopic, setActiveTopic] = useState("rules");
    const topic = TOPICS[activeTopic];

    return (
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "1.5rem", padding: "1rem" }}>
            <div>
                <h2 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Learn Football</h2>
                {Object.entries(TOPICS).map(([key, t]) => (
                    <div
                        key={key}
                        onClick={() => setActiveTopic(key)}
                        style={{
                            padding: "0.6rem 0.8rem", marginBottom: "0.4rem", borderRadius: 6, cursor: "pointer",
                            background: activeTopic === key ? "rgba(0,229,199,0.1)" : "transparent",
                            borderLeft: activeTopic === key ? "3px solid var(--cyan)" : "3px solid transparent",
                            color: activeTopic === key ? "var(--text)" : "var(--text-dim)",
                            fontWeight: activeTopic === key ? 600 : 400
                        }}
                    >
                        {t.label}
                    </div>
                ))}
            </div>

            <div>
                <h2 style={{ marginBottom: "1rem" }}>{topic.label}</h2>
                {topic.sections.map((s, i) => (
                    <div key={i} className="card" style={{ marginBottom: "0.9rem" }}>
                        <h3 style={{ fontSize: "0.95rem", color: "var(--gold)", marginBottom: "0.5rem" }}>{s.title}</h3>
                        <p style={{ margin: 0, lineHeight: 1.6, color: "var(--text)", fontSize: "0.92rem" }}>{s.body}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}