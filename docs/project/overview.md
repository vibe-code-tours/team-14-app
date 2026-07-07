00 - Project Overview

Project Name: WorkerVoice - Migrant Review Platform
Version: 1.0.0
Status: Draft
Owner: Development Team
Repository: migrant-review-platform
Last Updated: 2026-07-07

⸻

Project Vision

WorkerVoice is a web platform designed to help Myanmar migrant workers make safer employment decisions by providing trustworthy workplace information and anonymous community reviews for factories and recruitment agencies.

The platform allows workers to search companies, read reviews from other workers, compare working conditions, and anonymously share their own experiences to help others avoid unsafe or misleading workplaces.

⸻

Problem Statement

Many migrant workers accept jobs without reliable information about the workplace.

Common problems include:

* Unknown salary conditions
* Unclear overtime policies
* Poor accommodation
* Unsafe working environments
* Fraudulent recruitment agencies
* Lack of trustworthy community information

Currently, workers mostly rely on Facebook groups and word of mouth, where information is difficult to search, verify, and organize.

WorkerVoice aims to solve this problem by providing a structured workplace review platform.

⸻

Project Goals

The primary goals of this project are:

* Help workers make informed employment decisions.
* Build a trustworthy review platform.
* Provide transparent workplace information.
* Encourage anonymous but responsible community feedback.
* Improve workplace transparency for migrant workers.

⸻

Target Users

Primary Users

* Myanmar migrant workers
* Job seekers
* Workers changing companies
* Workers searching for agencies

Secondary Users

* Platform administrators
* Moderators

⸻

MVP Success Criteria

The first production version is considered successful when a worker can:

1. Search for a factory or agency.
2. Open its detail page.
3. Read reviews from other workers.
4. Submit an anonymous review.
5. Vote whether a review is useful.

⸻

MVP Features

Public

* Home page
* Company search
* Company profile
* Agency profile
* Review list
* Company statistics

Registered Users

* Register
* Login
* Email verification
* Submit anonymous review
* Vote useful / not useful
* Edit profile

Administrator

* Dashboard
* Manage companies
* Manage agencies
* Moderate reviews
* View reports

⸻

Out of Scope (MVP)

The following features are intentionally excluded from the first release:

* Voice reviews
* Payment system
* Job application system
* Chat system
* Location-based search
* AI review summaries
* Legal dispute resolution

⸻

Technology Stack

Frontend

* Next.js (App Router)
* TypeScript
* React
* Tailwind CSS
* shadcn/ui

Backend

* Next.js Route Handlers
* TypeScript
* Prisma ORM

Database

* PostgreSQL

Authentication

* Supabase Auth (planned)

Development

* Docker Compose
* Prisma Migrations
* GitHub
* Claude Code

Deployment

Development

* Docker

Production

* Vercel
* PostgreSQL (Supabase or AWS RDS)

⸻

Development Principles

The project follows these principles:

* Keep the architecture simple.
* Prefer reusable components.
* Write readable code.
* Use TypeScript everywhere.
* Build features incrementally.
* Follow Git workflow.
* Document architectural decisions.
* Review code before merging.
* Never commit secrets.

⸻

Repository Structure

migrant-review-platform/
app/
src/
prisma/
docs/
scripts/
public/
.claude/
.github/
docker-compose.yml
README.md
CLAUDE.md

⸻

Team Roles

Product Owner

* Define requirements
* Prioritize backlog
* Accept completed work

Solution Architect

* Design system architecture
* Review technical decisions
* Maintain documentation

Frontend Developer

* Build UI
* Implement user experience
* Consume APIs

Backend Developer

* Implement APIs
* Business logic
* Database integration

DevOps Engineer

* Docker
* CI/CD
* Deployment
* Infrastructure

QA Engineer

* Test features
* Verify requirements
* Regression testing

⸻

Development Workflow

Every feature follows the same workflow.

1. Create GitHub Issue.
2. Discuss requirements.
3. Claude Code prepares implementation plan.
4. Team reviews the plan.
5. Claude Code implements the feature.
6. Developer tests locally.
7. Open Pull Request.
8. Code Review.
9. Merge into develop.
10. Deploy to Development environment.
11. QA verification.
12. Merge into main.

⸻

Git Branch Strategy

main
develop
feature/*
bugfix/*
release/*
hotfix/*

Direct commits to main are not allowed.

⸻

Documentation

All project documentation is stored inside the docs/ directory.

* 00-project-overview.md
* 01-product-requirements.md
* 02-system-architecture.md
* 03-database-design.md
* 04-api-specification.md
* 05-development-guide.md
* 06-coding-standards.md
* 07-security.md
* 08-deployment.md
* 09-testing-strategy.md
* 10-migration-plan.md

⸻

Project Status

Current Phase

Phase 0 — Project Foundation

Completed

* Next.js project initialization
* Prisma setup
* PostgreSQL setup
* Docker Compose
* API foundation
* Project structure
* Claude Code integration

Next Milestone

* Company List
* Company Detail
* Review Display

⸻

Long-Term Roadmap

Version 1.0

* Core review platform

Version 2.0

* Agency improvements
* Advanced search
* Reporting dashboard

Version 3.0

* Mobile application
* Notifications
* AI-assisted moderation
* Analytics

⸻

References

* Product Requirements Document
* System Architecture
* Database Design
* API Specification
* Development Guide
* Coding Standards
* Security Guide

⸻

Change History

Version	Date	Author	Description
1.0.0	2026-07-07	Development Team	Initial project overview