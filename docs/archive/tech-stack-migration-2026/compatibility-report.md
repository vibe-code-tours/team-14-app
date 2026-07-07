# Compatibility Report

> Project: WorkerVoice — Migrant Review Platform
> Date: July 7, 2026
> Author: Lead Software Architect & Release Engineer
> Status: **COMPLETE — READY FOR MIGRATION**

---

## 1. Current Stack vs Target Stack

| Package | Current | Target | Latest Stable | Action |
|---------|---------|--------|---------------|--------|
| **Node.js** | 24.16.0 | 22 LTS | 24.x (Active LTS) | **Downgrade** to 22 LTS for stability |
| **npm** | 11.13.0 | 11.x | 11.13.0 | **Keep** (already latest) |
| **Next.js** | 14.2.35 | 16.2.10 | 16.2.10 | **Upgrade** (2 majors) |
| **React** | 18.3.1 | 19.2.7 | 19.2.7 | **Upgrade** (1 major) |
| **React DOM** | 18.3.1 | 19.2.7 | 19.2.7 | **Upgrade** (1 major) |
| **TypeScript** | 5.9.3 | 5.9.3 | 6.0.3 | **Keep** (5.9.3 is latest 5.x) |
| **Prisma** | 5.22.0 | 7.8.0 | 7.8.0 | **Upgrade** (2 majors) |
| **@prisma/client** | 5.22.0 | 7.8.0 | 7.8.0 | **Upgrade** (2 majors) |
| **PostgreSQL** | 16 | 16 | 17 | **Keep** (LTS until Nov 2028) |
| **Tailwind CSS** | 3.4.19 | 4.3.2 | 4.3.2 | **Upgrade** (1 major, complete rewrite) |
| **PostCSS** | 8.5.16 | 8.5.16 | 8.5.16 | **Keep** |
| **Autoprefixer** | 10.4.20 | 10.5.2 | 10.5.2 | **Remove** (included in Tailwind 4) |
| **ESLint** | 8.57.1 | 9.x | 10.6.0 | **Upgrade** (1 major) |
| **eslint-config-next** | 14.2.35 | 16.2.10 | 16.2.10 | **Upgrade** (2 majors) |
| **Prettier** | 3.9.4 | 3.9.4 | 3.9.4 | **Keep** (already latest) |
| **prettier-plugin-tailwindcss** | 0.6.12 | 0.8.0 | 0.8.0 | **Upgrade** |
| **Vitest** | 4.1.10 | 4.1.10 | 4.1.10 | **Keep** (already latest) |
| **@vitejs/plugin-react** | 4.5.2 | 4.5.2 | 6.0.3 | **Keep** (6.x requires Vite 8) |
| **Playwright** | 1.61.1 | 1.61.1 | 1.61.1 | **Keep** (already latest) |
| **Husky** | 9.1.7 | 9.1.7 | 9.1.7 | **Keep** (already latest) |
| **lint-staged** | 17.0.8 | 17.0.8 | 17.0.8 | **Keep** (already latest) |
| **@types/node** | 20.19.43 | 22.x | 26.1.0 | **Align** with Node.js 22 LTS |
| **@types/react** | 18.3.31 | 19.2.17 | 19.2.17 | **Upgrade** (match React 19) |
| **@types/react-dom** | 18.3.7 | 19.2.3 | 19.2.3 | **Upgrade** (match React DOM 19) |

---

## 2. Breaking Changes Analysis

### 2.1 Next.js 14 → 16 (HIGH RISK)

**Source:** [Next.js 16 Migration Guide](https://nextjs.org/docs/app/guides/upgrading/version-16)

| Breaking Change | Impact | Affected Files | Fix Required |
|-----------------|--------|----------------|--------------|
| Async params API | **High** | 3 API routes | Change `{ params: { id: string } }` to `{ params: Promise<{ id: string } > }` and `await params` |
| Node.js 20.9+ required | **Medium** | Runtime | Downgrade from 24.x to 22 LTS |
| React 18.2+ / 19.0+ peer | **Low** | package.json | Already compatible |
| `next/legacy/image` deprecated | **None** | — | Not used in project |

**Affected Files:**
1. `app/api/factories/[id]/route.ts` — Lines 7, 24 (params sync → async)
2. `app/api/factories/[id]/reviews/route.ts` — Lines 7, 24 (params sync → async)
3. `app/api/admin/suggestions/[id]/status/route.ts` — Lines 7, 28 (params sync → async)

**Already Compatible:**
- `app/api/provinces/[province]/districts/route.ts` — Already uses `Promise<{ province: string }>` pattern

### 2.2 React 18 → 19 (LOW RISK)

**Source:** [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)

| Breaking Change | Impact | Affected Files | Fix Required |
|-----------------|--------|----------------|--------------|
| `React.FC` removed | **None** | — | Not used in project |
| `PropTypes` removed | **None** | — | Not used in project |
| `defaultProps` removed | **None** | — | Not used in project |
| String refs removed | **None** | — | Not used in project |
| `react-dom/test-utils` removed | **None** | — | Not used in project |
| `act` moved to `react` | **None** | — | Not used in project |
| Legacy Context removed | **None** | — | Not used in project |

**Project Status:** ✅ **No React 19 breaking changes affect this project.** All components use standard function components with TypeScript interfaces.

### 2.3 Prisma 5 → 7 (HIGH RISK)

**Source:** [Prisma 7 Documentation](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7)

| Breaking Change | Impact | Affected Files | Fix Required |
|-----------------|--------|----------------|--------------|
| Generator `prisma-client-js` → `prisma-client` | **High** | `prisma/schema.prisma` | Change provider name |
| Explicit output path required | **High** | `prisma/schema.prisma` | Add `output = "../src/generated/prisma"` |
| No automatic `.env` loading | **Medium** | `lib/prisma.ts` | Verify DATABASE_URL is loaded |
| Query engine removed (JS drivers) | **Low** | — | Transparent, no code changes |
| `binaryTargets` removed | **Low** | — | Not used in project |

**Affected Files:**
1. `prisma/schema.prisma` — Line 2 (generator provider)
2. `lib/prisma.ts` — Verify import path works with new generator

### 2.4 Tailwind CSS 3 → 4 (HIGH RISK)

**Source:** [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)

| Breaking Change | Impact | Affected Files | Fix Required |
|-----------------|--------|----------------|--------------|
| CSS-first configuration | **High** | `tailwind.config.js` | Delete, move config to CSS |
| `@tailwind` → `@import "tailwindcss"` | **High** | `app/globals.css` | Rewrite import |
| PostCSS plugin changed | **High** | `postcss.config.js` | Delete, use `@tailwindcss/postcss` |
| Utility class renaming | **Medium** | All components | Audit for renamed classes |
| `content` paths auto-detected | **Low** | `tailwind.config.js` | No manual config needed |
| Autoprefixer bundled | **Low** | `package.json` | Remove `autoprefixer` dependency |

**Affected Files:**
1. `app/globals.css` — Complete rewrite of import syntax
2. `tailwind.config.js` — **DELETE** (config moves to CSS)
3. `postcss.config.js` — **DELETE** (replaced by Tailwind 4)
4. `package.json` — Remove `autoprefixer`, add `@tailwindcss/postcss` if needed

**Utility Class Changes (Tailwind 4):**
- `shadow-sm` → `shadow-xs`
- `shadow` → `shadow-sm`
- `ring` → `ring-3`
- `blur-sm` → `blur-xs`

**Note:** Must audit all component files for renamed utility classes.

### 2.5 ESLint 8 → 9 (MEDIUM RISK)

**Source:** [ESLint 9 Migration Guide](https://eslint.org/docs/latest/use/migrate-to-9.0.0)

| Breaking Change | Impact | Affected Files | Fix Required |
|-----------------|--------|----------------|--------------|
| Flat config format | **High** | `.eslintrc.json` | Replace with `eslint.config.mjs` |
| `eslint-config-next@16` requires ESLint ≥9 | **High** | `package.json` | Upgrade ESLint to 9+ |
| New ignores pattern | **Low** | Config file | Update ignore patterns |

**Affected Files:**
1. `.eslintrc.json` — **DELETE**
2. `eslint.config.mjs` — **CREATE** (new flat config)
3. `package.json` — Update ESLint and eslint-config-next versions

---

## 3. Compatibility Matrix

### 3.1 Version Compatibility

| Package A | Package B | Compatible | Notes |
|-----------|-----------|------------|-------|
| Next.js 16.2.10 | React 19.2.7 | ✅ | Peer dependency satisfied |
| Next.js 16.2.10 | TypeScript 5.9.3 | ✅ | Minimum 5.1.0 required |
| Next.js 16.2.10 | Node.js 22 LTS | ✅ | Minimum 20.9.0 required |
| Prisma 7.8.0 | Node.js 22 LTS | ✅ | Requires ^22.12.0 |
| Prisma 7.8.0 | PostgreSQL 16 | ✅ | Full compatibility |
| Prisma 7.8.0 | TypeScript 5.9.3 | ✅ | Requires ≥5.4.0 |
| Tailwind CSS 4.3.2 | PostCSS 8.5.16 | ✅ | PostCSS plugin available |
| ESLint 9.x | eslint-config-next 16.2.10 | ✅ | Peer dependency satisfied |
| Vitest 4.1.10 | Node.js 22 LTS | ✅ | Requires ^22.0.0 |

### 3.2 Engine Compatibility

| Package | Requires | Current Runtime | Status |
|---------|----------|-----------------|--------|
| next@16.2.10 | Node.js ≥20.9.0 | 22 LTS | ✅ Compatible |
| prisma@7.8.0 | Node.js ^20.19 \|\| ^22.12 \|\| ≥24.0 | 22 LTS | ✅ Compatible (22.12+) |
| vitest@4.1.10 | Node.js ^20.0.0 \|\| ^22.0.0 \|\| ≥24.0.0 | 22 LTS | ✅ Compatible |
| @vitejs/plugin-react@4.5.2 | Node.js ≥18 | 22 LTS | ✅ Compatible |
| husky@9.1.7 | Node.js ≥18 | 22 LTS | ✅ Compatible |
| lint-staged@17.0.8 | Node.js ≥22.22.1 | 22 LTS | ✅ Compatible |
| @playwright/test@1.61.1 | Node.js ≥18 | 22 LTS | ✅ Compatible |

---

## 4. Risk Assessment

### 4.1 Risk Matrix

| Risk | Probability | Impact | Severity | Mitigation |
|------|-------------|--------|----------|------------|
| Tailwind 4 class name breakage | High | High | **Critical** | Use `npx @tailwindcss/upgrade` codemod, visual regression test |
| Prisma 7 generator incompatibility | Medium | High | **High** | Test `prisma generate` early, keep old schema as backup |
| Next.js 16 params API change | High | Medium | **High** | Mechanical fix, well-documented |
| ESLint 9 config migration | Medium | Medium | **Medium** | Use flat config, test lint after |
| React 19 breaking changes | Low | Low | **Low** | No React 19-specific APIs used |
| TypeScript incompatibility | Low | Low | **Low** | TypeScript 5.9.3 is compatible |

### 4.2 Overall Risk Rating: **MEDIUM-HIGH**

**Rationale:**
- Tailwind CSS 3→4 is the highest risk due to potential class name changes affecting every component
- Prisma 5→7 carries risk of generated client incompatibility
- Next.js 14→16 params API change is well-documented but touches multiple files
- ESLint 8→9 config migration is mechanical but requires new configuration format

---

## 5. Rollback Plan

### 5.1 Pre-Migration Snapshot

```bash
# Create feature branch
git checkout -b feature/tech-stack-migration

# Snapshot current state
git commit -m "chore: snapshot before tech stack migration"
```

### 5.2 Phase-Specific Rollback

| Phase | Rollback Command | Risk |
|-------|------------------|------|
| Phase 1 (Node.js, TypeScript) | `git checkout package.json && npm install` | Low |
| Phase 2 (Next.js, React) | `git checkout app/api/ package.json && npm install` | Low |
| Phase 3 (Prisma) | `git checkout prisma/ lib/prisma.ts && npx prisma generate` | Low |
| Phase 4 (Tailwind) | `git checkout app/globals.css tailwind.config.js postcss.config.js package.json && npm install` | Low |
| Phase 5 (ESLint) | `git checkout .eslintrc.json package.json && rm -f eslint.config.mjs && npm install` | Low |

### 5.3 Full Rollback

```bash
# Stash changes
git stash

# Return to main
git checkout main

# Delete migration branch
git branch -D feature/tech-stack-migration

# Reinstall original dependencies
npm install

# Regenerate Prisma client
npx prisma generate

# Verify
npm run build
npm run lint
```

---

## 6. Migration Checklist

### Phase 1: Node.js Runtime & TypeScript
- [ ] Verify Node.js 22 LTS is installed
- [ ] Update `@types/node` to 22.x
- [ ] Run `npm install`
- [ ] Run `npx tsc --noEmit`

### Phase 2: Next.js & React
- [ ] Update `next` to 16.2.10
- [ ] Update `react` to 19.2.7
- [ ] Update `react-dom` to 19.2.7
- [ ] Update `@types/react` to 19.2.17
- [ ] Update `@types/react-dom` to 19.2.3
- [ ] Fix async params in 3 API routes
- [ ] Run `npm install`
- [ ] Run `npm run build`
- [ ] Run `npm run lint`
- [ ] Run `npx tsc --noEmit`

### Phase 3: Prisma
- [ ] Update `prisma` to 7.8.0
- [ ] Update `@prisma/client` to 7.8.0
- [ ] Update `prisma/schema.prisma` generator
- [ ] Verify `lib/prisma.ts` import path
- [ ] Run `npm install`
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma migrate status`
- [ ] Run `npm run build`

### Phase 4: Tailwind CSS
- [ ] Update `tailwindcss` to 4.3.2
- [ ] Install `@tailwindcss/postcss` (if needed)
- [ ] Remove `autoprefixer` from dependencies
- [ ] Rewrite `app/globals.css` for Tailwind 4
- [ ] Delete `tailwind.config.js`
- [ ] Delete `postcss.config.js`
- [ ] Audit all components for renamed utility classes
- [ ] Run `npm install`
- [ ] Run `npm run build`
- [ ] Visual regression test

### Phase 5: ESLint
- [ ] Update `eslint` to 9.x
- [ ] Update `eslint-config-next` to 16.2.10
- [ ] Install `@eslint/eslintrc`
- [ ] Create `eslint.config.mjs`
- [ ] Delete `.eslintrc.json`
- [ ] Run `npm install`
- [ ] Run `npm run lint`
- [ ] Fix any lint errors

### Phase 6: Validation
- [ ] Run `npm run build`
- [ ] Run `npm run lint`
- [ ] Run `npx tsc --noEmit`
- [ ] Run `npx prisma generate`
- [ ] Run `npm run test` (if available)
- [ ] Run `npm run test:e2e` (if available)
- [ ] Manual smoke test

---

## 7. Estimated Timeline

| Phase | Estimated Time | Dependencies |
|-------|---------------|--------------|
| Phase 1: Node.js & TypeScript | 15 min | None |
| Phase 2: Next.js & React | 45 min | Phase 1 |
| Phase 3: Prisma | 30 min | Phase 1 |
| Phase 4: Tailwind CSS | 60 min | Phase 1 |
| Phase 5: ESLint | 30 min | Phase 1 |
| Phase 6: Validation | 30 min | All phases |
| **Total** | **3.5 hours** | — |

**Buffer:** Add 1.5 hours for unexpected issues. **Total estimated: 5 hours.**

---

## 8. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Lead Software Architect | — | — | ⏳ Pending |
| Release Engineer | — | — | ⏳ Pending |
| DevOps Engineer | — | — | ⏳ Pending |

---

**Document Version:** 1.0.0
**Created:** July 7, 2026
**Status:** ✅ **COMPATIBILITY REPORT COMPLETE — READY FOR MIGRATION**
