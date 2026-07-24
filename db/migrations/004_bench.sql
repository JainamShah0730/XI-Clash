CREATE TABLE IF NOT EXISTS team_bench (
  team_id     UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  player_id   UUID NOT NULL REFERENCES players(id),
  bench_order SMALLINT NOT NULL CHECK (bench_order BETWEEN 1 AND 5),
  PRIMARY KEY (team_id, bench_order)
);