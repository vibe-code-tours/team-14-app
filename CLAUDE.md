# CLAUDE.md

# WorkerVoice - AI Engineering Guide

> This document provides operational guidance for Claude Code when contributing to the WorkerVoice project.
>
> It is not the source of truth for project requirements.
> Detailed documentation lives under the `docs/` directory.

---

# Project Mission

WorkerVoice is a workplace review platform that helps Myanmar migrant workers make safer employment decisions before joining a company or recruitment agency.

The platform allows workers to anonymously review:

- Factories
- Companies
- Recruitment Agencies

Primary goals

- Worker safety
- Anonymous reviews
- Transparent workplace information
- High code quality
- Long-term maintainability

---

# Documentation

Before implementing any feature, always read the relevant documentation.

Project

docs/project/

Architecture

docs/architecture/

Engineering

docs/engineering/

Operations

docs/operations/

UI

docs/ui/

Architecture Decisions

docs/adr/

Documentation is the source of truth.

Never duplicate documentation inside this file.

---

# Current MVP

Current sprint focuses only on:

- Company Search
- Company Detail
- Anonymous Reviews
- Useful / Not Useful Voting
- Agency Detail
- Telegram Bot Integration

Do not implement features outside the MVP unless requested.

---

# Current Technology Stack

> **Sprint 1 Baseline** — Approved for use. Post-Sprint 1 migration targets documented below.

Frontend

- Next.js 14.2.35 (App Router) — ⚠ Maintenance mode, security patches only
- React 18.3.1 — ⚠ Supported (legacy), React 19 is current
- TypeScript 5.9.3 — ✅ Latest stable 5.x
- Tailwind CSS 3.4.19 — ✅ Latest stable 3.x (4.x is current, deferred to Sprint 3)

Backend

- Next.js Route Handlers
- Prisma ORM 5.22.0 — ⚠ Maintenance mode, security patches only

Database

- PostgreSQL 16 — ✅ LTS, supported until November 2028
- Docker Compose

Development

- Node.js 24.16.0 — ✅ Active LTS
- npm 11.13.0
- Docker 29.0.1
- Docker Compose 2.40.3
- ESLint 8.57.1 — ❌ **EOL since October 2023, no security patches**
- Prettier 3.9.4 — ✅ Latest stable
- Husky 9.1.7 — ✅ Latest stable
- lint-staged 17.0.8 — ✅ Latest stable
- PostCSS 8.5.16 — ✅ Latest stable
- Autoprefixer 10.5.2 — ✅ Latest stable
- Git 2.54.0

Testing

- Vitest 4.1.10 — ✅ Latest stable
- Playwright 1.61.1 — ✅ Latest stable

Deployment (Planned)

- Vercel
- Supabase

## Post-Sprint 1 Migration Targets

| Package | Current | Target | Sprint |
|---------|---------|--------|--------|
| Next.js | 14.2.35 | 16.2.10 | 2 |
| React | 18.3.1 | 19.2.7 | 2 |
| React DOM | 18.3.1 | 19.2.7 | 2 |
| Prisma | 5.22.0 | 7.8.0 | 2 |
| ESLint | 8.57.1 | 9.x+ | 2 |
| eslint-config-next | 14.2.35 | 16.2.10 | 2 |
| @types/react | 18.3.31 | 19.2.17 | 2 |
| @types/react-dom | 18.3.7 | 19.2.3 | 2 |
| @types/node | 20.19.43 | 24.x | 2 |
| Tailwind CSS | 3.4.19 | 4.3.2 | 3 |

---

## Upgrade Policy

| Upgrade Type | Policy |
|--------------|--------|
| Patch versions | Auto-update during development |
| Minor versions | Review and update quarterly |
| Major versions | Plan and execute post-MVP (Sprint 2–3) |

## Security Support

- **ESLint 8.57.1:** ❌ EOL — no security patches since October 2023. Must upgrade before production.
- **Next.js 14.2.35:** ⚠ Maintenance — critical security patches only.
- **Prisma 5.22.0:** ⚠ Maintenance — critical security patches only.
- All other packages: ✅ Active security support.

## Official Baseline

This technology stack is the official baseline for Sprint 1. See `docs/engineering/technology-stack-policy.md` for complete version management policy. See `docs/engineering/technology-decision-record.md` for the full audit report.

---

# Repository Structure

app/
src/
prisma/
scripts/
docs/
tests/
public/

Business logic belongs in:

src/services

Database access belongs in:

Prisma

UI belongs in:

src/components

Feature-specific code belongs in:

src/features

Utilities belong in:

src/utils

---

# Development Workflow

Whenever implementing a feature:

Step 1

Read

- Requirements
- Architecture
- Database
- API Specification

Step 2

Understand the request.

Step 3

Create an implementation plan.

Step 4

Implement the smallest useful change.

Step 5

Run validation.

Step 6

Update documentation if required.

Never skip planning for large features.

---

# Engineering Rules

Always

- Write TypeScript
- Prefer Server Components
- Use Prisma
- Reuse components
- Keep functions small
- Keep files focused
- Prefer composition

Never

- Rewrite unrelated code
- Disable TypeScript
- Disable ESLint
- Introduce unnecessary libraries
- Ignore build failures

---

# Database Rules

Always

- Use Prisma
- Create migrations
- Use transactions when needed
- Validate schema changes

Never

- Modify production schema manually
- Use raw SQL without justification

---

# API Rules

APIs should

- Validate input
- Return consistent responses
- Handle errors gracefully
- Never expose stack traces

Business logic should not exist inside Route Handlers.

---

# Frontend Rules

Use

- Reusable components
- TypeScript interfaces
- Tailwind CSS
- Accessible HTML

Avoid

- Large page components
- Duplicated UI
- Business logic inside components

---

# Security Rules

Never

- Expose secrets
- Log passwords
- Log tokens
- Trust client input

Always

- Validate input
- Sanitize user data
- Protect admin routes

---

# Git Workflow

Feature

↓

Branch

↓

Implementation

↓

Lint

↓

Build

↓

Documentation

↓

Pull Request

↓

Review

↓

Merge

Never commit directly to main.

---

# Definition of Done

A task is complete only when

✓ Requirements implemented

✓ TypeScript passes

✓ Build succeeds

✓ Lint passes

✓ Documentation updated

✓ Database migration added (if required)

✓ No TODO left

✓ No debug code

---

# Commands

Development

```bash
npm run dev
npm run build
npm run lint
```

Database

```bash
docker compose up -d

npx prisma generate

npx prisma migrate dev

npx prisma studio
```

---

# MCP Servers

Configured servers

- context7
- github
- postgres
- playwright
- sequential-thinking

Use them whenever they improve accuracy or productivity.

---

# Architecture Principles

Prefer

Component

↓

Service

↓

Repository

↓

Prisma

↓

Database

Do not access Prisma directly from UI components.

---

# Documentation Update Policy

If implementation changes:

API

↓

Update

docs/architecture/api-specification.md

Database

↓

Update

docs/architecture/database-design.md

Security

↓

Update

docs/operations/security.md

Deployment

↓

Update

docs/operations/deployment.md

---

# Long-Term Roadmap

MVP

↓

Authentication

↓

Admin Dashboard

↓

Telegram Bot

↓

AI Review Moderation

↓

Multi-country Support

↓

Mobile Application

---

# AI Behaviour

Claude should

- Read documentation before coding.
- Plan before implementation.
- Generate small incremental changes.
- Prefer modifying existing code instead of rewriting.
- Keep architecture consistent.
- Explain important architectural decisions.
- Ask for clarification only when requirements are genuinely ambiguous.

Claude should avoid making speculative architectural changes without explicit approval.