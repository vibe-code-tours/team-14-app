# Prisma 7 Readiness Assessment

> Project: WorkerVoice — Migrant Review Platform
> Date: July 7, 2026
> Author: Release Engineer
> Status: **COMPLETE — READY FOR APPROVAL**

---

## 1. Current Implementation

### 1.1 Schema (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Models:** 3 (SuggestedOrganization, Factory, Review)
**Enums:** 2 (OrganizationType, SuggestionStatus)
**Relations:** 2 (Review → SuggestedOrganization, Review → Factory)
**Indexes:** 5 (3 on Factory, 2 on Review)
**Raw SQL:** None

### 1.2 Client Setup (`lib/prisma.ts`)

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### 1.3 Files Importing Prisma

| File | Import | Usage |
|------|--------|-------|
| `lib/prisma.ts` | `{ PrismaClient } from "@prisma/client"` | Client instantiation |
| `lib/factories.ts` | `{ prisma } from "./prisma"` | Factory queries |
| `lib/reviews.ts` | `{ prisma } from "./prisma"` | Review queries |
| `lib/suggestions.ts` | `{ prisma } from "./prisma"` | Suggestion queries |
| `lib/index.ts` | `{ prisma } from "./prisma"` | Re-export |

### 1.4 Current Versions

| Package | Version |
|---------|---------|
| prisma | 5.22.0 |
| @prisma/client | 5.22.0 |
| Node.js | 24.16.0 |
| TypeScript | 5.9.3 |

### 1.5 Environment Loading

- `.env` file exists (136 bytes)
- `.env.local` file exists (91 bytes)
- Next.js 16 loads `.env` automatically (confirmed in build output: "Environments: .env.local, .env")
- No `prisma.config.ts` exists
- No explicit `.env` loading in `lib/prisma.ts`

---

## 2. Official Prisma 7 Changes

### 2.1 Generator Changes

**Source:** [Prisma 7 Documentation](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7)

| Change | Details |
|--------|---------|
| `prisma-client-js` | Legacy, still supported but deprecated |
| `prisma-client` | New generator, requires explicit output path |
| Output path | Must be specified explicitly for `prisma-client` |
| Runtime targets | `prisma-client` supports: nodejs, deno, bun, workerd, cloudflare, vercel-edge, edge-light |
| binaryTargets | **Removed** in Prisma 7 (not needed with JS drivers) |

### 2.2 Environment Loading

**Source:** Prisma 7 CLAUDE.md and AGENTS.md

| Change | Details |
|--------|---------|
| `.env` auto-loading | **Removed** in Prisma 7 |
| `prisma.config.ts` | New optional configuration file |
| `dotenv/config` | Can be used to load `.env` manually |
| Next.js impact | Next.js still loads `.env` for the application, but Prisma CLI commands need explicit loading |

### 2.3 Query Engine

| Change | Details |
|--------|---------|
| Native binary | **Removed** |
| JavaScript drivers | Now used instead |
| Performance | Comparable or better |
| Deployment | Simpler (no native binaries to manage) |

### 2.4 Node.js Requirements

| Version | Requirement |
|---------|-------------|
| Prisma 7.8.0 | `^20.19 \|\| ^22.12 \|\| >=24.0` |
| Current Node.js | 24.16.0 ✅ **Compatible** |

### 2.5 TypeScript Requirements

| Version | Requirement |
|---------|-------------|
| Prisma 7.8.0 | `>=5.4.0` |
| Current TypeScript | 5.9.3 ✅ **Compatible** |

---

## 3. Required Changes

### 3.1 Schema Changes (`prisma/schema.prisma`)

**Option A: Keep Legacy Generator (Recommended for minimal risk)**

```prisma
// NO CHANGE REQUIRED - prisma-client-js still works in Prisma 7
generator client {
  provider = "prisma-client-js"
}
```

**Option B: Migrate to New Generator (Future-proof)**

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
  runtime  = "nodejs"
}
```

**Recommendation:** Use **Option A** for this migration. The legacy generator is still supported and minimizes risk. The new generator can be adopted in a future migration when there are more compelling reasons (e.g., edge deployment).

### 3.2 Package Version Changes (`package.json`)

```json
{
  "prisma": "7.8.0",        // was 5.22.0
  "@prisma/client": "7.8.0"  // was 5.22.0
}
```

### 3.3 Environment Loading (IF using `prisma-client` generator)

If migrating to the new `prisma-client` generator, create `prisma.config.ts`:

```typescript
import { defineConfig } from "@prisma/config";

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
```

**Note:** This is only required if using the `prisma-client` generator. With `prisma-client-js`, the current setup continues to work.

### 3.4 Import Path (NO CHANGE REQUIRED)

The import path remains the same:

```typescript
import { PrismaClient } from "@prisma/client";
```

This works with both `prisma-client-js` and `prisma-client` generators.

---

## 4. Files That Do NOT Need Changes

| File | Reason |
|------|--------|
| `lib/prisma.ts` | Import path unchanged, PrismaClient API unchanged |
| `lib/factories.ts` | Prisma query API unchanged |
| `lib/reviews.ts` | Prisma query API unchanged |
| `lib/suggestions.ts` | Prisma query API unchanged |
| `lib/index.ts` | Re-export only |
| `lib/admin.ts` | No Prisma usage |
| All API routes | No direct Prisma usage |
| All components | No Prisma usage |
| `tsconfig.json` | TypeScript 5.9.3 is compatible |
| `.gitignore` | Already ignores `src/generated/prisma` |

---

## 5. Potential Breaking Changes

### 5.1 `.env` Loading for CLI Commands

**Impact:** Low

When running `npx prisma migrate` or `npx prisma generate` directly (not through Next.js), Prisma 7 no longer auto-loads `.env`.

**Mitigation:** Next.js loads `.env` for the application. For CLI commands, either:
1. Use `npx prisma migrate dev --schema prisma/schema.prisma` (Next.js context)
2. Or create `prisma.config.ts` with explicit env loading

**Current workflow:** `npx prisma generate` and `npx prisma migrate dev` are run in the project root where `.env` exists. Next.js's `dotenv` integration handles loading for the application.

### 5.2 Generated Client Location

**Impact:** Low (if keeping `prisma-client-js`)

With `prisma-client-js`, the client generates to `node_modules/.prisma/client/` (default). The import `@prisma/client` resolves to this location.

With `prisma-client`, the client generates to the explicit `output` path. The import path may need adjustment.

**Mitigation:** Keep `prisma-client-js` generator to avoid import path changes.

### 5.3 Query Engine Binary

**Impact:** None

Prisma 7 removes the native query engine binary and uses JavaScript drivers instead. This is transparent to the application code.

**Benefit:** Smaller deployment size, no native binary compatibility issues.

---

## 6. Risk Assessment

| Risk | Probability | Impact | Severity | Mitigation |
|------|-------------|--------|----------|------------|
| `.env` loading breaks CLI commands | Medium | Low | **Low** | Test `prisma generate` and `prisma migrate` after upgrade |
| Generated client incompatibility | Low | High | **Medium** | Keep `prisma-client-js` generator |
| Query API changes | Low | High | **Low** | Prisma 7 query API is backward compatible |
| TypeScript type changes | Low | Medium | **Low** | TypeScript 5.9.3 is compatible |
| PostgreSQL 16 incompatibility | None | None | **None** | Prisma 7 fully supports PostgreSQL 16 |

**Overall Risk Rating:** **LOW**

---

## 7. Estimated Migration Effort

| Task | Estimated Time |
|------|---------------|
| Update package.json versions | 2 min |
| Run `npm install` | 5 min |
| Run `npx prisma generate` | 2 min |
| Verify import paths | 5 min |
| Run validation suite | 10 min |
| Test `.env` loading | 5 min |
| **Total** | **30 min** |

---

## 8. Migration Plan (Recommended)

### Step 1: Update package.json

```json
{
  "prisma": "7.8.0",
  "@prisma/client": "7.8.0"
}
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Regenerate Prisma client

```bash
npx prisma generate
```

### Step 4: Verify import paths

```bash
npx tsc --noEmit
```

### Step 5: Run full validation

```bash
npm run build
npm run lint
npx tsc --noEmit
npx prisma generate
```

### Step 6: Test `.env` loading

```bash
# Verify DATABASE_URL is accessible
npx prisma db push --preview-feature
```

---

## 9. Decision Point: Generator Choice

### Option A: Keep `prisma-client-js` (Recommended)

**Pros:**
- Minimal changes
- Same import path
- Same output location
- Proven stability

**Cons:**
- Legacy generator (deprecated but supported)
- No edge runtime support
- No JS driver benefits

### Option B: Migrate to `prisma-client` (Future-proof)

**Pros:**
- New generator (actively developed)
- Edge runtime support
- JS drivers (smaller deployment)
- Better performance

**Cons:**
- Requires explicit output path
- May need import path adjustment
- Requires `prisma.config.ts` for env loading
- Higher migration risk

**Recommendation:** Use **Option A** for this migration. Adopt Option B in a future sprint when edge deployment is needed.

---

## 10. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Release Engineer | — | — | ⏳ Pending |
| Lead Software Architect | — | — | ⏳ Pending |

---

**Document Version:** 1.0.0
**Created:** July 7, 2026
**Status:** ✅ **PRISMA 7 READINESS ASSESSMENT COMPLETE — READY FOR APPROVAL**
