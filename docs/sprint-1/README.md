# Sprint 1 — Development Guide

> Project: WorkerVoice — Migrant Review Platform
> Date: July 7, 2026
> Status: **READY FOR DEVELOPMENT**

---

## Current Project Status

The WorkerVoice platform has been successfully migrated to the target technology stack. All critical validations pass. The application is functional and ready for Sprint 1 development.

### Migration Complete

| Phase | Status |
|-------|--------|
| Phase 2: Next.js 16 + React 19 | ✅ Complete |
| Phase 3: Prisma 7 | ✅ Complete |
| Phase 4: Tailwind CSS 4 | ✅ Complete |
| Phase 5: ESLint 9 | ✅ Complete |
| Phase 6: Validation | ✅ Complete |

### Current Technology Stack

| Component | Version | Status |
|-----------|---------|--------|
| Node.js | 24.16.0 | ✅ Active LTS |
| Next.js | 16.2.10 | ✅ Current |
| React | 19.2.7 | ✅ Current |
| TypeScript | 5.9.3 | ✅ Latest 5.x |
| Prisma | 7.8.0 | ✅ Current |
| Tailwind CSS | 4.3.2 | ✅ Current |
| ESLint | 9.39.4 | ✅ Current |
| PostgreSQL | 16 | ✅ LTS |

---

## Sprint 1 Objectives

### Primary Goals

1. **Security Hardening** — Add security headers, input validation, CSRF protection
2. **Test Coverage** — Add unit tests and E2E tests
3. **Feature Development** — Begin MVP feature implementation

### Success Criteria

- [ ] Security headers configured
- [ ] Input validation with zod
- [ ] Basic test suite (unit + E2E)
- [ ] CI/CD pipeline set up
- [ ] First MVP feature complete

---

## Development Priorities

### Priority 1: Security (Week 1)

| Task | Effort | Impact |
|------|--------|--------|
| Add security headers | 1 hour | High |
| Install zod for validation | 1 hour | High |
| Add input validation to API routes | 4 hours | High |
| Add CSRF protection | 2 hours | High |

### Priority 2: Testing (Week 1-2)

| Task | Effort | Impact |
|------|--------|--------|
| Add Vitest configuration | 1 hour | Medium |
| Add unit tests for services | 4 hours | High |
| Add Playwright configuration | 1 hour | Medium |
| Add E2E tests for critical flows | 4 hours | High |

### Priority 3: CI/CD (Week 2)

| Task | Effort | Impact |
|------|--------|--------|
| Create GitHub Actions workflow | 2 hours | High |
| Add branch protection rules | 1 hour | Medium |
| Add automated testing on PR | 1 hour | Medium |

### Priority 4: Features (Week 2-3)

| Task | Effort | Impact |
|------|--------|--------|
| Company Search | 8 hours | High |
| Company Detail | 4 hours | High |
| Anonymous Reviews | 8 hours | High |

---

## Outstanding Technical Debt

### High Priority

| Item | Impact | Effort |
|------|--------|--------|
| No security headers | Security risk | 1 hour |
| No input validation | Security risk | 4 hours |
| No test suite | Quality risk | 8 hours |

### Medium Priority

| Item | Impact | Effort |
|------|--------|--------|
| No CSRF protection | Security risk | 2 hours |
| No rate limiting | Security risk | 2 hours |
| No GitHub Actions | DevOps risk | 2 hours |

### Low Priority

| Item | Impact | Effort |
|------|--------|--------|
| No Dockerfile | Deployment flexibility | 30 min |
| Unused `database/` directory | Code cleanliness | 5 min |
| `docs/ engineering/` naming | Code cleanliness | 5 min |

---

## Security Tasks

### Must Complete

1. Add security headers in `next.config.js`
2. Install zod for input validation
3. Add validation to all API routes
4. Add CSRF protection for forms

### Should Complete

1. Add rate limiting middleware
2. Add request logging
3. Add error boundaries

---

## Testing Tasks

### Unit Tests

1. Configure Vitest
2. Add tests for `lib/factories.ts`
3. Add tests for `lib/reviews.ts`
4. Add tests for `lib/suggestions.ts`
5. Add tests for `lib/admin.ts`

### E2E Tests

1. Configure Playwright
2. Add test for home page
3. Add test for factory search
4. Add test for factory detail
5. Add test for review submission

---

## Deployment Tasks

### Vercel Setup

1. Import project in Vercel
2. Configure environment variables
3. Set up preview deployments
4. Configure production domain

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `ADMIN_KEY` | Admin authentication key | Yes |

---

## Development Workflow

### Daily Workflow

1. Pull latest changes
2. Create feature branch
3. Implement feature
4. Run validation (`npm run lint && npm run build`)
5. Create pull request
6. Request review
7. Merge after approval

### Validation Commands

```bash
npm run lint        # Lint code
npm run build       # Build for production
npx tsc --noEmit    # Type check
npm run test:run    # Run unit tests
npm run test:e2e    # Run E2E tests
```

---

## Resources

### Documentation

- [Architecture](../architecture/system-architecture.md)
- [API Specification](../architecture/api-specification.md)
- [Database Design](../architecture/database-design.md)
- [Security](../operations/security.md)
- [Deployment](../operations/deployment.md)

### Engineering

- [Technology Stack Policy](../engineering/technology-stack-policy.md)
- [Technology Decision Record](../engineering/technology-decision-record.md)
- [Security Audit](../engineering/security-audit.md)
- [Performance Audit](../engineering/performance-audit.md)

---

**Sprint 1 is ready to begin. Let's build something great!**
