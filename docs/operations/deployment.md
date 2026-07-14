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

20. Vercel Deployment

Overview

WorkerVoice is deployed on Vercel with automatic deployments from GitHub.
The `main` branch deploys to production. Feature branches create preview
deployments automatically.

Prerequisites

* Vercel account (free tier works for development)
* GitHub repository access
* Hosted PostgreSQL database (Supabase, Neon, or Railway)
* All environment variables ready

Quick Start: First Deployment

1. Connect Repository

   - Go to vercel.com/new
   - Import the GitHub repository: vibe-code-tours/team-14-app
   - Select "Next.js" as the framework
   - Click "Deploy" (it will fail first time — that's expected)

2. Configure Environment Variables

   Go to Project Settings → Environment Variables and add:

   Database
   ─────────────────────────────────────────
   DATABASE_URL=postgresql://user:password@host:5432/dbname

   Authentication
   ─────────────────────────────────────────
   AUTH_SECRET=your-generated-secret
   AUTH_URL=https://your-app.vercel.app

   Application URLs
   ─────────────────────────────────────────
   NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
   NEXT_PUBLIC_API_URL=https://your-app.vercel.app

   Telegram Bot
   ─────────────────────────────────────────
   TELEGRAM_BOT_TOKEN=your-bot-token
   TELEGRAM_WEBHOOK_SECRET=your-webhook-secret

   Email (Resend)
   ─────────────────────────────────────────
   RESEND_API_KEY=your-resend-key
   EMAIL_FROM=noreply@your-domain.com

   Admin
   ─────────────────────────────────────────
   ADMIN_KEY=your-admin-key

3. Generate Secrets

   AUTH_SECRET:
   npx auth-secret

   TELEGRAM_WEBHOOK_SECRET:
   openssl rand -hex 32

4. Deploy

   - Push to main branch
   - Vercel auto-deploys
   - Check build logs for errors

5. Set Telegram Webhook

   After successful deployment:
   curl -X POST "https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-app.vercel.app/api/telegram/webhook"}'

6. Verify Deployment

   - Visit https://your-app.vercel.app
   - Test login/register
   - Test factory search
   - Test Telegram bot commands

Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | PostgreSQL connection string |
| AUTH_SECRET | Yes | JWT signing secret |
| AUTH_URL | Yes | Application base URL |
| NEXT_PUBLIC_SITE_URL | Yes | Public URL for links |
| NEXT_PUBLIC_API_URL | Yes | API base URL |
| TELEGRAM_BOT_TOKEN | Yes | Telegram bot token |
| TELEGRAM_WEBHOOK_SECRET | Yes | Webhook verification secret |
| RESEND_API_KEY | Yes | Email service API key |
| EMAIL_FROM | Yes | Sender email address |
| ADMIN_KEY | Yes | Admin API key |

Branch Deployment Strategy

| Branch | Environment | URL |
|--------|-------------|-----|
| main | Production | your-app.vercel.app |
| develop | Preview | your-app.vercel.app (commit hash) |
| feature/* | Preview | your-app.vercel.app (commit hash) |

Build Configuration

The project uses these build settings:

Build Command:
npx prisma generate && next build

Install Command:
npm install

Framework Preset:
Next.js

Node.js Version:
20.x (recommended)

Output:
standalone (configured in next.config.js)

Troubleshooting Guide

Problem: Build fails with "prisma generate" error

Symptom:
Error: @prisma/client did not initialize yet

Solution:
Ensure build command is: npx prisma generate && next build
The prisma generate step must run before next build.

---

Problem: Database connection fails in production

Symptom:
Error: Can't reach database server

Solution:
1. Verify DATABASE_URL is correct (not localhost)
2. Check database is accessible from Vercel's IP ranges
3. For Supabase: Use connection pooling (port 6543)
4. For Neon: Use connection string with ?sslmode=require
5. Check database firewall rules

---

Problem: Telegram bot not responding

Symptom:
Bot commands do nothing in Telegram

Solution:
1. Verify TELEGRAM_BOT_TOKEN is set correctly
2. Check webhook URL:
   curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo
3. Re-set webhook if needed:
   curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
     -d '{"url": "https://your-app.vercel.app/api/telegram/webhook"}'
4. Check Vercel function logs for errors

---

Problem: Authentication not working

Symptom:
Login/register fails silently

Solution:
1. Verify AUTH_SECRET is set (not empty)
2. Verify AUTH_URL matches your deployment URL
3. Check for HTTPS (required for secure cookies)
4. Clear browser cookies and try again

---

Problem: Environment variables not loading

Symptom:
Variables are undefined in code

Solution:
1. Check variable names match exactly (case-sensitive)
2. Redeploy after adding variables (they don't hot-reload)
3. Check if variable is in correct environment (Production/Preview/Development)
4. For NEXT_PUBLIC_* vars: they must be set at build time

---

Problem: Build succeeds but page shows error

Symptom:
White screen or 500 error on deployment

Solution:
1. Check Vercel function logs in dashboard
2. Verify all required env vars are set
3. Check for runtime errors in API routes
4. Test locally with same env vars

---

Problem: Preview deployment has different data

Symptom:
Preview URL shows different factories/reviews

Solution:
This is expected. Preview deployments use the same database as production.
Different data means someone else modified it. Check with team.

---

Problem: Webhook secret verification fails

Symptom:
401 Unauthorized error in Vercel logs

Solution:
1. Verify TELEGRAM_WEBHOOK_SECRET matches what's set in Telegram
2. Regenerate secret:
   openssl rand -hex 32
3. Update both Vercel env var and Telegram webhook

---

Problem: Slow cold starts

Symptom:
First request after idle takes 5-10 seconds

Solution:
This is normal for Vercel serverless functions. Options:
1. Enable Vercel Pro plan (faster cold starts)
2. Use Vercel Edge Runtime for lightweight endpoints
3. Keep functions warm with cron (Vercel supports this)

---

Problem: Build fails with "Module not found"

Symptom:
Error: Can't resolve '@prisma/client'

Solution:
1. Ensure prisma generate runs before build
2. Check prisma schema is valid
3. Clear .vercel/cache and redeploy

Useful Commands

Check webhook status:
curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo

Test API endpoint:
curl https://your-app.vercel.app/api/factories?limit=1

Check Vercel deployment status:
vercel ls

View function logs:
vercel logs

Redeploy from CLI:
vercel --prod

Monitoring

After deployment, monitor:

1. Vercel Dashboard
   - Function execution times
   - Error rates
   - Memory usage

2. Database
   - Connection count
   - Query performance
   - Storage usage

3. Telegram Bot
   - Webhook delivery rate
   - Response times
   - Error logs

4. User Experience
   - Page load times
   - API response times
   - Error rates

---

21. Change History

Version	Date	Author	Description
1.0.0	2026-07-07	DevOps Team	Initial deployment guide
1.1.0	2026-07-14	Engineering Team	Add Vercel deployment guide and troubleshooting