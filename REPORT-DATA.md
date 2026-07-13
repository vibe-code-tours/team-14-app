# WorkerVoice — Project Report Data

> Auto-generated data export for demo report and presentation.

---

## Project Overview

| Field | Value |
|-------|-------|
| **Project Name** | WorkerVoice (Migrant Review Platform) |
| **Version** | 0.1.0 |
| **Repository** | team-14-app |
| **First Commit** | 2026-07-09 |
| **Status** | Active development |

---

## Team & Contributors (6 members)

| Contributor | Git Aliases | Commits |
|-------------|-------------|---------|
| Aung Kyaw Myint | aungyephyo2215, Aung Kyaw Myint | 24 |
| NanAungOo | nanaungoo, NanAungOo | 19 |
| Zin Mar | Zin Mar | 19 |
| Kay Khaing Myint | Kay Khaing Myint | 14 |
| Htet Aung Kyaw | Htet Aung Kyaw | 12 |
| dependabot[bot] | dependabot[bot] | 10 |
| **Total (humans)** | | **88** |
| **Total (all)** | | **98** |

---

## Codebase Statistics

| Metric | Count |
|--------|-------|
| Total commits | 98 |
| Source files (.ts/.tsx) | 125 |
| Lines of code | 11,145 |
| React components | 36 |
| Pages (routes) | 27 |
| API endpoints | 36 |
| Prisma models | 9 |
| Dependencies | 12 |
| Dev dependencies | 20 |
| Active branches | 4 (main, dev, live, feature/generatedata) |

---

## Tech Stack

### Frontend
- **Framework:** Next.js 16.2.10 (App Router)
- **UI Library:** React 19.2.7
- **Language:** TypeScript 5.9.3
- **Styling:** Tailwind CSS 4.3.2

### Backend
- **API:** Next.js Route Handlers
- **ORM:** Prisma 7.8.0
- **Auth:** Auth.js (NextAuth) with Prisma Adapter
- **Email:** Resend
- **Validation:** Zod
- **Password Hashing:** bcryptjs
- **JWT:** jose

### Database
- **Engine:** PostgreSQL 16
- **ORM:** Prisma

### Development
- **Runtime:** Node.js 24.16.0
- **Package Manager:** npm 11.13.0
- **Linting:** ESLint 9.39.4
- **Formatting:** Prettier 3.9.4
- **Git Hooks:** Husky 9.1.7 + lint-staged 17.0.8

### Testing
- **Unit Tests:** Vitest 4.1.10
- **E2E Tests:** Playwright 1.61.1

### Deployment
- **Platform:** Vercel
- **Database:** Supabase

---

## Database Schema (9 Models)

| Model | Purpose |
|-------|---------|
| **User** | Registered platform users with roles (user/moderator/administrator) |
| **Account** | Auth.js OAuth adapter accounts |
| **Session** | Active user sessions |
| **VerificationToken** | Email verification tokens |
| **PasswordResetToken** | Password reset flow tokens |
| **RateLimit** | API rate limiting |
| **SuggestedOrganization** | User-submitted factory/agency suggestions |
| **Factory** | Factory and company listings |
| **Review** | Anonymous worker reviews |

### Key Enums
- **OrganizationType:** factory, agency
- **UserRole:** user, moderator, administrator
- **UserStatus:** active, blocked
- **FactoryStatus:** pending, approved, declined
- **SuggestionStatus:** pending, approved, rejected

---

## Application Pages (27 Routes)

### Public Pages
| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, stats, search |
| `/factories` | Factory listing with filters |
| `/factories/[id]` | Factory detail + reviews |
| `/factories/new` | Public factory submission form |
| `/agencies` | Agency listing |
| `/contact` | Contact page |

### Authentication
| Route | Description |
|-------|-------------|
| `/login` | User login |
| `/register` | User registration |
| `/verify-email` | Email verification |
| `/reset-password` | Password reset request |
| `/reset-password/[token]` | Password reset form |

### User Profile
| Route | Description |
|-------|-------------|
| `/profile` | User profile page |
| `/profile/change-password` | Change password |

### Admin Portal (12 pages)
| Route | Description |
|-------|-------------|
| `/admin/login` | Admin login |
| `/admin/dashboard` | Admin dashboard with stats |
| `/admin/factories` | Factory management |
| `/admin/factories/new` | Create factory |
| `/admin/factories/[id]/view` | View factory |
| `/admin/factories/[id]/edit` | Edit factory |
| `/admin/users` | User management |
| `/admin/users/[id]/view` | View user |
| `/admin/admins` | Admin management |
| `/admin/admins/[id]/view` | View admin |
| `/admin/reviews` | Review moderation |
| `/admin/profile` | Admin profile |
| `/admin/profile/password` | Admin password change |
| `/admin/change-password` | Change password |

---

## API Endpoints (36 Routes)

### Authentication API
- `POST /api/auth/register` — User registration
- `POST /api/auth/[...nextauth]` — Auth.js handlers
- `POST /api/auth/request-password-reset` — Request password reset
- `POST /api/auth/reset-password` — Reset password with token
- `POST /api/auth/verify-email` — Verify email address

### Public API
- `GET /api/factories` — List factories
- `GET /api/factories/[id]` — Get factory details
- `GET /api/factories/[id]/reviews` — Get factory reviews
- `POST /api/suggestions` — Submit factory/agency suggestion
- `GET /api/organizations` — List organizations
- `GET /api/regions` — List regions
- `GET /api/provinces` — List provinces
- `GET /api/provinces/[province]/districts` — List districts

### User Profile API
- `GET /api/profile` — Get user profile
- `PUT /api/profile` — Update profile
- `POST /api/profile/change-password` — Change password

### Admin API (18 endpoints)
- `POST /api/admin/auth/login` — Admin login
- `GET /api/admin/auth/session` — Get admin session
- `POST /api/admin/auth/signout` — Admin sign out
- `GET /api/admin/stats` — Dashboard statistics
- `GET/POST /api/admin/factories` — List/create factories
- `GET/PUT/DELETE /api/admin/factories/[id]` — Factory CRUD
- `PUT /api/admin/factories/[id]/status` — Update factory status
- `GET /api/admin/users` — List users
- `GET/PUT /api/admin/users/[id]` — User management
- `PUT /api/admin/users/[id]/status` — Block/unblock user
- `PUT /api/admin/users/[id]/admin` — Toggle admin role
- `PUT /api/admin/users/[id]/super-admin` — Toggle super admin
- `GET /api/admin/admins` — List admins
- `GET/PUT /api/admin/admins/[id]` — Admin management
- `GET /api/admin/reviews` — List reviews
- `PUT /api/admin/reviews/[id]/visibility` — Toggle review visibility
- `GET /api/admin/suggestions` — List suggestions
- `PUT /api/admin/suggestions/[id]/status` — Approve/reject suggestion
- `PUT /api/admin/profile` — Update admin profile
- `POST /api/admin/profile/password` — Change admin password
- `POST /api/admin/change-password` — Admin password change

---

## React Components (36)

### Core UI Components
- Button, Card, Input, Select, Badge, Tabs, StarRating

### Layout & Navigation
- Navbar, Footer, UserMenu, UserAvatar, LanguageSwitcher

### Feature Components
- LoginForm, RegisterForm, ResetPasswordForm, ChangePasswordForm
- FactoryFilters, ReviewModal, SuggestModal, PublicFactoryForm
- StatsBar, AboutUs, ContactLinks, PrivacyBanner

### Theme & Auth
- ThemeContext, ThemeToggle, SessionProvider
- UserAuthGuard, AdminAuthGuard, VerifyEmailStatus

### Admin Components
- AdminNavbar, AdminBackground, ConfirmModal
- FactoryForm, ReviewRow, StatsCard

---

## Features Implemented

### Core MVP Features
- Anonymous workplace reviews
- Factory listing with search and filters
- Agency listing
- User registration and authentication
- Email verification flow
- Password reset flow

### Admin Portal
- Admin dashboard with statistics
- Factory management (CRUD + approval workflow)
- User management (block/unblock, role assignment)
- Review moderation (visibility toggle)
- Suggestion management (approve/reject)
- Profile management
- Role-based access (user, moderator, administrator, super admin)

### UI/UX
- Responsive design (mobile-first)
- Dark mode support
- Multi-language support (localization)
- Star rating system
- Privacy banner
- Public factory submission form

### Security
- Auth.js integration with Prisma adapter
- Password hashing (bcryptjs)
- Rate limiting
- Input validation (Zod)
- CSRF protection
- Admin route protection

---

## Deployment Info

| Platform | URL |
|----------|-----|
| **Production** | Vercel (live branch) |
| **Database** | Supabase (PostgreSQL) |
| **Preview** | Vercel preview deployments |

---

## Key Metrics for Demo

- **Development time:** 4 days (July 9-12, 2026)
- **Team size:** 7 contributors
- **Velocity:** ~25 commits/day average
- **Code quality:** ESLint + Prettier + Husky pre-commit hooks
- **Test coverage:** Vitest (unit) + Playwright (E2E)
- **Pages built:** 27 routes
  - **API endpoints:** 36 routes
- **Components:** 36 reusable React components
- **Database models:** 9 with full CRUD operations

---

*Generated: 2026-07-13*
