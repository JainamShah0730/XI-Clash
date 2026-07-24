-- Runs after tactics/coaches exist (post rename in migration 002).
-- Idempotent — safe to re-run.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'players_name_unique') THEN
    ALTER TABLE players ADD CONSTRAINT players_name_unique UNIQUE (name);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'formations_name_unique') THEN
    ALTER TABLE formations ADD CONSTRAINT formations_name_unique UNIQUE (name);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tactics_name_unique') THEN
    ALTER TABLE tactics ADD CONSTRAINT tactics_name_unique UNIQUE (name);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'coaches_name_unique') THEN
    ALTER TABLE coaches ADD CONSTRAINT coaches_name_unique UNIQUE (name);
  END IF;
END $$;