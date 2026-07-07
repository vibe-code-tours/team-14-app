# Technology Stack Migration Plan

> Project: WorkerVoice – Migrant Review Platform
> Date: July 7, 2026
> Status: Pending Approval
> Scope: Pre-Sprint 1 Modernization

---

## 1. Current Stack

### Dependencies (package.json)

| Package | Current Version | Latest Stable | Status |
|---------|-----------------|---------------|--------|
| next | 15.0.0 | 16.2.10 | ⚠️ Outdated |
| react | ^19.0.0 | 19.2.7 | ⚠️ Outdated |
| react-dom | ^19.0.0 | 19.2.7 | ⚠️ Outdated |
| @prisma/client | ^6.0.0 | 7.8.0 | ⚠️ Outdated |
| prisma | ^6.0.0 | 7.8.0 | ⚠️ Outdated |
| tailwindcss | ^3.4.0 | 4.3.2 | ⚠️ Outdated |
| typescript | ^5 | 5.9.3 | ⚠️ Outdated |
| eslint | ^9 | 9.39.4 | ⚠️ Outdated |
| eslint-config-next | 15.0.0 | 16.2.10 | ⚠️ Outdated |
| @types/node | ^22 | 22.x | ✅ Current |
| @types/react | ^19 | 19.x | ✅ Current |
| @types/react-dom | ^19 | 19.x | ✅ Current |
| autoprefixer | ^10.0.0 | 10.x | ✅ Current |
| postcss | ^8.0.0 | 8.x | ✅ Current |

### Configuration Files

| File | Current | Status |
|------|---------|--------|
| package.json | Next.js 15 format | ⚠️ Needs update |
| tsconfig.json | Standard | ✅ Compatible |
| next.config.js | CommonJS | ⚠️ Needs update |
| eslint.config.mjs | ESLint 9 flat config | ✅ Compatible |
| tailwind.config.js | Tailwind 3 | ⚠️ Remove for Tailwind 4 |
| postcss.config.js | Tailwind 3 plugin | ⚠️ Needs update |
| docker-compose.yml | PostgreSQL 16 | ✅ Compatible |
| prisma/schema.prisma | Prisma 6 | ⚠️ Needs update |

### Infrastructure

| Component | Current | Status |
|-----------|---------|--------|
| Node.js | 24.x | ✅ Compatible |
| PostgreSQL | 16 | ✅ Compatible |
| Docker | Latest | ✅ Compatible |

---

## 2. Recommended Stack

### Target Dependencies

| Package | Target Version | Purpose |
|---------|----------------|---------|
| next | 16.2.10 | Framework |
| react | 19.2.7 | UI library |
| react-dom | 19.2.7 | React DOM |
| @prisma/client | 7.8.0 | Database client |
| prisma | 7.8.0 | ORM CLI |
| tailwindcss | 4.3.2 | CSS framework |
| @tailwindcss/postcss | 4.3.2 | PostCSS plugin |
| typescript | 5.9.3 | Type system |
| eslint | 9.39.4 | Linter |
| eslint-config-next | 16.2.10 | Next.js ESLint |

### New Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next-auth (Auth.js) | 5.0.0-beta.25 | Authentication |
| @auth/prisma-adapter | Latest | Prisma integration |
| bcryptjs | 3.0.3 | Password hashing |
| zod | 4.4.3 | Input validation |
| vitest | 4.1.10 | Unit testing |
| @playwright/test | 1.61.1 | E2E testing |
| prettier | 3.9.4 | Code formatting |
| prettier-plugin-tailwindcss | Latest | Tailwind sorting |
| husky | 9.1.7 | Git hooks |
| lint-staged | 17.0.8 | Pre-commit linting |

### Development Tools

| Tool | Purpose |
|------|---------|
| Node.js 22 LTS | Runtime |
| Docker Compose | Local PostgreSQL |
| Vercel | Deployment |
| Supabase | Production database |

---

## 3. Breaking Changes

### Next.js 15 → 16

| Change | Impact | Migration Effort |
|--------|--------|------------------|
| Config format | Medium | Update next.config.js → next.config.ts |
| Caching semantics | High | Review fetch caching behavior |
| File conventions | Low | Minimal changes |
| React 19 features | Low | Already compatible |

**Key Changes:**
- `next.config.js` → `next.config.ts` (TypeScript config)
- New caching semantics (no more `force-cache` by default)
- Updated `use` hook support
- New `after` API for background tasks

### Prisma 6 → 7

| Change | Impact | Migration Effort |
|--------|--------|------------------|
| Client API | Medium | Update client imports |
| Schema syntax | Low | Minor updates |
| Query API | Medium | Update complex queries |

**Key Changes:**
- New `prisma-client` generator
- Updated `findMany` and `findFirst` behavior
- New `orderBy` syntax
- Improved performance

### Tailwind 3 → 4

| Change | Impact | Migration Effort |
|--------|--------|------------------|
| Config format | High | Complete rewrite |
| CSS approach | High | New CSS-first config |
| Utility classes | Medium | Review all classes |
| Plugin system | High | Update plugins |

**Key Changes:**
- CSS-first configuration (no more `tailwind.config.js`)
- New `@tailwindcss/postcss` plugin
- Different utility names
- New `@theme` directive
- Improved performance

### Auth.js Integration

| Change | Impact | Migration Effort |
|--------|--------|------------------|
| New dependency | Medium | Add Auth.js |
| Prisma adapter | Medium | Configure adapter |
| Session management | Medium | Implement sessions |

---

## 4. Migration Steps

### Phase 1: Core Framework (High Risk)

**Step 1: Update Next.js**
```bash
npm install next@16.2.10 eslint-config-next@16.2.10
```

**Step 2: Update Config**
- Rename `next.config.js` → `next.config.ts`
- Update config format for Next.js 16

**Step 3: Test Build**
```bash
npm run build
```

**Rollback:**
```bash
npm install next@15.0.0 eslint-config-next@15.0.0
```

### Phase 2: React & TypeScript (Low Risk)

**Step 4: Update React**
```bash
npm install react@19.2.7 react-dom@19.2.7
```

**Step 5: Update TypeScript**
```bash
npm install typescript@5.9.3 @types/react@19 @types/react-dom@19
```

**Step 6: Test Build**
```bash
npm run build
```

**Rollback:**
```bash
npm install react@19.0.0 react-dom@19.0.0 typescript@5.0.0
```

### Phase 3: Styling (High Risk)

**Step 7: Update Tailwind**
```bash
npm install tailwindcss@4.3.2 @tailwindcss/postcss@4.3.2
npm uninstall autoprefixer
```

**Step 8: Update PostCSS Config**
- Update `postcss.config.js` for Tailwind 4

**Step 9: Remove Old Config**
- Delete `tailwind.config.js`

**Step 10: Update CSS**
- Update `app/globals.css` for Tailwind 4 syntax

**Step 11: Test Build**
```bash
npm run build
```

**Rollback:**
```bash
npm install tailwindcss@3.4.19 autoprefixer@10.4.0
npm uninstall @tailwindcss/postcss
# Restore tailwind.config.js
```

### Phase 4: Database (Medium Risk)

**Step 12: Update Prisma**
```bash
npm install prisma@7.8.0 @prisma/client@7.8.0
```

**Step 13: Update Schema**
- Update `prisma/schema.prisma` for Prisma 7

**Step 14: Regenerate Client**
```bash
npx prisma generate
```

**Step 15: Test Migration**
```bash
npx prisma migrate dev
```

**Rollback:**
```bash
npm install prisma@6.19.3 @prisma/client@6.19.3
npx prisma generate
```

### Phase 5: Authentication (Medium Risk)

**Step 16: Install Auth.js**
```bash
npm install next-auth@5.0.0-beta.25 @auth/prisma-adapter bcryptjs
npm install -D @types/bcryptjs
```

**Step 17: Configure Auth.js**
- Create `lib/auth.ts`
- Configure Prisma adapter

**Step 18: Update Schema**
- Add Account, Session, VerificationToken models

**Step 19: Test Auth Flow**
- Test registration
- Test login
- Test session

**Rollback:**
```bash
npm uninstall next-auth @auth/prisma-adapter bcryptjs @types/bcryptjs
```

### Phase 6: Validation (Low Risk)

**Step 20: Install Zod**
```bash
npm install zod
```

**Step 21: Create Schemas**
- Create validation schemas for all inputs

**Step 22: Test Validation**
- Test all API endpoints

**Rollback:**
```bash
npm uninstall zod
```

### Phase 7: Testing (Low Risk)

**Step 23: Install Vitest**
```bash
npm install -D vitest @vitejs/plugin-react
```

**Step 24: Install Playwright**
```bash
npm install -D @playwright/test
```

**Step 25: Configure Testing**
- Create `vitest.config.ts`
- Create `playwright.config.ts`
- Write initial tests

**Rollback:**
```bash
npm uninstall vitest @vitejs/plugin-react @playwright/test
```

### Phase 8: Code Quality (Low Risk)

**Step 26: Install Prettier**
```bash
npm install -D prettier prettier-plugin-tailwindcss
```

**Step 27: Install Husky**
```bash
npm install -D husky lint-staged
npx husky init
```

**Step 28: Configure Pre-commit**
- Create `.husky/pre-commit`
- Configure lint-staged in package.json

**Rollback:**
```bash
npm uninstall prettier prettier-plugin-tailwindcss husky lint-staged
```

---

## 5. Risks

### High Risk

| Risk | Impact | Mitigation |
|------|--------|------------|
| Tailwind 4 migration | All UI components | Test thoroughly, rollback plan |
| Next.js 16 caching changes | Data fetching | Review all fetch calls |
| Auth.js integration | Authentication flow | Implement incrementally |

### Medium Risk

| Risk | Impact | Mitigation |
|------|--------|------------|
| Prisma 7 API changes | Database queries | Test all queries |
| ESLint config changes | Code quality | Verify all rules |
| Breaking changes in dependencies | Build failures | Rollback plan ready |

### Low Risk

| Risk | Impact | Mitigation |
|------|--------|------------|
| TypeScript updates | Type errors | Fix incrementally |
| Testing setup | Test coverage | Start with unit tests |
| Code formatting | Style consistency | Apply incrementally |

---

## 6. Documentation Updates

### CLAUDE.md Updates

Update technology stack section:

```markdown
# Current Technology Stack

Frontend

- Next.js 16.2.10 (App Router)
- React 19.2.7
- TypeScript 5.9.3
- Tailwind CSS 4.3.2

Backend

- Next.js Route Handlers
- Prisma ORM 7.8.0

Database

- PostgreSQL 16
- Docker Compose

Development

- Node.js 22 LTS
- Docker Compose (PostgreSQL)
- ESLint 9.39.4
- Prettier 3.9.4
- Husky 9.1.7
- lint-staged 17.0.8

Testing

- Vitest 4.1.10
- Playwright 1.61.1

Authentication

- Auth.js 5.0.0-beta.25
- bcryptjs 3.0.3

Validation

- Zod 4.4.3

Deployment (Planned)

- Vercel
- Supabase
```

### Architecture Documentation Updates

Update `docs/architecture/system-architecture.md`:

| Section | Update |
|---------|--------|
| Technology Stack | Add new versions |
| Authentication | Add Auth.js section |
| Testing | Add Vitest and Playwright |
| Code Quality | Add Prettier and Husky |

### Development Commands Updates

Add new commands to CLAUDE.md:

```markdown
# Commands

Development

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run format
```

Testing

```bash
npm run test
npm run test:unit
npm run test:e2e
npm run test:coverage
```

Database

```bash
docker compose up -d
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

Code Quality

```bash
npm run lint
npm run format
npm run type-check
```
```

---

## 7. Final Recommendation

### Migration Strategy

**Recommended Approach: Incremental Migration**

Migrate in phases with rollback capability at each step:

1. **Phase 1-2:** Core framework (Next.js, React, TypeScript)
2. **Phase 3:** Styling (Tailwind 4)
3. **Phase 4:** Database (Prisma 7)
4. **Phase 5-6:** New features (Auth.js, Zod)
5. **Phase 7-8:** Developer experience (Testing, Prettier, Husky)

### Timeline

| Phase | Duration | Risk |
|-------|----------|------|
| Phase 1-2 | 1 day | Medium |
| Phase 3 | 1 day | High |
| Phase 4 | 0.5 day | Medium |
| Phase 5-6 | 1 day | Medium |
| Phase 7-8 | 0.5 day | Low |
| **Total** | **4 days** | **Medium** |

### Rollback Strategy

Each phase has a documented rollback procedure. If any phase fails:
1. Stop migration
2. Execute rollback commands
3. Verify build passes
4. Continue with current stable version

### Success Criteria

- [ ] All tests pass
- [ ] Build succeeds
- [ ] No console errors
- [ ] Authentication works
- [ ] Database migrations work
- [ ] All API endpoints functional

---

## 8. Approval Checklist

Before proceeding, confirm:

- [ ] Timeline is acceptable (4 days)
- [ ] Risks are acceptable
- [ ] Rollback strategy is clear
- [ ] Documentation updates are planned
- [ ] Team is available for support

---

**Status:** Migration plan complete. Awaiting approval to proceed.

**Do NOT modify package.json or source code until approved.**
