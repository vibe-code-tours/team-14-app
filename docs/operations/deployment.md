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

---

21. Cloudflare Workers Deployment

Overview

WorkerVoice can be deployed to Cloudflare Workers using the OpenNext adapter.
This provides global edge deployment at $5/month with generous limits.

Local Wrangler Preview

Prerequisites

* Cloud database URL (Supabase or Neon)
* Copy `.dev.vars.example` to `.dev.vars`
* Fill in cloud `DATABASE_URL` and secrets

Commands

    npm run pages:build
    npm run pages:preview

This builds the app and starts a local Worker preview on port 8788.

Production Deployment

Prerequisites

* Cloudflare account with Workers Paid plan ($5/month)
* Cloud database (Supabase or Neon)
* Custom domain configured in Cloudflare

Steps

    1. Set environment variables in Cloudflare Dashboard or `wrangler.jsonc`:

       DATABASE_URL=postgresql://...neon.tech/...?sslmode=require
       NEXTAUTH_SECRET=your-secret
       NEXTAUTH_URL=https://your-domain.com

    2. Build and deploy:

       npm run pages:build
       npm run deploy

    3. Verify deployment:

       npx wrangler tail

Environment Variables

Cloudflare-specific variables:

* `WRANGLER=1` — triggers HTTP adapter for Prisma
* `CF_PAGES=1` — alternative detection flag
* `CLOUDFLARE=1` — alternative detection flag

Database

Cloudflare Workers cannot use TCP connections.
The app automatically switches to HTTP adapter (`@prisma/adapter-neon`) when
running in Cloudflare environment.

Local development uses TCP adapter (`@prisma/adapter-pg`) for Docker PostgreSQL.

Commands Reference

    npm run pages:dev       — Local Worker dev server
    npm run pages:build     — Build for Cloudflare
    npm run pages:preview   — Build + preview locally
    npm run deploy          — Deploy to Cloudflare
    npm run cf:tail         — Stream production logs

Troubleshooting

    1. "Worker size exceeds limit"
       — Add heavy packages to `serverExternalPackages` in `next.config.mjs`
       — Consider paid plan (10MB+ limit)

    2. "Could not connect to database"
       — Ensure `DATABASE_URL` points to cloud DB, not localhost
       — Verify `sslmode=require` in connection string

    3. "bcryptjs timeout"
       — bcrypt takes ~100ms CPU, within paid plan 30s limit
       — If hitting limits, reduce bcrypt rounds or use external auth

    4. "404 on pages.dev domain"
       — Workers deploy to `workers.dev`, not `pages.dev`
       — Configure custom domain in Cloudflare Dashboard