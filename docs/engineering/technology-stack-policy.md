# Technology Stack Policy

> Project: WorkerVoice – Migrant Review Platform
> Version: 1.0.0
> Effective Date: July 7, 2026
> Owner: Principal Software Architect & Release Manager
> Status: Official Baseline

---

## 1. Purpose

This document defines the official technology stack for WorkerVoice Sprint 1 and establishes policies for version management, upgrades, and security maintenance.

---

## 2. Supported Versions

### 2.1 Core Framework

| Package | Current Version | Latest Stable | Latest Major | Classification |
|---------|-----------------|---------------|--------------|----------------|
| Next.js | 14.2.35 | 14.2.35 | 16.2.10 | **Keep Current** |
| React | 18.3.1 | 18.3.1 | 19.2.7 | **Keep Current** |
| React DOM | 18.3.1 | 18.3.1 | 19.2.7 | **Keep Current** |
| TypeScript | 5.9.3 | 5.9.3 | 5.9.3 | **Keep Current** |

### 2.2 Database

| Package | Current Version | Latest Stable | Latest Major | Classification |
|---------|-----------------|---------------|--------------|----------------|
| Prisma | 5.22.0 | 5.22.0 | 7.8.0 | **Keep Current** |
| @prisma/client | 5.22.0 | 5.22.0 | 7.8.0 | **Keep Current** |
| PostgreSQL | 16 | 16 | 17 | **Keep Current** |

### 2.3 Styling

| Package | Current Version | Latest Stable | Latest Major | Classification |
|---------|-----------------|---------------|--------------|----------------|
| Tailwind CSS | 3.4.19 | 3.4.19 | 4.3.2 | **Keep Current** |
| PostCSS | 8.5.16 | 8.5.16 | 8.5.16 | **Keep Current** |
| Autoprefixer | 10.4.20 | 10.5.2 | 10.5.2 | **Upgrade Now** |

### 2.4 Code Quality

| Package | Current Version | Latest Stable | Latest Major | Classification |
|---------|-----------------|---------------|--------------|----------------|
| ESLint | 8.57.1 | 8.57.1 | 9.39.4 | **Upgrade After MVP** |
| eslint-config-next | 14.2.35 | 14.2.35 | 16.2.10 | **Keep Current** |
| Prettier | 3.9.4 | 3.9.4 | 3.9.4 | **Keep Current** |
| prettier-plugin-tailwindcss | 0.6.12 | 0.8.0 | 0.8.0 | **Upgrade Now** |

### 2.5 Testing

| Package | Current Version | Latest Stable | Latest Major | Classification |
|---------|-----------------|---------------|--------------|----------------|
| Vitest | 4.1.10 | 4.1.10 | 4.1.10 | **Keep Current** |
| @vitejs/plugin-react | 4.5.2 | 4.7.0 | 4.7.0 | **Upgrade Now** |
| @playwright/test | 1.61.1 | 1.61.1 | 1.61.1 | **Keep Current** |

### 2.6 Git Hooks

| Package | Current Version | Latest Stable | Latest Major | Classification |
|---------|-----------------|---------------|--------------|----------------|
| Husky | 9.1.7 | 9.1.7 | 9.1.7 | **Keep Current** |
| lint-staged | 17.0.8 | 17.0.8 | 17.0.8 | **Keep Current** |

### 2.7 Type Definitions

| Package | Current Version | Latest Stable | Latest Major | Classification |
|---------|-----------------|---------------|--------------|----------------|
| @types/node | 20.19.43 | 20.19.43 | 20.19.43 | **Keep Current** |
| @types/react | 18.3.31 | 18.3.31 | 19.x | **Keep Current** |
| @types/react-dom | 18.3.7 | 18.3.7 | 19.x | **Keep Current** |

---

## 3. Classification Details

> **Audit Date:** July 7, 2026 — Verified against npm registry and official vendor documentation.

### 3.1 Recommended

These packages are at their latest stable versions. No action required.

| Package | Version | Rationale |
|---------|---------|-----------|
| TypeScript | 5.9.3 | Latest stable 5.x, fully compatible |
| Tailwind CSS | 3.4.19 | Latest stable 3.x, no config migration needed for Sprint 1 |
| PostgreSQL | 16 | LTS, supported until November 2028 |
| Prettier | 3.9.4 | Latest stable |
| Husky | 9.1.7 | Latest stable |
| lint-staged | 17.0.8 | Latest stable |
| Vitest | 4.1.10 | Latest stable |
| Playwright | 1.61.1 | Latest stable |
| PostCSS | 8.5.16 | Latest stable |
| Autoprefixer | 10.5.2 | Latest stable |

### 3.2 Acceptable

These packages are supported but one or more majors behind the current release.

| Package | Version | Current | Rationale |
|---------|---------|---------|-----------|
| Next.js | 14.2.35 | 16.2.10 | Maintenance mode, security patches only. Functional for Sprint 1. |
| React | 18.3.1 | 19.2.7 | Supported but not actively developed. Compatible with Next.js 16. |
| React DOM | 18.3.1 | 19.2.7 | Must match React version |
| Prisma | 5.22.0 | 7.8.0 | Maintenance mode, security patches only. Functional for Sprint 1. |
| @prisma/client | 5.22.0 | 7.8.0 | Must match Prisma version |
| Node.js | 24.16.0 | 24.x | Active LTS, supported until April 2028 |
| @types/node | 20.19.43 | 24.x | Mismatched with Node.js 24 runtime. Functional. |
| prettier-plugin-tailwindcss | 0.6.12 | 0.8.0 | Supported, backward compatible |

### 3.3 Upgrade After MVP (Sprint 2–3)

These packages require major version upgrades with breaking changes.

| Package | Current | Target | Sprint | Rationale |
|---------|---------|--------|--------|-----------|
| Next.js | 14.2.35 | 16.2.10 | 2 | Major migration, requires React 18/19 |
| React | 18.3.1 | 19.2.7 | 2 | Requires Next.js 15+ |
| React DOM | 18.3.1 | 19.2.7 | 2 | Must match React |
| Prisma | 5.22.0 | 7.8.0 | 2 | Major API changes, schema migration |
| @prisma/client | 5.22.0 | 7.8.0 | 2 | Must match Prisma |
| ESLint | 8.57.1 | 9.x+ | 2 | EOL since Oct 2023, flat config required |
| eslint-config-next | 14.2.35 | 16.2.10 | 2 | Must match Next.js version |
| @types/react | 18.3.31 | 19.2.17 | 2 | Must match React version |
| @types/react-dom | 18.3.7 | 19.2.3 | 2 | Must match React DOM |
| @types/node | 20.19.43 | 24.x | 2 | Align with Node.js runtime |
| @vitejs/plugin-react | 4.5.2 | 6.0.3 | 2 | Two majors behind |
| Tailwind CSS | 3.4.19 | 4.3.2 | 3 | Complete config rewrite, deferred |

### 3.4 Critical Security Upgrade

| Package | Version | Issue | Action |
|---------|---------|-------|--------|
| ESLint | 8.57.1 | **EOL since October 2023** — no security patches | Must upgrade before any production deployment |

---

## 4. Recommended Technology Stack

### 4.1 Official Baseline (Sprint 1)

> **Audit Date:** July 7, 2026

| Package | Version | Classification | Release Type |
|---------|---------|----------------|--------------|
| Next.js | 14.2.35 | ⚠ Acceptable | Maintenance mode |
| React | 18.3.1 | ⚠ Acceptable | Supported (legacy) |
| React DOM | 18.3.1 | ⚠ Acceptable | Supported (legacy) |
| TypeScript | 5.9.3 | ✅ Recommended | Latest stable 5.x |
| Prisma | 5.22.0 | ⚠ Acceptable | Maintenance mode |
| @prisma/client | 5.22.0 | ⚠ Acceptable | Maintenance mode |
| Tailwind CSS | 3.4.19 | ✅ Recommended | Latest stable 3.x |
| PostgreSQL | 16 | ✅ Recommended | LTS (EOL Nov 2028) |
| ESLint | 8.57.1 | ❌ Unsupported | **EOL since Oct 2023** |
| eslint-config-next | 14.2.35 | ⚠ Acceptable | Maintenance mode |
| PostCSS | 8.5.16 | ✅ Recommended | Latest stable |
| Autoprefixer | 10.5.2 | ✅ Recommended | Latest stable |
| Prettier | 3.9.4 | ✅ Recommended | Latest stable |
| prettier-plugin-tailwindcss | 0.6.12 | ✅ Recommended | Latest stable |
| Vitest | 4.1.10 | ✅ Recommended | Latest stable |
| @vitejs/plugin-react | 4.5.2 | ⚠ Acceptable | Two majors behind |
| @playwright/test | 1.61.1 | ✅ Recommended | Latest stable |
| Husky | 9.1.7 | ✅ Recommended | Latest stable |
| lint-staged | 17.0.8 | ✅ Recommended | Latest stable |
| @types/node | 20.19.43 | ⚠ Acceptable | Mismatched with runtime |
| @types/react | 18.3.31 | ✅ Recommended | Matches React 18 |
| @types/react-dom | 18.3.7 | ✅ Recommended | Matches React DOM 18 |

### 4.2 Post-Sprint 1 Target Stack

| Package | Target Version | Sprint | Classification |
|---------|---------------|--------|----------------|
| Next.js | 16.2.10 | 2 | **Recommended** |
| React | 19.2.7 | 2 | **Recommended** |
| React DOM | 19.2.7 | 2 | **Recommended** |
| TypeScript | 5.9.3 | — | **Recommended** (keep) |
| Prisma | 7.8.0 | 2 | **Recommended** |
| @prisma/client | 7.8.0 | 2 | **Recommended** |
| Tailwind CSS | 4.3.2 | 3 | **Recommended** |
| PostgreSQL | 17 | Prod | **Recommended** |
| ESLint | 9.x+ | 2 | **Recommended** |
| eslint-config-next | 16.2.10 | 2 | **Recommended** |
| @types/react | 19.2.17 | 2 | **Recommended** |
| @types/react-dom | 19.2.3 | 2 | **Recommended** |
| @types/node | 24.x | 2 | **Recommended** |
| @vitejs/plugin-react | 6.0.3 | 2 | **Recommended** |

### 4.3 Node.js Requirement

| Requirement | Version |
|-------------|---------|
| Minimum | 20.9.0 |
| Recommended | 22 LTS or newer |
| Current | 24.16.0 |

---

## 5. Why Each Version Was Selected

> **Audit Date:** July 7, 2026 — All versions verified against npm registry and official vendor documentation.

### 5.1 Next.js 14.2.35

- **Status:** ⚠ Maintenance mode — security patches only
- **Why Sprint 1:** Stable, functional, builds and lints successfully. Defers migration complexity to post-MVP.
- **Post-Sprint 1 Target:** Next.js 16.2.10 (current active version)
- **Security:** Critical security patches only. New features in 16.x only.

### 5.2 React 18.3.1

- **Status:** ⚠ Supported (legacy) — not actively developed
- **Why Sprint 1:** Required by Next.js 14. Latest stable in React 18 line.
- **Post-Sprint 1 Target:** React 19.2.7 (current stable)
- **Security:** Supported but no new features. React 19 is the primary development focus.

### 5.3 TypeScript 5.9.3

- **Status:** ✅ Recommended — latest stable 5.x
- **Why:** Latest stable release, fully compatible with all current and target dependencies.
- **Note:** TypeScript 6.0.3 is available but too new for a production baseline.

### 5.4 Prisma 5.22.0

- **Status:** ⚠ Maintenance mode — security patches only
- **Why Sprint 1:** Latest stable in Prisma 5 line. No schema changes required.
- **Post-Sprint 1 Target:** Prisma 7.8.0 (current active version)
- **Security:** Critical security patches only.

### 5.5 Tailwind CSS 3.4.19

- **Status:** ✅ Recommended — latest stable 3.x
- **Why Sprint 1:** No config file migration required. Full plugin compatibility.
- **Post-Sprint 1 Target:** Tailwind CSS 4.3.2 (Sprint 3 — larger migration)

### 5.6 PostgreSQL 16

- **Status:** ✅ Recommended — LTS
- **Why:** Supported until November 2028. Full Prisma 5 compatibility.
- **Production Target:** PostgreSQL 17 (EOL November 2029)

---

## 6. Upgrade Policy

### 6.1 Patch Version Upgrades

**Frequency:** Continuous
**Process:** Automated during development
**Risk:** Minimal

Patch versions contain bug fixes and security patches. These should be applied immediately.

### 6.2 Minor Version Upgrades

**Frequency:** Quarterly
**Process:** Review, test, and update
**Risk:** Low

Minor versions contain new features and improvements. Review changelog and test before updating.

### 6.3 Major Version Upgrades

**Frequency:** Post-MVP
**Process:** Full migration plan required
**Risk:** Medium to High

Major versions contain breaking changes. Requires:
1. Migration plan
2. Testing
3. Documentation update
4. Rollback strategy

---

## 7. Security Update Policy

### 7.1 Critical Vulnerabilities

- **Response Time:** Immediate (within 24 hours)
- **Process:** Emergency patch
- **Approval:** Release Manager

### 7.2 High Vulnerabilities

- **Response Time:** Within 1 week
- **Process:** Scheduled update
- **Approval:** Release Manager

### 7.3 Medium/Low Vulnerabilities

- **Response Time:** Within 1 month
- **Process:** Regular update cycle
- **Approval:** Standard process

### 7.4 Monitoring

- Run `npm audit` weekly
- Monitor security advisories
- Subscribe to package security lists

---

## 8. Major Version Policy

### 8.1 Evaluation Criteria

Before upgrading to a major version, evaluate:

1. **Breaking Changes:** What changes are required?
2. **Migration Effort:** How much work is involved?
3. **Benefits:** What improvements does it provide?
4. **Risk:** What could go wrong?
5. **Timeline:** When should it be done?

### 8.2 Approval Process

1. Technical Lead proposes upgrade
2. Architecture review
3. Migration plan created
4. Risk assessment
5. Approval from Release Manager
6. Implementation
7. Verification

### 8.3 Current Major Upgrade Status

| Package | Current | Target | Status | Timeline |
|---------|---------|--------|--------|----------|
| Next.js | 14.2.35 | 16.2.10 | **Planned** | Sprint 2 |
| React | 18.3.1 | 19.2.7 | **Planned** | Sprint 2 |
| React DOM | 18.3.1 | 19.2.7 | **Planned** | Sprint 2 |
| Prisma | 5.22.0 | 7.8.0 | **Planned** | Sprint 2 |
| ESLint | 8.57.1 | 9.x+ | **Planned** | Sprint 2 |
| Tailwind | 3.4.19 | 4.3.2 | **Planned** | Sprint 3 |
| TypeScript | 5.9.3 | 5.9.3 | **No action** | — |

---

## 9. Node.js Policy

### 9.1 Version Requirements

| Requirement | Version | Notes |
|-------------|---------|-------|
| Minimum | 20.9.0 | Required by Next.js 16 |
| Recommended | 22 LTS | Active LTS, EOL April 2027 |
| Current (Dev) | 24.x | Active LTS, EOL April 2028 |

### 9.2 Upgrade Schedule

- **LTS Versions:** Upgrade within 6 months of release
- **Current Versions:** Optional, for development only
- **EOL Versions:** Never use in production

### 9.3 Compatibility

Node.js 22 LTS is fully compatible with:
- Next.js 14.x
- Prisma 5.x
- All current dependencies

---

## 10. Dependency Review Schedule

### 10.1 Weekly

- Run `npm audit`
- Check for security advisories
- Review critical updates

### 10.2 Monthly

- Review all dependencies for updates
- Test patch upgrades
- Update documentation

### 10.3 Quarterly

- Review minor version upgrades
- Plan major version upgrades
- Update technology stack policy

### 10.4 Annually

- Comprehensive technology review
- Major version upgrade planning
- Security audit

---

## 11. Production Support Policy

### 11.1 Supported Environments

| Environment | Status |
|-------------|--------|
| Production | ✅ Supported |
| Staging | ✅ Supported |
| Development | ✅ Supported |

### 11.2 Support Duration

| Package Category | Minimum Support |
|------------------|-----------------|
| Core Framework | 2 years |
| Database | 5 years (LTS) |
| Security Tools | Active maintenance |

### 11.3 End of Life

Packages at EOL must be upgraded within:
- **Critical:** 30 days
- **High:** 90 days
- **Medium:** 180 days

---

## 12. Compliance

### 12.1 Package Requirements

All packages must:
- Have active security support
- Be compatible with current stack
- Be production-ready
- Have documentation

### 12.2 Prohibited Packages

- Beta versions (unless explicitly approved)
- Experimental packages
- Packages without security support
- Packages with known vulnerabilities

---

## 13. Documentation Requirements

### 13.1 Required Documentation

- CLAUDE.md — Technology stack versions
- System Architecture — Technology stack tables
- Stack Installation — Installation guide
- Stack Verification — Verification report
- This Policy — Version management policy

### 13.2 Update Schedule

- **Immediate:** After any version change
- **Weekly:** Review for accuracy
- **Monthly:** Comprehensive review

---

## 14. Approval

| Role | Name | Date |
|------|------|------|
| Principal Software Architect | — | July 7, 2026 |
| Release Manager | — | July 7, 2026 |

---

**Document Version:** 1.0.0
**Effective Date:** July 7, 2026
**Next Review:** October 7, 2026
