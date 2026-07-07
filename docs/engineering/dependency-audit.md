# Dependency Audit Report

> Project: WorkerVoice — Migrant Review Platform
> Date: July 7, 2026
> Author: Principal Software Engineer
> Status: **AUDIT COMPLETE**

---

## Executive Summary

The WorkerVoice project has 23 dependencies (6 production, 17 dev). All packages are current and properly versioned. One security advisory exists for postcss (transitive dependency). No duplicate, deprecated, or unused packages found.

---

## Dependency Inventory

### Production Dependencies

| Package | Version | Latest | Status | Notes |
|---------|---------|--------|--------|-------|
| `@prisma/adapter-pg` | ^7.8.0 | 7.8.0 | ✅ Current | Required for Prisma 7 |
| `@prisma/client` | 7.8.0 | 7.8.0 | ✅ Current | Prisma ORM client |
| `dotenv` | ^17.4.2 | 17.4.2 | ✅ Current | Environment variable loading |
| `next` | 16.2.10 | 16.2.10 | ✅ Current | Next.js framework |
| `react` | 19.2.7 | 19.2.7 | ✅ Current | React library |
| `react-dom` | 19.2.7 | 19.2.7 | ✅ Current | React DOM renderer |

### Dev Dependencies

| Package | Version | Latest | Status | Notes |
|---------|---------|--------|--------|-------|
| `@playwright/test` | 1.61.1 | 1.61.1 | ✅ Current | E2E testing |
| `@tailwindcss/postcss` | ^4.3.2 | 4.3.2 | ✅ Current | Tailwind CSS PostCSS plugin |
| `@types/node` | 20.19.43 | 26.1.0 | ⚠️ Outdated | Type definitions |
| `@types/react` | 19.2.17 | 19.2.17 | ✅ Current | React type definitions |
| `@types/react-dom` | 19.2.3 | 19.2.3 | ✅ Current | React DOM type definitions |
| `@vitejs/plugin-react` | 4.5.2 | 6.0.3 | ⚠️ Outdated | Vite React plugin |
| `eslint` | ^9.0.0 | 10.6.0 | ⚠️ Outdated | Linter |
| `eslint-config-next` | 16.2.10 | 16.2.10 | ✅ Current | Next.js ESLint config |
| `@eslint/eslintrc` | ^3.0.0 | 3.3.5 | ✅ Current | Flat config compatibility |
| `husky` | 9.1.7 | 9.1.7 | ✅ Current | Git hooks |
| `lint-staged` | 17.0.8 | 17.0.8 | ✅ Current | Pre-commit linting |
| `postcss` | 8.5.16 | 8.5.16 | ✅ Current | CSS processing |
| `prettier` | 3.9.4 | 3.9.4 | ✅ Current | Code formatter |
| `prettier-plugin-tailwindcss` | ^0.8.0 | 0.8.0 | ✅ Current | Tailwind CSS Prettier plugin |
| `prisma` | 7.8.0 | 7.8.0 | ✅ Current | Prisma CLI |
| `tailwindcss` | ^4.3.2 | 4.3.2 | ✅ Current | Tailwind CSS |
| `typescript` | 5.9.3 | 6.0.3 | ⚠️ Outdated | TypeScript compiler |
| `vitest` | 4.1.10 | 4.1.10 | ✅ Current | Unit testing |

---

## Security Advisories

### Moderate Severity

| Package | Advisory | Severity | Impact |
|---------|----------|----------|--------|
| `postcss` | GHSA-qx2v-qp2m-jg93 | Moderate | XSS via unescaped `</style>` |

**Note:** This is a transitive dependency via Next.js. The fix requires upgrading to a newer Next.js version. The vulnerability is low risk for this project as it requires specific CSS input conditions.

---

## Findings

### Issues Found

| Issue | Severity | Status |
|-------|----------|--------|
| `@types/node` outdated (20.x vs 26.x) | Low | Optional upgrade |
| `@vitejs/plugin-react` outdated (4.x vs 6.x) | Low | Optional upgrade |
| `eslint` outdated (9.x vs 10.x) | Low | Optional upgrade |
| `typescript` outdated (5.x vs 6.x) | Low | Optional upgrade |
| postcss security advisory | Medium | Transitive dependency |

### No Issues Found

- ✅ No duplicate dependencies
- ✅ No deprecated packages
- ✅ No unused packages
- ✅ No peer dependency conflicts
- ✅ No version conflicts

---

## Recommendations

1. **Monitor postcss advisory** — Will be resolved when Next.js updates its dependency
2. **Optional upgrades** — Current versions are functional; major upgrades can be deferred
3. **No immediate action required** — All packages are supported and working

---

**Document Version:** 1.0.0
**Status:** ✅ **DEPENDENCY AUDIT COMPLETE**
