08 - Deployment Guide

Project Name: WorkerVoice – Migrant Review Platform
Document Version: 1.0.0
Status: Approved
Owner: DevOps Team
Last Updated: 2026-07-07

⸻

1. Purpose

This document defines the deployment strategy for the WorkerVoice platform.

It covers:

* Local development
* Shared development environment
* Staging
* Production
* Continuous Integration (CI)
* Continuous Deployment (CD)
* Backup
* Monitoring
* Rollback

⸻

2. Deployment Principles

The deployment process follows these principles:

* Automated deployments
* Infrastructure consistency
* Zero manual database changes
* Repeatable deployments
* Environment isolation
* Rollback capability
* Continuous monitoring

⸻

3. Deployment Environments

Local

Purpose

Developer environment.

Components

* Next.js
* Docker Compose
* PostgreSQL
* Prisma

Used for:

* Development
* Local testing
* Feature implementation

⸻

Development

Purpose

Shared environment for the engineering team.

Components

* Preview deployment
* Shared PostgreSQL
* Shared authentication

Used for:

* Feature integration
* QA verification

⸻

Staging

Purpose

Pre-production validation.

The staging environment should closely match production.

Used for:

* User acceptance testing
* Regression testing
* Performance validation
* Deployment verification

⸻

Production

Purpose

Public user access.

Requirements

* HTTPS
* Automated backups
* Monitoring
* Logging
* Alerting

⸻

4. Infrastructure Overview

Users
      │
      ▼
HTTPS
      │
      ▼
Next.js Application
      │
      ▼
Prisma ORM
      │
      ▼
PostgreSQL Database

Future additions may include:

* CDN
* Object Storage
* Search Service
* Background Workers

⸻

5. Technology Stack

Application

* Next.js
* React
* TypeScript

Backend

* Route Handlers
* Prisma ORM

Database

* PostgreSQL

Containerization

* Docker
* Docker Compose

Version Control

* GitHub

AI Development

* Claude Code

⸻

6. Local Deployment

Install Dependencies

npm install

⸻

Start Database

docker compose up -d

⸻

Generate Prisma Client

npx prisma generate

⸻

Apply Migrations

npx prisma migrate dev

⸻

Start Development Server

npm run dev

Open:

http://localhost:3000

⸻

7. Environment Variables

Environment-specific configuration must be stored in environment variables.

Examples:

DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=

Rules:

* Never commit secrets.
* Rotate compromised credentials immediately.
* Use different credentials for each environment.

⸻

8. Branch Strategy

main
develop
feature/*
bugfix/*
release/*
hotfix/*

Deployment targets:

Branch	Environment
feature/*	Local
develop	Development
release/*	Staging
main	Production

⸻

9. Continuous Integration (CI)

Every Pull Request should automatically:

1. Install dependencies.
2. Run lint checks.
3. Run TypeScript checks.
4. Run tests.
5. Build the application.

Merge only after all checks pass.

⸻

10. Continuous Deployment (CD)

Deployment flow:

Developer
      │
      ▼
GitHub Feature Branch
      │
      ▼
Pull Request
      │
      ▼
Code Review
      │
      ▼
Merge into develop
      │
      ▼
Development Deployment
      │
      ▼
QA Testing
      │
      ▼
Release Branch
      │
      ▼
Staging Deployment
      │
      ▼
Production Approval
      │
      ▼
Merge into main
      │
      ▼
Production Deployment

⸻

11. Database Deployment

Rules:

* Use Prisma migrations only.
* Never modify production schema manually.
* Review migrations before deployment.
* Backup production before applying migrations.

Deployment steps:

1. Backup database.
2. Apply migration.
3. Verify schema.
4. Verify application.

⸻

12. Backup Strategy

Development

* Manual backup before major changes.

Production

* Daily automated backups.
* Retention policy according to business requirements.
* Periodic restore testing.

⸻

13. Monitoring

Production monitoring should include:

* Application uptime
* Response time
* Error rate
* Database health
* Storage usage
* CPU and memory utilization

Future tools may include:

* Grafana
* Prometheus
* OpenTelemetry

⸻

14. Logging

The application should log:

* Application errors
* API requests (excluding sensitive data)
* Authentication events
* Deployment events
* Administrator actions

Logs should never contain:

* Passwords
* Access tokens
* Personal information

⸻

15. Rollback Strategy

If a deployment fails:

1. Stop further deployments.
2. Identify the issue.
3. Restore the previous application version.
4. Restore the database only if required and safe.
5. Verify application health.
6. Document the incident.

⸻

16. Disaster Recovery

Recovery priorities:

1. Restore database.
2. Restore application.
3. Verify authentication.
4. Verify APIs.
5. Verify user access.

Recovery procedures should be tested periodically.

⸻

17. Deployment Checklist

Before deployment:

* All tests pass.
* Build succeeds.
* Documentation updated.
* Database migration reviewed.
* Environment variables verified.
* Backup completed.
* Monitoring enabled.

After deployment:

* Application accessible.
* APIs responding.
* Database healthy.
* Authentication working.
* Review submission verified.
* Telegram Bot integration verified.

⸻

18. Future Deployment Enhancements

Future improvements may include:

* Infrastructure as Code
* Automated security scanning
* Blue-Green deployment
* Canary deployment
* Kubernetes
* Multi-region deployment

⸻

19. References

* 02-system-architecture.md
* 03-database-design.md
* 05-development-guide.md
* 07-security.md
* 09-testing-strategy.md

⸻

20. Change History

Version	Date	Author	Description
1.0.0	2026-07-07	DevOps Team	Initial deployment guide
1.1.0	2026-07-12	DevOps Team	Add Cloudflare Workers deployment
1.2.0	2026-07-12	DevOps Team	Neon PostgreSQL serverless adapter setup

---

21. Cloudflare Workers Deployment

Overview

WorkerVoice deploys to Cloudflare Workers using the OpenNext adapter with
Neon PostgreSQL as the serverless database.

Architecture

    Cloudflare Workers (OpenNext)
    ├── Edge Middleware (auth, redirects)
    ├── Next.js Server Components
    ├── API Routes (Node.js runtime via nodejs_compat)
    ├── Prisma Client (Edge HTTP adapter → Neon)
    └── Neon PostgreSQL (HTTP, no TCP)

Local Docker development continues to use PostgreSQL 16 via Docker Compose.

---

22. Neon PostgreSQL Setup

Free Tier Limits

* Storage: 512 MB
* Compute: ~191.9 hours/month
* Connections: ~100 concurrent (HTTP adapter avoids persistent connections)

Create a Neon Project

    1. Sign up at https://neon.tech
    2. Create a new project (PostgreSQL 16)
    3. Copy the connection string from the Neon dashboard:
       postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
    4. Run Prisma migrations against Neon:

       npx prisma migrate deploy --schema=prisma/schema.prisma

    5. Seed the database (optional):

       npx prisma db execute --file prisma/seed/factories_bangkok.sql

The HTTP adapter (`@prisma/adapter-neon`) is used automatically on Cloudflare.
No persistent connections are needed — each Prisma query is a single HTTP request.

---

23. Local Wrangler Preview

Prerequisites

* Neon database URL (or any cloud PostgreSQL)
* Copy `.dev.vars.example` to `.dev.vars`
* Fill in `DATABASE_URL`, `AUTH_SECRET`, and `AUTH_URL`

Commands

    npm install
    npm run pages:build
    npm run pages:preview

This builds the app and starts a local Worker preview on port 8788.

---

24. Production Deployment

Prerequisites

* Cloudflare account (Workers Paid plan for custom domains)
* Neon PostgreSQL project with migrations applied
* Cloudflare API token (via `npx wrangler login`)

Steps

    1. Login to Wrangler:

       npx wrangler login

    2. Set secrets in Cloudflare Dashboard or via CLI:

       npx wrangler secret put DATABASE_URL
       npx wrangler secret put AUTH_SECRET
       npx wrangler secret put AUTH_URL
       npx wrangler secret put RESEND_API_KEY      # optional
       npx wrangler secret put EMAIL_FROM           # optional

    3. Build and deploy:

       npm run pages:build
       npm run deploy

    4. Verify deployment:

       npx wrangler tail

Environment Variables

Cloudflare-specific (set in .dev.vars or Cloudflare Dashboard):

* `DATABASE_URL` — Neon PostgreSQL connection string with `sslmode=require`
* `AUTH_SECRET` — NextAuth v5 secret (generate with `npx auth secret`)
* `AUTH_URL` — Public URL of your deployed app (e.g. https://workervoice.example.com)
* `WRANGLER=1` — Triggers Prisma HTTP adapter (set automatically in wrangler dev)

The app detects Cloudflare via `CF_PAGES`, `WRANGLER`, or `CLOUDFLARE` env vars
and switches from the TCP adapter (`@prisma/adapter-pg`) to the HTTP adapter
(`@prisma/adapter-neon`).

---

25. Commands Reference

Local Development (Docker)

    docker compose up -d          — Start PostgreSQL
    npm run dev                   — Start Next.js dev server
    npx prisma migrate dev        — Create and apply migrations
    npx prisma studio             — Open database browser

Cloudflare Workers

    npm run pages:dev             — Local Worker dev server
    npm run pages:build           — Build for Cloudflare
    npm run pages:preview         — Build + preview locally
    npm run deploy                — Deploy to Cloudflare
    npm run cf:tail               — Stream production logs

---

26. Troubleshooting

    1. "Worker size exceeds limit"
       — Heavy packages are externalized via `serverExternalPackages` in next.config.mjs
       — Workers Paid plan allows 10MB+ bundles

    2. "Could not connect to database"
       — Ensure DATABASE_URL points to Neon, not localhost
       — Verify `sslmode=require` in connection string
       — Check Neon project is not paused (free tier auto-suspend)

    3. "bcryptjs timeout"
       — bcrypt takes ~100ms CPU, within Workers limits
       — If hitting limits, reduce bcrypt rounds or use external auth service

    4. "404 on pages.dev domain"
       — Workers deploy to `workers.dev`, not `pages.dev`
       — Configure custom domain in Cloudflare Dashboard

    5. "Prisma adapter not switching"
       — Verify WRANGLER=1 or CF_PAGES=1 is set in environment
       — Check lib/prisma.ts detection logic