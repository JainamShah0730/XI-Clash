CREATE TABLE IF NOT EXISTS users (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username  TEXT UNIQUE NOT NULL,
    elo_rating INTEGER NOT NULL DEFAULT 1000,
    created    TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE TABLE IF NOT EXISTS players(
    id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name   TEXT NOT NULL,
    real_club   TEXT,
    nation      TEXT,
    league      TEXT,
    position_primary  TEXT NOT NULL,
    position_secondary TEXT,
    pac   SMALLINT NOT NULL CHECK (pac BETWEEN 1 AND 99),
    sho   SMALLINT NOT NULL CHECK (sho BETWEEN 1 AND 99),
    pas   SMALLINT NOT NULL CHECK (pas BETWEEN 1 AND 99),
    dri   SMALLINT NOT NULL CHECK (dri BETWEEN 1 AND 99),
    def   SMALLINT NOT NULL CHECK (def BETWEEN 1 AND 99),
    phy   SMALLINT NOT NULL CHECK (phy BETWEEN 1 AND 99),
    ovr_base   SMALLINT NOT NULL CHECK (ovr_base BETWEEN 1 AND 99),
    image_url   TEXT

);

CREATE TABLE IF NOT EXISTS coaches (
    id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    style           TEXT NOT NULL,   -- possession | counter | high-press | direct
    aggression      SMALLINT NOT NULL CHECK (aggression BETWEEN 0 AND 100),
    attack_bias     SMALLINT NOT NULL CHECK (attack_bias BETWEEN 0 AND 100),
    def_line_height SMALLINT NOT NULL CHECK (def_line_height BETWEEN 0 AND 100),
    image_url       TEXT
);

CREATE TABLE IF NOT EXISTS formations (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,        -- e.g. "4-3-3"
    slots_json  JSONB NOT NULL        -- [{slot_id, position_type, x, y}, ...]
);

CREATE TABLE IF NOT EXISTS teams (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  formation_id    UUID NOT NULL REFERENCES formations(id),
  coach_id        UUID NOT NULL REFERENCES coaches(id),
  name            TEXT NOT NULL,
  club_identity   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS team_players (
  team_id     UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  player_id   UUID NOT NULL REFERENCES players(id),
  slot_id     TEXT NOT NULL,        -- matches a slot_id in the formation's slots_json
  PRIMARY KEY (team_id, slot_id)
);

CREATE TABLE IF NOT EXISTS matches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home_team_id    UUID NOT NULL REFERENCES teams(id),
  away_team_id    UUID NOT NULL REFERENCES teams(id),
  seed            BIGINT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending', -- pending | live | finished
  result_json     JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS match_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id    UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  minute      SMALLINT NOT NULL,
  type        TEXT NOT NULL,        -- goal, foul, yellow_card, red_card, sub, injury, corner, offside, shot
  team_id     UUID REFERENCES teams(id),
  player_id   UUID REFERENCES players(id),
  detail_json JSONB
);

CREATE INDEX IF NOT EXISTS idx_players_position ON players(position_primary);
CREATE INDEX IF NOT EXISTS idx_players_club ON players(real_club);
CREATE INDEX IF NOT EXISTS idx_match_events_match ON match_events(match_id);

