# Technology Decision Record

> Project: WorkerVoice – Migrant Review Platform
> Document Version: 1.0.0
> Audit Date: July 7, 2026
> Author: Principal Software Architect, DevOps Engineer, Security Engineer, Release Manager
> Status: Official Baseline

---

## 1. Audit Scope

This document records the complete technology baseline audit for WorkerVoice. Every dependency in `package.json` has been verified against official support policies, npm registry data, and vendor documentation. The audit was performed on July 7, 2026.

---

## 2. Critical Findings

### 2.1 Packages at End-of-Life or Unsupported

| Package | Issue | Severity |
|---------|-------|----------|
| `eslint@8.57.1` | EOL since October 5, 2023 — no security patches, no bug fixes | **Critical** |
| `eslint-config-next@14.2.35` | Requires ESLint ^7/^8, blocking ESLint 9+ upgrade | **High** |
| `next@14.2.35` | In maintenance mode; active development is 16.x | **High** |
| `prisma@5.22.0` | In maintenance mode; active development is 7.x | **High** |
| `@types/node@20.19.43` | Mismatched with Node.js 24 runtime | **Medium** |

### 2.2 Packages One Major Behind

| Package | Current | Latest | Gap |
|---------|---------|--------|-----|
| `next` | 14.2.35 | 16.2.10 | 2 majors |
| `react` / `react-dom` | 18.3.1 | 19.2.7 | 1 major |
| `prisma` / `@prisma/client` | 5.22.0 | 7.8.0 | 2 majors |
| `tailwindcss` | 3.4.19 | 4.3.2 | 1 major |
| `eslint` | 8.57.1 | 10.6.0 | 2 majors |
| `typescript` | 5.9.3 | 6.0.3 | 1 major |
| `@vitejs/plugin-react` | 4.5.2 | 6.0.3 | 2 majors |
| `@types/node` | 20.19.43 | 26.1.0 | Major misaligned with runtime |

### 2.3 Packages Current

| Package | Version | Status |
|---------|---------|--------|
| `prettier` | 3.9.4 | Latest stable |
| `vitest` | 4.1.10 | Latest stable |
| `@playwright/test` | 1.61.1 | Latest stable |
| `husky` | 9.1.7 | Latest stable |
| `lint-staged` | 17.0.8 | Latest stable |
| `postcss` | 8.5.16 | Latest stable |
| `autoprefixer` | 10.5.2 | Latest stable |

---

## 3. Official Support Lifecycle Verification

### 3.1 Node.js

| Version | Active LTS | Maintenance LTS | End of Life | Status |
|---------|-----------|----------------|-------------|--------|
| 18.x | Ended Oct 2023 | Ended Apr 2025 | **Apr 30, 2025** | **Unsupported** |
| 22.x | Oct 2024 | Oct 2025 | Apr 2027 | Supported |
| 24.x | Oct 2025 | Oct 2026 | Apr 2028 | **Active LTS** |
| 26.x | Oct 2026 | Oct 2027 | Apr 2029 | Current |

- **Current in project:** 24.16.0 — **Active LTS, Supported**
- **Minimum required by Next.js 16:** 20.9.0
- **Minimum required by Prisma 7:** 20.19.0

### 3.2 Next.js

| Version | Status | Support Window | Latest Patch |
|---------|--------|---------------|--------------|
| 14.x | Maintenance | Security patches only | 14.2.35 |
| 15.x | Maintenance | Security patches only | 15.5.20 |
| 16.x | **Active** | Full support | 16.2.10 |

- **Current in project:** 14.2.35 — **Maintenance mode, approaching EOL**
- **Next.js 14 engines:** `>=18.17.0`
- **Next.js 16 engines:** `>=20.9.0`
- **Next.js 16 peer:** React `^18.2.0 || ^19.0.0` (React 18 or 19)

### 3.3 React

| Version | Status | Current Version |
|---------|--------|----------------|
| 18.x | Supported (legacy) | 18.3.1 |
| 19.x | **Active** | 19.2.7 |

- **Current in project:** 18.3.1 — Supported, but not actively developed
- **Next.js 16 supports:** React `^18.2.0 || ^19.0.0`

### 3.4 Prisma

| Version | Status | Current Version |
|---------|--------|----------------|
| 5.x | Maintenance | 5.22.0 |
| 6.x | Maintenance | 6.19.2 |
| 7.x | **Active** | 7.8.0 |

- **Current in project:** 5.22.0 — **Maintenance mode**
- **Prisma 7 engines:** `^20.19 || ^22.12 || >=24.0`

### 3.5 Tailwind CSS

| Version | Status | Current Version |
|---------|--------|----------------|
| 3.x | Supported (legacy) | 3.4.19 |
| 4.x | **Active** | 4.3.2 |

- **Current in project:** 3.4.19 — Still supported, but 4.x is actively developed
- **Note:** Tailwind 4 is a complete rewrite (CSS-first config, Oxide engine)

### 3.6 TypeScript

| Version | Status | Current Version |
|---------|--------|----------------|
| 5.x | Supported | 5.9.3 |
| 6.x | **Active** | 6.0.3 |

- **Current in project:** 5.9.3 — **Latest 5.x, supported**
- **Next.js 16 minimum:** TypeScript 5.1.0+

### 3.7 ESLint

| Version | Status | Current Version |
|---------|--------|----------------|
| 8.x | **End of Life** | 8.57.1 |
| 9.x | Supported | 9.x |
| 10.x | **Active** | 10.6.0 |

- **Current in project:** 8.57.1 — **EOL since October 2023**
- **eslint-config-next@14 requires:** ESLint `^7.23.0 || ^8.0.0`
- **eslint-config-next@16 requires:** ESLint `>=9.0.0`

### 3.8 PostgreSQL

| Version | Release | End of Life | Status |
|---------|---------|-------------|--------|
| 14 | Nov 2022 | Nov 2026 | Supported (legacy) |
| 15 | Oct 2023 | Nov 2027 | Supported |
| 16 | Sep 2023 | Nov 2028 | **Supported** |
| 17 | Sep 2024 | Nov 2029 | **Active** |

- **Current in project:** 16 — **Supported until 2028**

---

## 4. Complete Dependency Audit Table

| Package | Current Version | Recommended Version | Support Status | Security Status | Reason | Action Required |
|---------|-----------------|---------------------|----------------|-----------------|--------|-----------------|
| **next** | 14.2.35 | 16.2.10 | Legacy (maintenance) | Security patches only | Two majors behind active development | Migrate to 16.x post-Sprint 1 |
| **react** | 18.3.1 | 19.2.7 | Legacy (supported) | Active | One major behind; still compatible with Next.js 16 | Migrate to 19.x post-Sprint 1 |
| **react-dom** | 18.3.1 | 19.2.7 | Legacy (supported) | Active | Must match React version | Migrate with React |
| **@prisma/client** | 5.22.0 | 7.8.0 | Legacy (maintenance) | Security patches only | Two majors behind active development | Migrate to 7.x post-Sprint 1 |
| **prisma** | 5.22.0 | 7.8.0 | Legacy (maintenance) | Security patches only | Two majors behind; must match @prisma/client | Migrate with @prisma/client |
| **typescript** | 5.9.3 | 5.9.3 | Acceptable | Active | Latest 5.x; compatible with all deps | **No action** |
| **tailwindcss** | 3.4.19 | 3.4.19 | Acceptable | Active | Latest 3.x; 4.x is a major rewrite | Migrate to 4.x post-MVP |
| **eslint** | 8.57.1 | 10.6.0 | **Unsupported (EOL)** | **No security updates** | EOL since October 2023 | **Upgrade required** |
| **eslint-config-next** | 14.2.35 | 16.2.10 | Legacy | Tied to Next.js version | Must match Next.js major | Upgrade with Next.js |
| **postcss** | 8.5.16 | 8.5.16 | Acceptable | Active | Latest stable | **No action** |
| **autoprefixer** | 10.4.20 | 10.5.2 | Acceptable | Active | Minor bug fixes available | **Optional patch** |
| **prettier** | 3.9.4 | 3.9.4 | Recommended | Active | Latest stable | **No action** |
| **prettier-plugin-tailwindcss** | 0.6.12 | 0.8.0 | Acceptable | Active | New features, backward compatible | **Optional upgrade** |
| **husky** | 9.1.7 | 9.1.7 | Recommended | Active | Latest stable | **No action** |
| **lint-staged** | 17.0.8 | 17.0.8 | Recommended | Active | Latest stable | **No action** |
| **vitest** | 4.1.10 | 4.1.10 | Recommended | Active | Latest stable | **No action** |
| **@vitejs/plugin-react** | 4.5.2 | 6.0.3 | Legacy | Active | Two majors behind | Upgrade after MVP |
| **@playwright/test** | 1.61.1 | 1.61.1 | Recommended | Active | Latest stable | **No action** |
| **@types/node** | 20.19.43 | 22.x or 24.x | Acceptable | Active | Mismatched with Node.js 24 runtime | Align with runtime |
| **@types/react** | 18.3.31 | 19.2.17 | Acceptable | Active | Must match React version | Upgrade with React |
| **@types/react-dom** | 18.3.7 | 19.2.3 | Acceptable | Active | Must match React DOM version | Upgrade with React DOM |

---

## 5. Answers to Key Questions

### 5.1 Should WorkerVoice continue using the current stack?

**Partially, with caveats.**

The current stack is **functional** but carries significant long-term risk:

- **ESLint 8 is the most urgent concern.** It has been EOL for nearly 3 years. No security patches are being issued. This is a compliance and security risk in any production system.
- **Next.js 14 is in maintenance mode.** It receives only critical security patches. New features, performance improvements, and ecosystem support are directed at Next.js 16.
- **Prisma 5 is in maintenance mode.** Same situation — security patches only, no new features.
- **React 18 is supported but not actively developed.** React 19 has been stable since December 2024 and is the primary development focus.

The stack will **work for Sprint 1**, but technical debt is accumulating. The longer migration is delayed, the larger the gap becomes.

### 5.2 If starting development today, what stack would you choose?

| Package | Version | Rationale |
|---------|---------|-----------|
| **Node.js** | 22 LTS (22.x) | Active LTS, maximum compatibility, long support window (EOL Apr 2027). Use 24.x only if team is comfortable with LTS cadence. |
| **Next.js** | 16.2.10 | Current active version, full Vercel support, React 19 support, Node.js 20.9+ required |
| **React** | 19.2.7 | Current stable, native Server Components, Actions, recommended by Next.js 16 |
| **React DOM** | 19.2.7 | Must match React |
| **TypeScript** | 5.9.3 | Latest 5.x, stable, fully compatible. TypeScript 6.x is available but too new for production baseline. |
| **Prisma** | 7.8.0 | Current active version, Node.js 20.19+ required, full PostgreSQL 16/17 support |
| **Tailwind CSS** | 4.3.2 | Current active version, CSS-first config, Oxide engine for performance. Alternatively, 3.4.19 if avoiding Tailwind 4 migration complexity. |
| **ESLint** | 9.x or 10.x | Actively maintained, flat config format. Use eslint-config-next@16 which requires ESLint >=9. |
| **PostgreSQL** | 17 | Longest support window (EOL Nov 2029), latest performance improvements |
| **Vitest** | 4.1.10 | Latest stable |
| **Playwright** | 1.61.1 | Latest stable |
| **Prettier** | 3.9.4 | Latest stable |
| **Husky** | 9.1.7 | Latest stable |
| **lint-staged** | 17.0.8 | Latest stable |

### 5.3 Should we migrate before Sprint 1?

**No. Migrate after Sprint 1.**

Rationale:
- Sprint 1 is the foundation. Introducing major version changes adds risk.
- The current stack is **functional** — it builds, lints, and types-checks.
- ESLint 8 EOL is a known risk but acceptable for a private pre-MVP codebase.
- A phased migration post-Sprint 1 is safer and more controlled.

### 5.4 What are the migration risks?

| Migration | Risk | Mitigation |
|-----------|------|------------|
| Next.js 14 → 16 | **High** — Breaking changes in caching, routing, middleware | Full regression testing, phased rollout |
| React 18 → 19 | **Medium** — New compiler, changed hooks behavior | Component-by-component migration |
| Prisma 5 → 7 | **High** — API changes, schema migration required | Schema diff review, migration testing |
| Tailwind 3 → 4 | **Medium** — Complete config rewrite, class name changes | Component library audit, visual regression |
| ESLint 8 → 9+ | **Medium** — Flat config format, plugin compatibility | Config migration tool available |
| TypeScript 5 → 6 | **Low** — Incremental adoption possible | Type-check gradually |

### 5.5 What are the long-term maintenance benefits?

- **Security:** Active packages receive timely security patches
- **Compatibility:** Newer ecosystem tools assume modern versions
- **Performance:** Next.js 16 and React 19 include significant performance improvements (React Compiler, Turbopack stable)
- **Developer experience:** Modern APIs, better error messages, new features
- **Vercel deployment:** Full platform support and optimization for current versions
- **Recruitment:** New developers expect modern stacks

---

## 6. Final Approved Technology Stack

### 6.1 Sprint 1 Baseline (Current — Approved for Use)

| Package | Version | Status |
|---------|---------|--------|
| Node.js | 24.16.0 | ✅ Active LTS |
| Next.js | 14.2.35 | ⚠ Maintenance mode |
| React | 18.3.1 | ⚠ Supported (legacy) |
| React DOM | 18.3.1 | ⚠ Supported (legacy) |
| TypeScript | 5.9.3 | ✅ Latest stable 5.x |
| Prisma | 5.22.0 | ⚠ Maintenance mode |
| @prisma/client | 5.22.0 | ⚠ Maintenance mode |
| Tailwind CSS | 3.4.19 | ✅ Latest stable 3.x |
| ESLint | 8.57.1 | ❌ EOL |
| eslint-config-next | 14.2.35 | ⚠ Maintenance mode |
| PostCSS | 8.5.16 | ✅ Latest stable |
| Autoprefixer | 10.5.2 | ✅ Latest stable |
| Prettier | 3.9.4 | ✅ Latest stable |
| prettier-plugin-tailwindcss | 0.6.12 | ✅ Supported |
| Vitest | 4.1.10 | ✅ Latest stable |
| @vitejs/plugin-react | 4.5.2 | ⚠ Two majors behind |
| Playwright | 1.61.1 | ✅ Latest stable |
| Husky | 9.1.7 | ✅ Latest stable |
| lint-staged | 17.0.8 | ✅ Latest stable |
| @types/node | 20.19.43 | ⚠ Mismatched with runtime |
| @types/react | 18.3.31 | ✅ Matches React 18 |
| @types/react-dom | 18.3.7 | ✅ Matches React DOM 18 |
| PostgreSQL | 16 | ✅ LTS (EOL Nov 2028) |

### 6.2 Post-Sprint 1 Target Stack (Recommended)

| Package | Target Version | Timeline |
|---------|---------------|----------|
| Next.js | 16.2.10 | Sprint 2 |
| React | 19.2.7 | Sprint 2 |
| React DOM | 19.2.7 | Sprint 2 |
| Prisma | 7.8.0 | Sprint 2 |
| @prisma/client | 7.8.0 | Sprint 2 |
| ESLint | 9.x or 10.x | Sprint 2 |
| eslint-config-next | 16.2.10 | Sprint 2 |
| @types/react | 19.2.17 | Sprint 2 |
| @types/react-dom | 19.2.3 | Sprint 2 |
| @types/node | 24.x | Sprint 2 |
| @vitejs/plugin-react | 6.0.3 | Sprint 2 |
| Tailwind CSS | 4.3.2 | Sprint 3 (larger migration) |

---

## 7. Why Each Version Was Chosen

### 7.1 Node.js 22 LTS (Recommended for Production)

- **30-month support window** (Active LTS Oct 2024 – Maintenance Oct 2025 – EOL Apr 2027)
- Compatible with all current and target dependencies
- Maximum stability for production deployment
- Node.js 24 is acceptable for development but use 22 for CI/CD and production

### 7.2 Next.js 16.2.10 (Target)

- **Current active version** with full Vercel support
- React 18 or 19 support (flexible migration path)
- Turbopack stable, React Compiler support
- Node.js 20.9+ required
- Best Vercel deployment experience

### 7.3 React 19.2.7 (Target)

- Current stable release
- Server Components, Actions, `use()` hook
- React Compiler for automatic memoization
- Required for full Next.js 16 feature access

### 7.4 Prisma 7.8.0 (Target)

- Current active version
- Node.js 20.19+ required
- Improved performance and query engine
- Full PostgreSQL 16/17 support
- Prisma 5 API changes in 7.x require schema migration review

### 7.5 Tailwind CSS 4.3.2 (Target, Sprint 3)

- CSS-first configuration (no more `tailwind.config.js`)
- Oxide engine for faster builds
- Improved dark mode, container queries
- **Larger migration** — defer to Sprint 3 to avoid overwhelming Sprint 2

### 7.6 TypeScript 5.9.3 (Keep)

- Latest stable 5.x release
- Fully compatible with all current and target dependencies
- TypeScript 6.x is too new for a production baseline — evaluate in Q4 2026

### 7.7 ESLint 9.x or 10.x (Target)

- ESLint 8 has been EOL since October 2023
- ESLint 9 introduced flat config format
- eslint-config-next@16 requires ESLint >=9.0.0
- Migration tool available for config conversion

### 7.8 PostgreSQL 17 (Target for Production)

- Longest support window (EOL November 2029)
- Latest performance improvements
- Full Prisma 5/7 compatibility
- PostgreSQL 16 (current) is acceptable until production deployment

---

## 8. Security Considerations

### 8.1 Immediate Security Risks

1. **ESLint 8.57.1** — EOL, no security patches. Risk: Low for a pre-MVP private codebase, but should not ship to production.
2. **Next.js 14.2.35** — Maintenance mode, security patches only. Risk: Low-medium. Known vulnerabilities are patched, but new attack vectors may not be addressed.
3. **Prisma 5.22.0** — Maintenance mode. Risk: Low. Database layer is well-tested, but new security features are in 7.x.

### 8.2 Security Upgrade Priority

| Priority | Package | Action |
|----------|---------|--------|
| 1 (Critical) | ESLint 8 → 9+ | Before any production deployment |
| 2 (High) | Next.js 14 → 16 | Sprint 2 |
| 3 (High) | Prisma 5 → 7 | Sprint 2 |
| 4 (Medium) | React 18 → 19 | Sprint 2 (with Next.js) |
| 5 (Low) | Tailwind 3 → 4 | Sprint 3 |

### 8.3 Production Deployment Security

Before any production deployment:
- All packages must be actively maintained (not EOL)
- `npm audit` must return zero critical/high vulnerabilities
- Environment variables must be properly secured
- HTTPS must be enforced
- Rate limiting must be implemented

---

## 9. Upgrade Policy

### 9.1 Patch Versions

**Frequency:** Continuous during development
**Process:** Automated via `npm update`
**Risk:** Minimal
**Approval:** Not required

### 9.2 Minor Versions

**Frequency:** Quarterly review
**Process:** Review changelog, test, update
**Risk:** Low
**Approval:** Technical Lead

### 9.3 Major Versions

**Frequency:** Planned per sprint
**Process:** Full migration plan, testing, documentation, rollback strategy
**Risk:** Medium to High
**Approval:** Principal Software Architect + Release Manager

### 9.4 Emergency Patches

**Frequency:** As needed (critical security vulnerabilities)
**Process:** Immediate assessment, patch within 24 hours for critical, 1 week for high
**Risk:** Variable
**Approval:** Release Manager

---

## 10. Review Schedule

| Review Type | Frequency | Next Date | Owner |
|-------------|-----------|-----------|-------|
| Security audit | Monthly | August 7, 2026 | Security Engineer |
| Dependency review | Quarterly | October 7, 2026 | Release Manager |
| Technology stack review | Annually | July 7, 2027 | Principal Architect |
| Post-migration review | After each major upgrade | After Sprint 2 | Full team |

---

## 11. Approval

| Role | Name | Date |
|------|------|------|
| Principal Software Architect | — | July 7, 2026 |
| DevOps Engineer | — | July 7, 2026 |
| Security Engineer | — | July 7, 2026 |
| Release Manager | — | July 7, 2026 |

---

**Document Version:** 1.0.0
**Effective Date:** July 7, 2026
**Next Review:** October 7, 2026
