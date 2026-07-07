# Sprint 1 Implementation Plan

> Project: WorkerVoice – Migrant Review Platform
> Sprint: 1
> Duration: 2 weeks (July 7-21, 2026)
> Goal: Worker can search companies, view reviews, submit anonymous reviews, and vote
> Status: Approved

---

## Technology Stack (Frozen)

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.x | Framework |
| React | 19.x | UI |
| TypeScript | 5.x | Type system |
| Tailwind CSS | 3.4.x | Styling |
| Prisma | 6.x | ORM |
| PostgreSQL | 16 | Database |
| ESLint | 9.x | Linting |
| Node.js | 22 LTS | Runtime |

**Note:** Framework upgrades (Next.js 16, Prisma 7, Tailwind 4) are deferred to post-MVP.

---

## Sprint 1 Objectives

By end of Sprint 1, a migrant worker can:

1. Open the website
2. Search for a factory
3. View company details
4. Read anonymous reviews
5. Register an account
6. Login
7. Submit an anonymous review
8. Vote on review helpfulness

---

## Implementation Phases

### Phase 1: Foundation (Days 1-2)

#### Task 1.1: Install Auth.js

**Business Objective:**
Enable user authentication so workers can submit reviews.

**Technical Scope:**
```bash
npm install next-auth@beta @auth/prisma-adapter bcryptjs
npm install -D @types/bcryptjs
```

**Files to Create:**
- `lib/auth.ts` — Auth.js configuration
- `app/api/auth/[...nextauth]/route.ts` — Auth API route

**Configuration:**
- Configure Prisma adapter
- Set up JWT strategy
- Configure session handling

**Acceptance Criteria:**
- [ ] Auth.js installed
- [ ] Prisma adapter configured
- [ ] JWT strategy working
- [ ] Session handling configured

**Estimated Time:** 2 hours

---

#### Task 1.2: Configure bcryptjs

**Business Objective:**
Securely hash user passwords.

**Technical Scope:**
- Create `lib/password.ts` — Password hashing utilities
- Implement `hashPassword()` function
- Implement `comparePassword()` function

**Acceptance Criteria:**
- [ ] Password hashing works
- [ ] Password comparison works
- [ ] Salt rounds = 12

**Estimated Time:** 1 hour

---

#### Task 1.3: Configure Zod Validation

**Business Objective:**
Validate all user input to prevent errors and security issues.

**Technical Scope:**
```bash
npm install zod
```

**Files to Create:**
- `lib/validations/auth.ts` — Auth validation schemas
- `lib/validations/review.ts` — Review validation schemas
- `lib/validations/company.ts` — Company validation schemas

**Schemas:**
```typescript
// Registration
registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(2).max(50)
})

// Login
loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

// Review
reviewSchema = z.object({
  factoryId: z.number().int().positive(),
  workerRole: z.string().min(1).max(255),
  countryFrom: z.string().min(1).max(100),
  ratingSalary: z.number().int().min(1).max(5),
  ratingOt: z.number().int().min(1).max(5),
  ratingHousing: z.number().int().min(1).max(5),
  reviewText: z.string().min(10).max(5000)
})
```

**Acceptance Criteria:**
- [ ] Zod installed
- [ ] Validation schemas created
- [ ] Schemas tested
- [ ] Error messages clear

**Estimated Time:** 2 hours

---

### Phase 2: Database (Days 2-3)

#### Task 2.1: Create Profile Model

**Business Objective:**
Store user account information.

**Technical Scope:**
Update `prisma/schema.prisma`:

```prisma
model Profile {
  id            String    @id @default(cuid())
  email         String    @unique
  displayName   String    @map("display_name")
  passwordHash  String    @map("password_hash")
  role          Role      @default(USER)
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  reviews       Review[]
  votes         ReviewVote[]

  @@map("profiles")
}

enum Role {
  USER
  MODERATOR
  ADMIN
}
```

**Acceptance Criteria:**
- [ ] Profile model created
- [ ] Role enum defined
- [ ] Relations configured
- [ ] Migration created

**Estimated Time:** 1 hour

---

#### Task 2.2: Create ReviewVote Model

**Business Objective:**
Allow users to vote on review helpfulness.

**Technical Scope:**
Update `prisma/schema.prisma`:

```prisma
model ReviewVote {
  id        String   @id @default(cuid())
  reviewId  String   @map("review_id")
  userId    String   @map("user_id")
  voteType  VoteType @map("vote_type")
  createdAt DateTime @default(now()) @map("created_at")

  review    Review   @relation(fields: [reviewId], references: [id], onDelete: Cascade)
  user      Profile  @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([reviewId, userId])
  @@map("review_votes")
}

enum VoteType {
  USEFUL
  NOT_USEFUL
}
```

**Acceptance Criteria:**
- [ ] ReviewVote model created
- [ ] VoteType enum defined
- [ ] Unique constraint on reviewId+userId
- [ ] Migration created

**Estimated Time:** 1 hour

---

#### Task 2.3: Create ReviewReport Model

**Business Objective:**
Allow users to report inappropriate reviews.

**Technical Scope:**
Update `prisma/schema.prisma`:

```prisma
model ReviewReport {
  id          String       @id @default(cuid())
  reviewId    String       @map("review_id")
  reportedBy  String       @map("reported_by")
  reason      String       @db.Text
  status      ReportStatus @default(PENDING)
  createdAt   DateTime     @default(now()) @map("created_at")

  review      Review       @relation(fields: [reviewId], references: [id], onDelete: Cascade)
  reporter    Profile      @relation(fields: [reportedBy], references: [id], onDelete: Cascade)

  @@map("review_reports")
}

enum ReportStatus {
  PENDING
  REVIEWED
  RESOLVED
}
```

**Acceptance Criteria:**
- [ ] ReviewReport model created
- [ ] ReportStatus enum defined
- [ ] Relations configured
- [ ] Migration created

**Estimated Time:** 1 hour

---

#### Task 2.4: Update Review Model

**Business Objective:**
Link reviews to authenticated users while maintaining anonymity.

**Technical Scope:**
Update `prisma/schema.prisma`:

```prisma
model Review {
  id             Int      @id @default(autoincrement())
  userId         String?  @map("user_id")
  factoryId      Int?     @map("factory_id")
  organizationId Int?     @map("organization_id")
  workerRole     String   @map("worker_role") @db.VarChar(255)
  countryFrom    String   @map("country_from") @db.VarChar(100)
  ratingSalary   Int      @map("rating_salary")
  ratingOt       Int      @map("rating_ot")
  ratingHousing  Int      @map("rating_housing")
  reviewText     String   @map("review_text") @db.Text
  createdAt      DateTime @default(now()) @map("created_at")

  user           Profile? @relation(fields: [userId], references: [id], onDelete: SetNull)
  factory        Factory? @relation(fields: [factoryId], references: [id], onDelete: Cascade)
  organization   SuggestedOrganization? @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  votes          ReviewVote[]
  reports        ReviewReport[]

  @@index([factoryId])
  @@index([organizationId])
  @@index([userId])
  @@map("reviews")
}
```

**Acceptance Criteria:**
- [ ] userId field added
- [ ] Relations updated
- [ ] Indexes added
- [ ] Migration created

**Estimated Time:** 1 hour

---

#### Task 2.5: Apply Migrations

**Business Objective:**
Apply all database changes.

**Technical Scope:**
```bash
npx prisma migrate dev --name add-auth-models
npx prisma generate
```

**Acceptance Criteria:**
- [ ] Migrations applied
- [ ] Prisma client generated
- [ ] Database schema valid

**Estimated Time:** 0.5 hours

---

### Phase 3: Authentication APIs (Days 3-5)

#### Task 3.1: Create Registration API

**Business Objective:**
Allow users to create accounts.

**Technical Scope:**
Create `app/api/auth/register/route.ts`:

- Validate input with Zod
- Check email uniqueness
- Hash password with bcryptjs
- Create Profile record
- Return success response

**Acceptance Criteria:**
- [ ] Input validation working
- [ ] Email uniqueness enforced
- [ ] Password hashed
- [ ] User created in database
- [ ] Success response returned

**Estimated Time:** 3 hours

---

#### Task 3.2: Create Login API

**Business Objective:**
Allow users to authenticate.

**Technical Scope:**
Configure Auth.js in `lib/auth.ts`:

- Configure credentials provider
- Verify email and password
- Create JWT token
- Return session

**Acceptance Criteria:**
- [ ] Credentials provider configured
- [ ] Password verification working
- [ ] JWT token created
- [ ] Session established

**Estimated Time:** 2 hours

---

#### Task 3.3: Create Session API

**Business Objective:**
Return current user session.

**Technical Scope:**
Configure Auth.js session:

- Include user ID in JWT
- Include user role in session
- Expose session to client

**Acceptance Criteria:**
- [ ] Session includes user ID
- [ ] Session includes user role
- [ ] Session accessible via useSession()

**Estimated Time:** 1 hour

---

### Phase 4: Authentication Pages (Days 5-7)

#### Task 4.1: Create Registration Page

**Business Objective:**
Allow users to register via web interface.

**Technical Scope:**
Create `app/register/page.tsx`:

- Registration form with email, password, display name
- Client-side validation with Zod
- Submit to /api/auth/register
- Redirect to login on success
- Error handling

**Acceptance Criteria:**
- [ ] Form displays correctly
- [ ] Validation works
- [ ] Submission works
- [ ] Redirect works
- [ ] Errors display

**Estimated Time:** 3 hours

---

#### Task 4.2: Create Login Page

**Business Objective:**
Allow users to login via web interface.

**Technical Scope:**
Create `app/login/page.tsx`:

- Login form with email and password
- Submit to Auth.js signIn()
- Redirect to home on success
- Error handling

**Acceptance Criteria:**
- [ ] Form displays correctly
- [ ] Login works
- [ ] Redirect works
- [ ] Errors display

**Estimated Time:** 2 hours

---

#### Task 4.3: Create Auth Middleware

**Business Objective:**
Protect authenticated routes.

**Technical Scope:**
Create `middleware.ts`:

- Check session for protected routes
- Redirect to login if unauthenticated
- Allow public routes

**Protected Routes:**
- `/review/*` — Review submission
- `/profile/*` — User profile

**Public Routes:**
- `/` — Home
- `/factories/*` — Company pages
- `/api/factories/*` — Public API

**Acceptance Criteria:**
- [ ] Middleware configured
- [ ] Protected routes working
- [ ] Public routes working
- [ ] Redirects working

**Estimated Time:** 2 hours

---

### Phase 5: Company Pages (Days 7-9)

#### Task 5.1: Create Company Search Page

**Business Objective:**
Allow users to search for companies.

**Technical Scope:**
Create `app/factories/page.tsx`:

- Search bar component
- Filter by province, district, region
- Company card list
- Pagination
- Loading states

**Acceptance Criteria:**
- [ ] Search works
- [ ] Filters work
- [ ] Results display
- [ ] Pagination works
- [ ] Loading states display

**Estimated Time:** 4 hours

---

#### Task 5.2: Create Company Detail Page

**Business Objective:**
Display complete company information.

**Technical Scope:**
Create `app/factories/[id]/page.tsx`:

- Company information display
- Location details
- Worker count
- Rating summary
- Review list
- Link to submit review

**Acceptance Criteria:**
- [ ] Company info displays
- [ ] Location shows
- [ ] Worker count shows
- [ ] Rating summary shows
- [ ] Review list displays

**Estimated Time:** 3 hours

---

### Phase 6: Review System (Days 9-12)

#### Task 6.1: Create Review Form

**Business Objective:**
Allow authenticated users to submit reviews.

**Technical Scope:**
Create `src/components/ReviewForm.tsx`:

- Worker role input
- Country input
- Rating inputs (salary, OT, housing)
- Review text textarea
- Client-side validation
- Submit to API

**Acceptance Criteria:**
- [ ] Form displays
- [ ] Validation works
- [ ] Submission works
- [ ] Success feedback shows
- [ ] Errors display

**Estimated Time:** 4 hours

---

#### Task 6.2: Create Review Page

**Business Objective:**
Provide dedicated page for review submission.

**Technical Scope:**
Create `app/factories/[id]/review/page.tsx`:

- Authentication check
- Company info display
- Review form
- Success redirect

**Acceptance Criteria:**
- [ ] Auth check working
- [ ] Company info shows
- [ ] Form works
- [ ] Redirect works

**Estimated Time:** 2 hours

---

#### Task 6.3: Create Review Display Components

**Business Objective:**
Display reviews with ratings and voting.

**Technical Scope:**
Create `src/components/ReviewCard.tsx`:

- Review text display
- Rating stars
- Worker role and country
- Vote buttons
- Vote counts

**Acceptance Criteria:**
- [ ] Review displays
- [ ] Ratings show
- [ ] Vote buttons work
- [ ] Vote counts show

**Estimated Time:** 3 hours

---

#### Task 6.4: Create Voting API

**Business Objective:**
Allow users to vote on reviews.

**Technical Scope:**
Create `app/api/reviews/[id]/vote/route.ts`:

- Validate vote input
- Check authentication
- Check one vote per user
- Create or update vote
- Return vote counts

**Acceptance Criteria:**
- [ ] Validation working
- [ ] Auth check working
- [ ] One vote enforced
- [ ] Vote created
- [ ] Counts returned

**Estimated Time:** 3 hours

---

### Phase 7: Testing (Days 12-14)

#### Task 7.1: Install Vitest

**Business Objective:**
Enable unit testing.

**Technical Scope:**
```bash
npm install -D vitest @vitejs/plugin-react
```

Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts'
  }
})
```

**Acceptance Criteria:**
- [ ] Vitest installed
- [ ] Config created
- [ ] Setup file created
- [ ] Test command works

**Estimated Time:** 1 hour

---

#### Task 7.2: Install Playwright

**Business Objective:**
Enable E2E testing.

**Technical Scope:**
```bash
npm install -D @playwright/test
npx playwright install chromium
```

Create `playwright.config.ts`:
```typescript
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3000'
  }
})
```

**Acceptance Criteria:**
- [ ] Playwright installed
- [ ] Chromium installed
- [ ] Config created
- [ ] Test command works

**Estimated Time:** 1 hour

---

#### Task 7.3: Write Unit Tests

**Business Objective:**
Test business logic functions.

**Test Coverage:**
- Validation schemas
- Password hashing
- Review creation logic
- Vote logic

**Acceptance Criteria:**
- [ ] Validation tests pass
- [ ] Password tests pass
- [ ] Review tests pass
- [ ] Vote tests pass

**Estimated Time:** 4 hours

---

#### Task 7.4: Write E2E Tests

**Business Objective:**
Test critical user journeys.

**Test Scenarios:**
1. User can register
2. User can login
3. User can search companies
4. User can view company detail
5. User can submit review
6. User can vote on review

**Acceptance Criteria:**
- [ ] Registration flow tested
- [ ] Login flow tested
- [ ] Search flow tested
- [ ] Review flow tested
- [ ] Voting flow tested

**Estimated Time:** 4 hours

---

#### Task 7.5: Ensure Build, Lint, and Tests Pass

**Business Objective:**
Verify all quality gates pass.

**Technical Scope:**
```bash
npm run build
npm run lint
npm run test
npx playwright test
```

**Acceptance Criteria:**
- [ ] Build succeeds
- [ ] Lint passes
- [ ] Unit tests pass
- [ ] E2E tests pass

**Estimated Time:** 2 hours

---

## Sprint 1 Summary

### Tasks by Phase

| Phase | Tasks | Hours | Days |
|-------|-------|-------|------|
| 1. Foundation | 1.1, 1.2, 1.3 | 5h | 0.5 |
| 2. Database | 2.1, 2.2, 2.3, 2.4, 2.5 | 4.5h | 0.5 |
| 3. Auth APIs | 3.1, 3.2, 3.3 | 6h | 1 |
| 4. Auth Pages | 4.1, 4.2, 4.3 | 7h | 1 |
| 5. Company Pages | 5.1, 5.2 | 7h | 1 |
| 6. Review System | 6.1, 6.2, 6.3, 6.4 | 12h | 1.5 |
| 7. Testing | 7.1, 7.2, 7.3, 7.4, 7.5 | 12h | 1.5 |
| **Total** | | **53.5h** | **7 days** |

### Team Assignments

| Role | Tasks | Hours |
|------|-------|-------|
| Backend Engineer | 1.1, 1.2, 2.1-2.5, 3.1-3.3, 6.4 | 20h |
| Frontend Engineer | 4.1, 4.2, 5.1, 5.2, 6.1, 6.2, 6.3 | 22h |
| Full Stack Engineer | 1.3, 4.3, 7.1-7.5 | 11.5h |

### Dependencies

| Task | Depends On |
|------|------------|
| 3.1 Registration API | 1.1, 1.2, 2.1 |
| 3.2 Login API | 1.1, 2.1 |
| 4.1 Registration Page | 3.1 |
| 4.2 Login Page | 3.2 |
| 4.3 Auth Middleware | 3.3 |
| 6.1 Review Form | 1.3, 2.4 |
| 6.4 Voting API | 2.2 |

---

## Sprint 1 Definition of Done

### Feature Complete
- [ ] All 12 tasks implemented
- [ ] All acceptance criteria met
- [ ] All definition of done items completed

### Quality
- [ ] TypeScript strict mode passes
- [ ] ESLint passes
- [ ] Build succeeds
- [ ] No console.log in production code
- [ ] All tests pass

### Documentation
- [ ] CLAUDE.md updated
- [ ] API endpoints documented
- [ ] Security reviewed

### Deployment
- [ ] Docker Compose works
- [ ] Database migrations applied
- [ ] Environment variables documented

---

## Sprint 1 Success Criteria

The sprint is successful when:
1. A worker can register an account
2. A worker can login
3. A worker can search for factories
4. A worker can view company details
5. A worker can read anonymous reviews
6. A worker can submit an anonymous review
7. A worker can vote on review helpfulness
8. All tests pass
9. Build succeeds

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Auth.js complexity | Use Prisma adapter |
| Zod validation overhead | Create reusable schemas |
| Testing setup time | Start with unit tests |
| Build failures | Incremental implementation |

---

**Document Version**: 1.0.0
**Created**: 2026-07-07
**Status**: Approved
