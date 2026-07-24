-- Rename coaches -> tactics, only if not already done
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'coaches')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tactics') THEN
    ALTER TABLE coaches RENAME TO tactics;
  END IF;
END $$;

-- Drop stale FK if present
ALTER TABLE teams DROP CONSTRAINT IF EXISTS teams_coach_id_fkey;

-- Add tactic_id if missing, carry over old coach_id values once
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teams' AND column_name = 'tactic_id') THEN
    ALTER TABLE teams ADD COLUMN tactic_id UUID REFERENCES tactics(id);
    UPDATE teams SET tactic_id = coach_id;
  END IF;
END $$;

-- Fresh coach-identity table, only if it doesn't already exist correctly
CREATE TABLE IF NOT EXISTS coaches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  preferred_style TEXT NOT NULL
);

-- Only null out + repoint coach_id if it's still pointing at the OLD (tactics) meaning.
-- Guard: only do this if the FK doesn't already point at the new coaches table.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
    WHERE tc.table_name = 'teams' AND tc.constraint_type = 'FOREIGN KEY'
      AND tc.constraint_name = 'teams_coach_id_fkey' AND ccu.table_name = 'coaches'
  ) THEN
    ALTER TABLE teams ALTER COLUMN coach_id DROP NOT NULL;
    UPDATE teams SET coach_id = NULL;
    ALTER TABLE teams ADD CONSTRAINT teams_coach_id_fkey FOREIGN KEY (coach_id) REFERENCES coaches(id);
  END IF;
END $$;

-- Make user_id optional (safe to re-run, DROP NOT NULL is a no-op if already dropped)
ALTER TABLE teams ALTER COLUMN user_id DROP NOT NULL;