-- XI Clash — consolidated final schema (for fresh deployments)

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username      TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  email         TEXT UNIQUE,
  elo_rating    INTEGER NOT NULL DEFAULT 1000,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE players (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL UNIQUE,
  real_club           TEXT,
  nation              TEXT,
  league              TEXT,
  position_primary    TEXT NOT NULL,
  position_secondary  TEXT,
  pac                 SMALLINT NOT NULL CHECK (pac BETWEEN 1 AND 99),
  sho                 SMALLINT NOT NULL CHECK (sho BETWEEN 1 AND 99),
  pas                 SMALLINT NOT NULL CHECK (pas BETWEEN 1 AND 99),
  dri                 SMALLINT NOT NULL CHECK (dri BETWEEN 1 AND 99),
  def                 SMALLINT NOT NULL CHECK (def BETWEEN 1 AND 99),
  phy                 SMALLINT NOT NULL CHECK (phy BETWEEN 1 AND 99),
  ovr_base            SMALLINT NOT NULL CHECK (ovr_base BETWEEN 1 AND 99),
  image_url           TEXT,
  api_football_id     INTEGER UNIQUE
);

CREATE TABLE tactics (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL UNIQUE,
  style           TEXT NOT NULL,
  aggression      SMALLINT NOT NULL CHECK (aggression BETWEEN 0 AND 100),
  attack_bias     SMALLINT NOT NULL CHECK (attack_bias BETWEEN 0 AND 100),
  def_line_height SMALLINT NOT NULL CHECK (def_line_height BETWEEN 0 AND 100)
);

CREATE TABLE coaches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL UNIQUE,
  preferred_style TEXT NOT NULL
);

CREATE TABLE formations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  slots_json  JSONB NOT NULL
);

CREATE TABLE teams (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  formation_id    UUID NOT NULL REFERENCES formations(id),
  coach_id        UUID REFERENCES coaches(id),
  tactic_id       UUID REFERENCES tactics(id),
  name            TEXT NOT NULL,
  club_identity   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE team_players (
  team_id     UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  player_id   UUID NOT NULL REFERENCES players(id),
  slot_id     TEXT NOT NULL,
  PRIMARY KEY (team_id, slot_id)
);

CREATE TABLE team_bench (
  team_id     UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  player_id   UUID NOT NULL REFERENCES players(id),
  bench_order SMALLINT NOT NULL CHECK (bench_order BETWEEN 1 AND 5),
  PRIMARY KEY (team_id, bench_order)
);

CREATE TABLE matches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home_team_id    UUID NOT NULL REFERENCES teams(id),
  away_team_id    UUID NOT NULL REFERENCES teams(id),
  seed            BIGINT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending',
  result_json     JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE match_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id    UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  minute      SMALLINT NOT NULL,
  type        TEXT NOT NULL,
  team_id     UUID REFERENCES teams(id),
  player_id   UUID REFERENCES players(id),
  detail_json JSONB
);

CREATE INDEX idx_players_position ON players(position_primary);
CREATE INDEX idx_players_club ON players(real_club);
CREATE INDEX idx_match_events_match ON match_events(match_id);