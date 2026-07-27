const K_FACTOR = 32;

// Standard Elo expected-score formula — the probability (0-1) that `rating`
// beats `opponentRating`, based purely on the rating gap.
function expectedScore(rating, opponentRating) {
    return 1 / (1 + Math.pow(10, (opponentRating - rating) / 400));
}

// homeScore/awayScore are match goals — only used to determine win/draw/loss,
// margin of victory doesn't affect the Elo swing (standard implementation).
export function calculateEloChange(homeRating, awayRating, homeScore, awayScore) {
    let homeActual, awayActual;
    if (homeScore > awayScore) { homeActual = 1; awayActual = 0; }
    else if (homeScore < awayScore) { homeActual = 0; awayActual = 1; }
    else { homeActual = 0.5; awayActual = 0.5; }

    const homeExpected = expectedScore(homeRating, awayRating);
    const awayExpected = expectedScore(awayRating, homeRating);

    const newHomeRating = Math.round(homeRating + K_FACTOR * (homeActual - homeExpected));
    const newAwayRating = Math.round(awayRating + K_FACTOR * (awayActual - awayExpected));

    return {
        newHomeRating,
        newAwayRating,
        homeChange: newHomeRating - homeRating,
        awayChange: newAwayRating - awayRating
    };
}