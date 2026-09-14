# APEX

**Performance, engineered.**

Motorcycle intelligence platform — editorial archive, specification database, digital showroom, and performance lab. Not e-commerce.

## Structure

```text
apex/
├── frontend/     Next.js App Router
├── backend/      Express + MongoDB + Redis
└── docker-compose.yml
```

```text
External bike API (BikeSpecs / API Ninjas)
  → provider abstraction
  → normalize + validate
  → MongoDB (primary)
  → Redis (optional cache)
  → Express /api
  → Next.js
```

## External data status (2026-09-14)

| Provider | Status | Notes |
| --- | --- | --- |
| **BikeSpecs.org** | **DOWN** (Cloudflare 521) | Preferred provider. No public docs while host is offline. |
| **API Ninjas Motorcycles** | UP, needs key | Set `API_NINJAS_API_KEY` and `BIKE_DATA_PROVIDER=api-ninjas` |
| **APEX Mongo seed** | Working | 26 curated machines with manufacturer-published fields; nulls when unknown |

Check live provider reachability:

```bash
curl http://localhost:4000/api/providers/status
```

APEX **always serves the frontend from MongoDB**. External APIs are only used for admin import/sync.

## Quick start

```bash
# Optional: Mongo + Redis
docker compose up -d

cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

pnpm --dir backend install
pnpm --dir frontend install

pnpm --dir backend seed
pnpm --dir backend seed:admin

pnpm --dir backend dev     # :4000
pnpm --dir frontend dev    # :3000
```

Admin demo account (change in production):

- email: `admin@apex.local`
- password: `ApexAdmin123!`

## Key API routes

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/bikes` | List/filter/sort/paginate |
| GET | `/api/bikes/:slug` | Detail |
| POST | `/api/comparisons` | Compare 2–4 bikes (`bikeIds` or `slugs`) |
| GET | `/api/rankings/:kind` | fastest / power / lightest / power-to-weight / torque |
| POST | `/api/recommendations` | Find-your-bike scoring |
| GET | `/api/articles` | Learn library |
| GET | `/api/search?q=` | Global search |
| GET | `/api/providers/status` | External provider health |

## Frontend routes

`/` · `/explore` · `/bike/[slug]` · `/compare` · `/lab` · `/rankings` · `/learn` · `/find-your-bike` · `/garage` · `/login` · `/register` · `/admin`

## Scripts

```bash
pnpm --dir backend seed
pnpm --dir backend seed:admin
pnpm --dir backend test
pnpm --dir backend typecheck
pnpm --dir frontend typecheck
pnpm --dir frontend lint
pnpm --dir frontend build
```

## Design

Background `#050505` · surfaces `#0B0B0D` / `#101013` · text `#F5F5F5` / `#8A8A8F` · accent `#FF3B30` (spare).
