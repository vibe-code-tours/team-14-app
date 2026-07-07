05 - Development Guide

Project Name: WorkerVoice – Migrant Review Platform
Document Version: 1.0.0
Status: Approved
Owner: Engineering Team
Last Updated: 2026-07-07

⸻

1. Purpose

This guide explains how to set up, develop, test, and contribute to the WorkerVoice project.

Every developer should complete this guide before implementing any feature.

⸻

2. Development Principles

The project follows these principles:

* Build small, incremental features.
* Keep the codebase clean and maintainable.
* Follow documented coding standards.
* Every feature requires documentation.
* Every database change requires a migration.
* Every Pull Request must be reviewed.

⸻

3. Required Software

Install the following software before starting development.

Software	Recommended Version
Node.js	Latest LTS
npm	Latest
Git	Latest
Docker Desktop	Latest
PostgreSQL	Docker Container
VS Code	Latest
Claude Code	Latest
Prisma CLI	Latest

Verify installation:

node -v
npm -v
git --version
docker --version

⸻

4. Clone Repository

git clone <repository-url>
cd migrant-review-platform

⸻

5. Install Dependencies

npm install

Never use:

npm audit fix --force

without team approval.

⸻

6. Environment Variables

Create a local environment file.

.env

Example

DATABASE_URL="postgresql://postgres:password@localhost:5432/workervoice"
NEXTAUTH_SECRET=change_me
NEXTAUTH_URL=http://localhost:3000

Never commit:

* .env
* API Keys
* Passwords
* Secrets

⸻

7. Start PostgreSQL

docker compose up -d

Verify

docker ps

⸻

8. Prisma

Generate Prisma Client

npx prisma generate

Create Migration

npx prisma migrate dev

Open Database Studio

npx prisma studio

Reset Development Database

npx prisma migrate reset

⸻

9. Start Development Server

npm run dev

Open

http://localhost:3000

⸻

10. Git Workflow

The project uses Git Flow.

Branches

main
develop
feature/*
bugfix/*
release/*
hotfix/*

Never commit directly to:

* main
* develop

⸻

11. Feature Development Workflow

Every feature follows the same lifecycle.

1. Create GitHub Issue.
2. Discuss requirements.
3. Create feature branch.
4. Implement feature.
5. Test locally.
6. Open Pull Request.
7. Code Review.
8. Merge into develop.

⸻

12. Branch Naming Convention

Examples

feature/company-search
feature/review-system
feature/login
feature/admin-dashboard
bugfix/review-pagination
hotfix/login-error

⸻

13. Commit Message Convention

Use Conventional Commits.

Examples

feat: add company search
feat: implement review voting
fix: resolve pagination bug
refactor: improve API structure
docs: update development guide
test: add company API tests
chore: update dependencies

⸻

14. Pull Request Checklist

Before opening a Pull Request:

* Code builds successfully.
* Lint passes.
* No TypeScript errors.
* Database migrations included (if required).
* Documentation updated.
* Tests added or updated.
* Screenshots attached for UI changes.

⸻

15. Local Testing

Before pushing code, run:

npm run lint
npm run build

When tests are available:

npm test

⸻

16. Database Rules

Developers must:

* Use Prisma for all database access.
* Never edit production data directly.
* Never modify migration history.
* Never bypass migrations.

⸻

17. API Development Rules

All new APIs must:

* Validate input.
* Return consistent response format.
* Handle errors gracefully.
* Include authentication where required.
* Be documented in 04-api-specification.md.

⸻

18. Frontend Development Rules

Frontend developers should:

* Use reusable components.
* Avoid duplicated UI code.
* Use TypeScript interfaces.
* Keep components focused on a single responsibility.
* Consume APIs through service functions instead of embedding fetch logic in page components.

⸻

19. Backend Development Rules

Backend developers should:

* Keep business logic out of route handlers.
* Use service functions for application logic.
* Use Prisma transactions when needed.
* Log unexpected errors.

⸻

20. Claude Code Workflow

Claude Code is used as an engineering assistant.

Recommended workflow:

1. Read the relevant documentation.
2. Plan the feature.
3. Review the implementation plan.
4. Generate code.
5. Developer reviews generated code.
6. Test locally.
7. Commit after verification.

Claude Code should assist development, but all generated code must be reviewed by a human developer before merging.

⸻

21. Code Review Guidelines

Reviewers should verify:

* Correctness
* Readability
* Performance
* Security
* Error handling
* Documentation updates
* Test coverage

⸻

22. Documentation Rules

Whenever a feature changes:

Update the appropriate document.

Examples:

* New API → 04-api-specification.md
* Database changes → 03-database-design.md
* Security changes → 07-security.md

Documentation is part of the feature and should be updated before merging.

⸻

23. Common Commands

Install dependencies

npm install

Start development

npm run dev

Build

npm run build

Lint

npm run lint

Start Docker

docker compose up -d

Open Prisma Studio

npx prisma studio

Create migration

npx prisma migrate dev

Generate Prisma Client

npx prisma generate

⸻

24. Troubleshooting

Common issues:

Docker not running

Start Docker Desktop before running docker compose.

Database connection failed

Verify:

* Docker container is running.
* DATABASE_URL is correct.

Prisma Client out of date

Run:

npx prisma generate

Build errors

Run:

npm install
npm run build

⸻

25. References

* 00-project-overview.md
* 01-product-requirements.md
* 02-system-architecture.md
* 03-database-design.md
* 04-api-specification.md
* 06-coding-standards.md

⸻

26. Change History

Version	Date	Author	Description
1.0.0	2026-07-07	Engineering Team	Initial development guide