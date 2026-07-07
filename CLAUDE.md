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

# Technology Stack

Frontend

- Next.js 16.2.10 (App Router) — Current stable
- React 19.2.7 — Current stable
- TypeScript 5.9.3 — Latest stable 5.x
- Tailwind CSS 4.3.2 — Current stable

Backend

- Next.js Route Handlers
- Prisma ORM 7.8.0 — Current stable

Database

- PostgreSQL 16 — LTS, supported until November 2028
- Docker Compose

Development

- Node.js 24.16.0 — Active LTS
- npm 11.13.0
- ESLint 9.39.4 — Current stable
- Prettier 3.9.4 — Current stable
- Husky 9.1.7 — Current stable
- lint-staged 17.0.8 — Current stable

Testing

- Vitest 4.1.10 — Current stable
- Playwright 1.61.1 — Current stable

Deployment

- Vercel
- Supabase

See `docs/engineering/technology-stack-policy.md` for version management policy.

---

# Repository Structure

app/
src/
prisma/
docs/
public/

Business logic belongs in:

lib/

Database access belongs in:

Prisma

UI belongs in:

src/components

Feature-specific code belongs in:

src/features

Types belong in:

src/types

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

Testing

```bash
npm run test
npm run test:run
npm run test:e2e
```

---

# Architecture Principles

Prefer

Component

↓

Service

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
