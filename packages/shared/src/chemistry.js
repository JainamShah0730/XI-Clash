// Computes a 0-100 chemistry score from pairwise real-world links between
// the 11 starting players: shared club, shared nation, shared league.
// Scores stack — a pair sharing club AND nation gets both bonuses.

const CLUB_LINK = 2;
const NATION_LINK = 1;
const LEAGUE_LINK = 1;
const MAX_LINK_PER_PAIR = CLUB_LINK + NATION_LINK + LEAGUE_LINK; // 4

export function calculateChemistry(players) {
    if (players.length < 2) return 0;

    let rawScore = 0;
    let pairCount = 0;

    for (let i = 0; i < players.length; i++) {
        for (let j = i + 1; j < players.length; j++) {
            const a = players[i];
            const b = players[j];
            pairCount++;

            if (a.real_club && a.real_club === b.real_club) rawScore += CLUB_LINK;
            if (a.nation && a.nation === b.nation) rawScore += NATION_LINK;
            if (a.league && a.league === b.league) rawScore += LEAGUE_LINK;
        }
    }

    const maxPossible = pairCount * MAX_LINK_PER_PAIR;
    const chemistry = Math.round((rawScore / maxPossible) * 100);

    return Math.max(0, Math.min(100, chemistry));
}