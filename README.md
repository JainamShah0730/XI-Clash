# XI Clash

A real-time multiplayer football game where two players draft their own Best XI from real footballers, and the app scores their **squad-building knowledge** — not raw stats matching, but position fit, real-world chemistry links, and tactical coherence — then simulates a full 90-minute match live between two browsers.

Built solo, from architecture through database design, real-time multiplayer sync, a deterministic match simulation engine, and a full authenticated frontend.

---

## What makes this different from a typical CRUD portfolio project

- **The scoring system encodes real domain knowledge**, not just stored data. A position-distance graph penalizes out-of-position players proportionally (a striker played at center-back doesn't just "count less," it's mathematically modeled how far out of position they are). Chemistry is derived from real club/nation/league overlap between the 11 starters, the same logic real squad-building relies on.
- **The match engine is deterministic and seeded**, and its correctness was validated statistically rather than by inspection. When red-card impact was added, it was verified by running 500 simulated matches between two *identical* teams and comparing average goal differential across three buckets (no cards / home sent off / away sent off) — result: essentially 0 with no cards, -0.85 when home went down a man, +0.79 when away did. Symmetric, consistent, and measured rather than assumed.
- **The server is authoritative.** Neither client simulates the match — the match-engine computes the entire event timeline in one deterministic pass server-side, then streams it to both connected sockets at a paced interval. Neither player can fake a result, because neither client is doing the actual computation.
- **Auth is done correctly, not decoratively.** The server derives `user_id` from a verified JWT rather than trusting a client-supplied value in the request body.
- **A deliberate product/IP decision**, not just a technical one: player attributes are derived from public performance data via a custom formula, specifically avoiding replication of EA Sports FC's proprietary rating system.

---

## Core gameplay loop

1. Register/log in
2. Build an XI: pick a formation, search and assign real players to formation slots (position-filtered, duplicate-proof), pick a coach and a tactic (tactics are ranked by fit against the coach's preferred style), fill a 5-player bench
3. See live **Team OVR** and **Chemistry %** update as you build, computed server-side on every change
4. Save the team
5. Join a match room with a shared code, pick home/away, submit your saved team
6. Once both sides submit, the match kicks off — full-XI pitch visualization, live commentary feed, real-time score, card tracking, and substitutions, synced identically across both browsers

---

## Architecture

┌─────────────────────────┐ ┌─────────────────────────┐
│ Client A (React/Vite) │ │ Client B (React/Vite) │
│ Team Builder │ Match UI │ │ Team Builder │ Match UI │
└──────────────┬────────────┘ └──────────────┬────────────┘
│ REST (auth, teams, players) │
│ WebSocket (match room, live events) │
▼ ▼
┌─────────────────────────────────────────────────┐
│ API Service (Express) │
│ - JWT auth (bcrypt + jsonwebtoken) │
│ - Player search/filter │
│ - Team CRUD (OVR/chemistry computed server-side) │
└──────────────────────┬─────────────────────────────┘
│
┌───────────────────────────────────────────────────┐
│ Match Engine (Node + Socket.io) │
│ - Deterministic, seeded match simulation │
│ - Two-player lobby (join → submit → both-ready gate)│
│ - Paced event streaming to both connected clients │
│ - Redis-backed lobby state + Socket.io Redis adapter│
└──────────────────────┬─────────────────────────────┘
│
┌──────────────────┴───────────────────┐
▼ ▼
┌─────────────┐ ┌─────────────┐
│ PostgreSQL │ │ Redis │
│ users, │ │ match lobby │
│ players, │ │ state, pub/ │
│ teams, │ │ sub adapter │
│ formations, │ └─────────────┘
│ tactics, │
│ coaches │
└─────────────┘


Monorepo, npm workspaces:

xi-clash/
├── apps/
│ ├── api/ Express REST API (auth, players, teams)
│ ├── match-engine/ Match simulation + Socket.io realtime
│ └── frontend/ React/Vite client
├── packages/
│ └── shared/ Formations, position-fit rules, OVR/chemistry calc
│ — single source of truth, imported by both api
│ and match-engine via workspace linking
├── db/
│ ├── schema.sql
│ └── migrations/ Incremental schema changes (coach/tactic split,
│ auth columns, bench table)
└── docker-compose.yml Postgres + Redis for local dev


---

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React + Vite, plain CSS with a design-token system (no framework) |
| Realtime | Socket.io, with the Redis adapter for multi-instance broadcast |
| API | Node.js + Express |
| Auth | bcrypt (password hashing) + JWT (session tokens) |
| Database | PostgreSQL |
| Cache / pub-sub | Redis |
| Match engine RNG | `seedrandom` — deterministic, reproducible simulations from a string seed |
| Monorepo tooling | npm workspaces |

---

## The scoring system, in detail

### Position fit
Each formation slot has a `position_type` (GK, CB, FB, DM, CM, AM, W, ST). Every player has a primary and optional secondary position. A distance graph maps how "far" one position is from another:

exact match → 100% of rating counts
adjacent (dist 1) → 88%
stretch (dist 2) → 68%
way out (dist 3+) → 50%


A player's *best* distance (primary or secondary, whichever is closer to the slot) is used — so a natural DM playing CM isn't penalized, but a striker forced into center-back is.

### Chemistry
Computed pairwise across all 11 starters:
- +2 per pair sharing a real club
- +1 per pair sharing a nation
- +1 per pair sharing a league

Normalized to 0–100, then contributes up to +3 to Team OVR.

### Coach/tactic fit
Coaches are named identities with a `preferred_style` (possession / counter / high-press / direct). Tactics are the actual simulation parameters (aggression, attack bias, defensive line height). Picking a tactic matching your coach's preferred style grants a small OVR bonus and is visually flagged (⭐) in the UI, ranked to the top of the tactic list.

### Match simulation
- Minute-by-minute probabilistic event rolls (attacks, shots, goals, fouls, cards, corners, offsides, injuries) driven by each team's positional averages (ATT/MID/DEF/GK), fatigue curve after minute 60, and coach tactic parameters
- **Red cards reduce team strength for the rest of the match** — each sent-off player applies roughly a 12% effectiveness penalty (floored at 55% even with multiple reds) to both attack and defense, and slightly increases the opponent's attack chance and the carded team's own foul rate (stretched, chasing the game)
- **Substitutions**: on injury, the engine looks up the injured player's position group (GK/DEF/MID/ATT) and swaps in a like-for-like bench player if one's available and the team hasn't used all 5 subs; the swap recalculates that group's average rating on the fly
- The entire event timeline is computed **once**, server-side, in a single seeded pass — then streamed to both clients on a timer, so playback is just replay, not re-simulation

---

## What's real vs. simplified (an honest accounting)

**Fully real, not mocked:**
- 158 real players (major European leagues, Indian Super League, and football legends) with hand-estimated attributes, since no legally usable API provides EA-style ratings
- 9 real formations with accurate slot geometry
- Genuine two-player real-time sync, tested across independent browser sessions
- Password hashing, JWT verification, server-side authorization on writes

**Deliberately simplified, and I know exactly where the line is:**
- Player attribute values are my own estimates from real-world reputation/stats, not sourced from an official rating provider (none exist that are legally reusable)
- Substitutions only trigger on injury events, not manual tactical subs mid-match
- Redis holds match *lobby* state (who's joined, who's submitted, ready gating) and powers the Socket.io adapter for cross-instance broadcast — but the actual simulation's `setInterval` playback loop still runs on whichever single instance kicked it off; making that resumable across instances is a larger follow-up
- Pitch visualization is a simplified 2D top-down representation (grass stripes, real formation coordinates, player tokens, eased ball movement toward whichever player triggers an event) — not full player-movement animation like a AAA game engine, by design

---

## Notable bugs fixed during development (and what they taught me)

**Silent duplicate seeding via NULL comparison.** The players table used `ON CONFLICT (api_football_id) DO NOTHING` to prevent duplicate inserts on re-seeding. But manually-curated players (as opposed to ones pulled from an external API) had `NULL` in that column — and in SQL, `NULL != NULL` by definition, so Postgres never considered two NULL-valued rows a conflict. Every re-run of the seed script silently re-inserted the full player list. It took noticing duplicate names stacking up in the UI, tracing it through formations/tactics/coaches (which had the identical bug independently), and fixing it by adding real `UNIQUE` constraints on `name` across all four tables plus `ON CONFLICT (name) DO NOTHING` in every insert.

**Trusting client input for user identity.** Early versions of the team-save endpoint accepted `user_id` directly in the request body — meaning anyone could save a team under any user ID by just editing the payload. Fixed once real auth was built: `user_id` is now derived exclusively from the verified JWT (`req.user.id`), never trusted from client input.

---

## Local setup

```cmd
docker compose up -d                    :: Postgres + Redis
npm install                             :: installs all workspaces from root

cd apps\api
node src\migrate.js                     :: base schema
node src\migrate2.js                    :: coach/tactic split
node src\migrate3.js                    :: auth columns
node src\migrate4.js                    :: bench table
node src\seed.js                        :: formations, tactics, coaches, 158 players

:: three terminals:
cd apps\api && npm run dev              :: http://localhost:4000
cd apps\match-engine && npm run dev     :: http://localhost:4100
cd apps\frontend && npm run dev         :: http://localhost:5173
```

---

## Possible next steps

- Manual tactical substitutions (not just injury-triggered)
- Fully instance-agnostic match simulation (persist simulation progress in Redis so any instance can resume streaming)
- Tournament/league mode across multiple matches
- LLM-generated match commentary and pre/post-match analysis via the Anthropic API
- Extra time and penalty shootouts for a cup-mode match type