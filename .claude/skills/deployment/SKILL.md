---
name: deployment
description: Deployment workflow for WorkerVoice.
---

# Purpose

Ensure safe and repeatable deployments.

## Use When

- Deploying
- Creating CI/CD
- Configuring Docker
- Production releases

## Responsibilities

- Docker
- Docker Compose
- GitHub Actions
- Vercel
- Supabase
- AWS

## Standards

Always:

- Build before deploy
- Run tests
- Verify environment variables
- Prepare rollback

Never:

- Deploy broken builds
- Store secrets in Git

## Workflow

Lint

↓

Tests

↓

Build

↓

Deploy

↓

Health Check

↓

Done

## Definition of Done

- Build successful
- Tests passed
- Health check passed

## References

docs/operations/deployment.md
