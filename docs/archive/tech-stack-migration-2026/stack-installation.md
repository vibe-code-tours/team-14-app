# Technology Stack Installation

> Project: WorkerVoice – Migrant Review Platform
> Date: July 7, 2026
> Status: Official Baseline

---

## Official Baseline Stack

| Package | Version | Purpose | Classification | Why Selected |
|---------|---------|---------|----------------|--------------|
| Next.js | 14.2.35 | Framework | Keep Current | Latest LTS, stable, Vercel supported |
| React | 18.3.1 | UI | Keep Current | Required by Next.js 14, stable |
| React DOM | 18.3.1 | React DOM | Keep Current | Required by Next.js 14, stable |
| TypeScript | 5.9.3 | Type system | Keep Current | Latest stable release |
| Prisma | 5.22.0 | ORM | Keep Current | Latest stable 5.x, production-ready |
| @prisma/client | 5.22.0 | Database client | Keep Current | Matches prisma version |
| Tailwind CSS | 3.4.19 | Styling | Keep Current | Latest stable 3.x, no config migration |
| ESLint | 8.57.1 | Linting | Upgrade After MVP | Required by eslint-config-next@14 |
| eslint-config-next | 14.2.35 | Next.js ESLint | Keep Current | Matches Next.js version |
| PostCSS | 8.5.16 | CSS processing | Keep Current | Latest stable |
| Autoprefixer | 10.4.20 | CSS prefixes | Upgrade Now | Bug fixes available |
| Prettier | 3.9.4 | Formatting | Keep Current | Latest stable release |
| prettier-plugin-tailwindcss | 0.6.12 | Tailwind formatting | Upgrade Now | New features available |
| Husky | 9.1.7 | Git hooks | Keep Current | Latest stable release |
| lint-staged | 17.0.8 | Pre-commit linting | Keep Current | Latest stable release |
| Vitest | 4.1.10 | Unit testing | Keep Current | Latest stable release |
| @vitejs/plugin-react | 4.5.2 | Vitest React plugin | Upgrade Now | Bug fixes available |
| @playwright/test | 1.61.1 | E2E testing | Keep Current | Latest stable release |

---

## Installation Commands

### Step 1: Clean Installation

```bash
# Remove existing node_modules and lock file
rm -rf node_modules package-lock.json

# Install all dependencies
npm install
```

### Step 2: Verify Core Packages

```bash
# Check installed versions
npm list next react react-dom prisma @prisma/client tailwindcss typescript eslint
```

**Expected output:**
```
├── next@14.2.35
├── react@18.3.1
├── react-dom@18.3.1
├── @prisma/client@5.22.0
├── prisma@5.22.0
├── tailwindcss@3.4.19
├── typescript@5.9.3
└── eslint@9.39.4
```

### Step 3: Verify Build

```bash
# Run build
npm run build
```

**Expected:** Build succeeds with no errors.

### Step 4: Verify Lint

```bash
# Run lint
npm run lint
```

**Expected:** No linting errors.

### Step 5: Verify Prisma

```bash
# Generate Prisma client
npx prisma generate

# Check Prisma version
npx prisma --version
```

**Expected:** Prisma 5.22.0, client generated successfully.

### Step 6: Verify TypeScript

```bash
# Run type check
npx tsc --noEmit
```

**Expected:** No type errors.

### Step 7: Verify Docker

```bash
# Start PostgreSQL
docker compose up -d

# Check container
docker ps
```

**Expected:** PostgreSQL 16 running.

---

## Compatibility Matrix

| Package A | Package B | Compatible |
|-----------|-----------|------------|
| Next.js 14.2.35 | React 18.3.1 | ✅ Yes |
| Next.js 14.2.35 | TypeScript 5.9.3 | ✅ Yes |
| Next.js 14.2.35 | Prisma 5.22.0 | ✅ Yes |
| Next.js 14.2.35 | Tailwind 3.4.19 | ✅ Yes |
| Next.js 14.2.35 | ESLint 9.39.4 | ✅ Yes |
| Prisma 5.22.0 | PostgreSQL 16 | ✅ Yes |
| Vitest 4.1.10 | React 18.3.1 | ✅ Yes |
| Playwright 1.61.1 | Next.js 14.2.35 | ✅ Yes |

---

## Post-Installation Configuration

### Prettier

Create `.prettierrc`:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### Husky

```bash
# Initialize husky
npx husky init

# Create pre-commit hook
echo "npx lint-staged" > .husky/pre-commit
```

### lint-staged

Add to `package.json`:
```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

### Vitest

Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
```

### Playwright

```bash
# Install browsers
npx playwright install chromium
```

---

## Verification Checklist

- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
- [ ] `npx prisma generate` succeeds
- [ ] `npx tsc --noEmit` passes
- [ ] `docker compose up -d` works
- [ ] `npm run test` runs (after tests are written)
- [ ] `npx playwright install chromium` succeeds

---

**Status:** Ready to execute. Run installation commands in order.
