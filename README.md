# APEX

**Performance, engineered.**

A motorcycle intelligence platform — editorial, database, digital showroom, and performance laboratory. Not an e-commerce site.

## Structure

```text
apex/
├── frontend/    Next.js (App Router)
├── backend/     Express + MongoDB + Redis
└── docker-compose.yml
```

Two separate applications. The frontend talks only to the APEX backend. The backend is the only process that may call BikeSpecs (or a future provider).

```text
External Bike API
  → backend data provider
  → normalization
  → MongoDB
  → Redis
  → Express
  → frontend
```

## Development

```bash
docker compose up -d

cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

pnpm --dir backend install
pnpm --dir frontend install

pnpm --dir backend dev     # http://localhost:4000
pnpm --dir frontend dev    # http://localhost:3000
```

Or from the repo root:

```bash
pnpm dev:backend
pnpm dev:frontend
```

## Phase status

- **Phase 1** — project architecture, design system, Express health API, Mongo/Redis connections
- **Phase 2** — cinematic homepage, navbar, featured machines, motion (temporary UI data)
- **Phase 3+** — ingestion, explore, detail, compare, auth, admin

## Environment

- `backend/.env` — MongoDB, Redis, JWT, BikeSpecs key
- `frontend/.env.local` — `NEXT_PUBLIC_API_URL`

Never commit secrets. The BikeSpecs API key stays on the backend only.

## Design

Background `#050505` · surfaces `#0B0B0D` / `#101013` · text `#F5F5F5` / `#8A8A8F` · accent `#FF3B30` (spare).
