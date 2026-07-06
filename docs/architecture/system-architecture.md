02 - System Architecture

Project Name: WorkerVoice – Migrant Review Platform
Document Version: 1.0.0
Status: Draft
Owner: Solution Architecture Team
Last Updated: 2026-07-07

⸻

1. Purpose

This document defines the overall technical architecture of the WorkerVoice platform.

It describes how each system component interacts, the technologies used, development environments, deployment architecture, and scalability considerations.

This document should be referenced before implementing any new feature.

⸻

2. Architecture Principles

The platform follows these engineering principles:

* Modular architecture
* API-first design
* Separation of concerns
* Reusable components
* Secure by default
* Database migration driven
* Infrastructure as Code where practical
* Small, incremental feature delivery

⸻

3. High-Level Architecture

                    Users
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
 Telegram Bot                  Web Browser
        │                             │
        └──────────────┬──────────────┘
                       │
                       ▼
              Next.js Application
      (App Router + Route Handlers)
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
 Authentication     Business      API Routes
                    Services
                       │
                       ▼
                    Prisma ORM
                       │
                       ▼
                  PostgreSQL

⸻

4. System Components

Telegram Bot

Responsibilities:

* Search companies
* Search agencies
* Display summary information
* Display average ratings
* Redirect users to the website

The Telegram Bot does not manage authentication or review moderation.

⸻

Web Application

Responsibilities:

* Company pages
* Agency pages
* Authentication
* User profiles
* Review management
* Admin dashboard
* Information center

Technology:

* Next.js App Router
* React
* TypeScript
* Tailwind CSS

⸻

API Layer

Responsibilities:

* Validate requests
* Execute business logic
* Return JSON responses
* Protect private endpoints

API design follows REST conventions.

⸻

Business Layer

Contains reusable application logic.

Examples:

* Company search
* Review submission
* Review moderation
* Rating calculation
* Statistics

Business logic should not be placed inside UI components.

⸻

Database Layer

Database responsibilities:

* Store companies
* Store agencies
* Store users
* Store reviews
* Store votes
* Store moderation records

Technology:

* PostgreSQL
* Prisma ORM

⸻

5. Technology Stack

> **Sprint 1 Baseline** — Post-Sprint 1 migration targets documented in `docs/engineering/technology-decision-record.md`.

Frontend

Technology	Purpose	Version	Status
Next.js	Web framework	14.2.35	⚠ Maintenance mode (target: 16.2.10)
React	UI	18.3.1	⚠ Supported, legacy (target: 19.2.7)
TypeScript	Type safety	5.9.3	✅ Latest stable 5.x
Tailwind CSS	Styling	3.4.19	✅ Latest stable 3.x (target: 4.3.2 Sprint 3)
shadcn/ui	UI components	Planned	—

⸻

Backend

Technology	Purpose	Version	Status
Next.js Route Handlers	API layer	14.2.35	⚠ Maintenance mode
TypeScript	Business logic	5.9.3	✅ Latest stable 5.x
Prisma	ORM	5.22.0	⚠ Maintenance mode (target: 7.8.0)

⸻

Database

Technology	Purpose	Version	Status
PostgreSQL	Primary database	16	✅ LTS (supported until November 2028)
Prisma Migrate	Schema migrations	5.22.0	⚠ Maintenance mode

⸻

Development Tools

Tool	Purpose	Version	Status
Node.js	Runtime	24.16.0	✅ Active LTS
npm	Package manager	11.13.0	✅ Latest stable
Docker	Containerization	29.0.1	✅ Latest stable
Docker Compose	Local development	2.40.3	✅ Latest stable
Git	Version control	2.54.0	✅ Latest stable
ESLint	Linting	8.57.1	❌ EOL since October 2023
Prettier	Formatting	3.9.4	✅ Latest stable
Husky	Git hooks	9.1.7	✅ Latest stable
lint-staged	Pre-commit linting	17.0.8	✅ Latest stable
Vitest	Unit testing	4.1.10	✅ Latest stable
Playwright	E2E testing	1.61.1	✅ Latest stable
GitHub	Source control	—	—
Claude Code	AI development assistant	—	—
VS Code	IDE	—	—

---

## Official Baseline

This technology stack is the official baseline for Sprint 1. See `docs/engineering/technology-stack-policy.md` for complete version management policy. See `docs/engineering/technology-decision-record.md` for the full audit report.

## Upgrade Policy

| Upgrade Type | Policy |
|--------------|--------|
| Patch versions | Auto-update during development |
| Minor versions | Review and update quarterly |
| Major versions | Plan and execute post-MVP |

## Node.js Requirement

- **Minimum:** Node.js 18.17.0
- **Recommended:** Node.js 22 LTS or newer
- **Current:** Node.js 24.16.0

## Security Support

All current versions receive active security support. No known vulnerabilities in current stack.

⸻

6. Directory Structure

migrant-review-platform/
app/
  api/
  (routes)
src/
  components/
  features/
  hooks/
  lib/
  services/
  types/
prisma/
  migrations/
  schema.prisma
docs/
scripts/
public/
.github/
.claude/

⸻

7. Feature-Based Organization

Each feature should contain its own UI, business logic, and types whenever appropriate.

Example:

src/features/company/
components/
hooks/
services/
types/

This keeps the project modular and easier to maintain.

⸻

8. Application Layers

Presentation Layer
        │
Business Layer
        │
Data Access Layer
        │
Database

Presentation Layer

Responsible for:

* Pages
* Components
* Forms
* User interaction

⸻

Business Layer

Responsible for:

* Validation
* Business rules
* Application logic

⸻

Data Layer

Responsible for:

* Prisma queries
* Transactions
* Repository functions

⸻

9. Database Strategy

Development

* Local PostgreSQL
* Docker Compose

Shared Development

* Managed PostgreSQL

Production

* PostgreSQL (Supabase or AWS RDS)

Database schema changes must always be applied through Prisma migrations.

Manual schema changes are not allowed.

⸻

10. Authentication Architecture

Version 1

* Email registration
* Email verification
* Login
* Password reset

Future versions may support:

* Google Login
* Apple Login
* Telegram Login

⸻

11. File Storage

Version 1

Files to store:

* Company logos
* Images
* Documents

Future storage options:

* Supabase Storage
* Amazon S3

⸻

12. External Integrations

Current

* Telegram Bot

Future

* Google Maps
* Email provider
* Analytics platform

⸻

13. Deployment Architecture

Development

Developer

↓

Docker Compose

↓

Local PostgreSQL

↓

Next.js

⸻

Staging

GitHub

↓

CI

↓

Preview Deployment

↓

Shared Database

⸻

Production

Users

↓

HTTPS

↓

Next.js

↓

Prisma

↓

PostgreSQL

⸻

14. Scalability Strategy

The architecture should support:

* Multiple countries
* Millions of reviews
* Thousands of concurrent users
* Mobile applications
* Additional languages

⸻

15. Logging Strategy

The application should log:

* Authentication events
* API errors
* Database failures
* Review submissions
* Admin actions

Sensitive information must never be written to logs.

⸻

16. Monitoring

Production monitoring should include:

* Application health
* Database performance
* Error rates
* Response times
* Deployment status

⸻

17. Security Architecture

Security controls include:

* HTTPS
* Input validation
* Parameterized database queries
* Authentication
* Authorization
* Rate limiting
* Secure environment variables

Detailed implementation is documented in 07-security.md.

⸻

18. Future Architecture

Future versions may introduce:

* Background job processing
* Caching layer
* Search engine
* CDN
* Mobile API
* Microservices (only if justified by scale)

⸻

19. Architecture Decisions

Major technical decisions are documented in:

docs/adr/

Every architectural change should have an accompanying ADR.

⸻

20. References

* 00-project-overview.md
* 01-product-requirements.md
* 03-database-design.md
* 04-api-specification.md
* 07-security.md
* 08-deployment.md

⸻

21. Change History

Version	Date	Author	Description
1.0.0	2026-07-07	Solution Architecture Team	Initial system architecture document