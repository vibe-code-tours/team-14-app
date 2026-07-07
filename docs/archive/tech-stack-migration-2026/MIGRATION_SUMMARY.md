# Migration Summary — July 6, 2026

## Overview

Migrated **WorkerVoice** (migrant-review-app) to **Migrant Review Platform** (migrant-review-platform) from Express.js vanilla JS to Next.js 14 with TypeScript and Prisma ORM.

---

## Phase 1: Database Schema ✅

**Created:** `prisma/schema.prisma`

Migrated raw SQL schema to Prisma ORM:

| Old (SQL) | New (Prisma) |
| ----------- | -------------- |
| `CREATE TYPE org_type` | `enum OrganizationType` |
| `CREATE TYPE status_type` | `enum SuggestionStatus` |
| `suggested_organizations` table | `SuggestedOrganization` model |
| `factories` table | `Factory` model |
| `reviews` table | `Review` model |

**Commands:**

```bash
npx prisma migrate dev --create-only --name init
npx prisma migrate dev
```

**Result:** 3 tables, 2 enums created in PostgreSQL

---

## Phase 2: Data Migration ✅

**Created:** `scripts/` directory

| File | Purpose |
| ---- | ------- |
| `download_diw_factories.py` | Scrapes DIW Thailand website for factory Excel files |
| `import_factories.py` | Imports Excel data into PostgreSQL |
| `requirements.txt` | Python dependencies |
| `README.md` | Script documentation |

**Copied:** `province_districts.json` — Thai province/district mappings

**Note:** Factory data download requires running the script separately (takes ~10-15 minutes)

---

## Phase 3: Prisma Client Helpers ✅

**Created:** `lib/` directory

| File | Functions |
| ---- | --------- |
| `prisma.ts` | Prisma client singleton |
| `factories.ts` | `searchFactories()`, `getFactoryById()`, `getFactoryReviews()`, `getProvinces()`, `getRegions()` |
| `reviews.ts` | `createReview()`, `getReviewsByOrganization()` |
| `suggestions.ts` | `createSuggestion()`, `searchOrganizations()`, `getPendingSuggestions()`, `updateSuggestionStatus()` |
| `admin.ts` | `verifyAdminAuth()` |
| `index.ts` | Re-exports all functions |

---

## Phase 4: API Routes ✅

**Created:** `app/api/` directory

| Route | Method | Description |
| ----- | ------ | ----------- |
| `/api/factories` | GET | Search factories with filters |
| `/api/factories/[id]` | GET | Get factory detail |
| `/api/factories/[id]/reviews` | GET | Get reviews for factory |
| `/api/factories/[id]/reviews` | POST | Submit a review |
| `/api/provinces` | GET | List all provinces |
| `/api/provinces/[province]/districts` | GET | Get districts in province |
| `/api/regions` | GET | List 6 Thai regions |
| `/api/suggestions` | POST | Submit factory/agency suggestion |
| `/api/organizations` | GET | Search approved organizations |
| `/api/admin/suggestions` | GET | List suggestions (admin) |
| `/api/admin/suggestions/[id]/status` | PUT | Approve/reject suggestion (admin) |

**Build Status:** ✅ Passing

---

## Project Structure (Final)

```text
migrant-review-platform/
├── app/
│   ├── api/                    # 11 API routes
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/                        # Database helpers
│   ├── prisma.ts
│   ├── factories.ts
│   ├── reviews.ts
│   ├── suggestions.ts
│   ├── admin.ts
│   └── index.ts
├── prisma/
│   ├── schema.prisma           # 3 models, 2 enums
│   └── migrations/
├── scripts/                    # Data import tools
├── docs/
│   ├── GEMINI.md               # Full documentation
│   └── MIGRATION_SUMMARY.md    # This file
├── docker-compose.yml          # PostgreSQL
├── province_districts.json     # Thai mappings
└── package.json
```

---

## Key Differences from Old Project

| Aspect | Old (migrant-review-app) | New (migrant-review-platform) |
| ------ | ------------------------ | ------------------------------- |
| Framework | Express.js | Next.js 14 |
| Language | JavaScript | TypeScript |
| Frontend | Vanilla HTML/JS | React + Tailwind |
| ORM | Raw SQL (pg) | Prisma |
| Database | PostgreSQL | PostgreSQL (Docker) |
| Structure | Single server.js | Modular (lib/, app/api/) |

---

## Next Steps

1. **Frontend Pages** — Build React components for home, list, detail
2. **Data Import** — Run download and import scripts
3. **Authentication** — Add user authentication (optional)
4. **Deployment** — Deploy to Vercel + Supabase
