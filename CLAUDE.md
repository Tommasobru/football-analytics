# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Backend (Flask)
```bash
cd backend
source .venv/bin/activate

# Run dev server (port 5000)
python run.py

# Import data from football-data.org (requires FOOTBALL_DATA_API_KEY in .env)
python -m scripts.ingest --competitions PL
python -m scripts.ingest --competitions PL,SA,BL1 --season 2024

# Install dependencies
pip install -r requirements.txt
```

### Frontend (React + Vite)
```bash
cd frontend

npm run dev        # Dev server (port 5173, proxies /api → localhost:5000)
npm run build      # TypeScript check + production build
npm run lint       # ESLint
npx tsc --noEmit   # Type check only
```

## Architecture

**Two-server setup**: Flask backend (port 5000) serves a REST API under `/api`. Vite frontend (port 5173) proxies `/api` requests to the backend during development.

### Backend

Flask app factory in `app/__init__.py`. Four blueprints registered under `/api`:
- `competitions` — list competitions, competition teams
- `teams` — team profile, stats, paginated matches
- `matches` — filtered/paginated match listing
- `graph` — **core endpoints**: `/api/graph/dominance` (nodes + edges) and `/api/graph/head-to-head` (detailed H2H between two teams)

**Services layer** (`app/services/`):
- `FootballDataClient` wraps football-data.org v4 API with a 10-req/min rate limiter
- `IngestionService` syncs competitions → teams → matches → rebuilds H2H table
- `GraphBuilder` constructs the dominance graph from pre-computed `HeadToHead` records (or from raw `Match` records when date filters are specified)
- `HeadToHeadService` aggregates H2H stats and returns match history

**Database**: SQLite via SQLAlchemy. The `head_to_head` table is pre-computed during ingestion with a `CHECK (team_a_id < team_b_id)` constraint for canonical ordering — this avoids duplicate (A,B)/(B,A) pairs and enables fast graph queries.

Match model uses `lazy="joined"` for team relationships (eager loading to prevent N+1).

### Frontend

- **State**: Zustand store (`store/filters.ts`) holds global filter state (competitions, season, date range). Data fetching uses custom hooks with local `useState`.
- **D3 graph**: `ForceGraph.tsx` uses D3 for **direct SVG DOM control** via React refs — D3 manages the simulation and rendering, React is just a container. This is intentional for 60fps performance during force simulation settling.
- **API layer**: `api/client.ts` provides a typed `apiFetch()` utility. Per-resource modules (`graph.ts`, `teams.ts`, etc.) export typed fetch functions.
- **Hooks**: `useGraphData` re-fetches automatically when the Zustand filter store changes. `useHeadToHead`, `useTeam`, `useCompetitions` follow the same loading/error/data pattern.

### Data Flow

Ingestion: football-data.org API → `FootballDataClient` (rate-limited) → `IngestionService` → SQLite (competitions, teams, matches, head_to_head)

Graph query: Zustand filters → `useGraphData` hook → `GET /api/graph/dominance` → `GraphBuilder` reads `HeadToHead` table → returns `{nodes[], edges[]}` → D3 `ForceGraph` renders
