10 - Migration Plan

Project Name: WorkerVoice – Migrant Review Platform
Document Version: 1.0.0
Status: Approved
Owner: Solution Architecture Team
Last Updated: 2026-07-07

⸻

1. Purpose

This document defines the migration strategy from the legacy WorkerVoice platform to the new WorkerVoice platform.

The migration includes:

* Business requirements
* Database
* Factory data
* Agency data
* APIs
* User experience
* Infrastructure

The objective is to preserve valuable data while rebuilding the application with a modern architecture.

⸻

2. Migration Goals

The migration aims to:

* Modernize the application architecture.
* Improve maintainability.
* Improve scalability.
* Improve security.
* Improve developer productivity.
* Preserve existing business knowledge.
* Preserve existing workplace data.

⸻

3. Legacy System Overview

Technology Stack

* Node.js
* Express.js
* PostgreSQL
* Vanilla JavaScript
* Tailwind CSS (CDN)
* Render

Characteristics

* Single server file
* Server-side business logic
* Limited modularity
* Minimal authentication
* Factory search
* Anonymous reviews

⸻

4. Target System Overview

Technology Stack

* Next.js
* React
* TypeScript
* Prisma ORM
* PostgreSQL
* Tailwind CSS
* Docker Compose
* GitHub
* Claude Code

Benefits

* Modular architecture
* Strong typing
* Better developer experience
* Easier testing
* Better scalability
* Improved security

⸻

5. Migration Principles

The migration follows these principles:

* Preserve business value.
* Rewrite application code.
* Reuse trusted data.
* Avoid copying technical debt.
* Validate every migrated dataset.
* Perform migration incrementally.

⸻

6. Reuse Strategy

The following assets will be reused:

* Factory information
* Province information
* Region information
* Agency data (after validation)
* Business requirements
* User workflows
* Search rules

⸻

7. Rewrite Strategy

The following components will be rebuilt:

* User interface
* API layer
* Authentication
* Database access
* Folder structure
* Business services
* Deployment process

Legacy source code will not be copied directly into the new project.

⸻

8. Migration Phases

Phase 1

Project Foundation

Completed

* Next.js
* Prisma
* PostgreSQL
* Docker
* Documentation

⸻

Phase 2

Database Design

Tasks

* Design schema
* Create migrations
* Seed reference data

⸻

Phase 3

Factory Data

Tasks

* Export legacy data
* Validate
* Clean
* Import

⸻

Phase 4

Agency Data

Tasks

* Review data quality
* Normalize
* Import

⸻

Phase 5

Feature Development

Build

* Company Search
* Company Detail
* Reviews
* User Accounts

⸻

Phase 6

Administration

Build

* Dashboard
* Moderation
* Reports

⸻

Phase 7

Production Launch

Deploy

* Application
* Database
* Monitoring

⸻

9. Data Migration Strategy

Migration order

1. Regions
2. Provinces
3. Companies
4. Agencies
5. Articles
6. Reviews
7. Users (if migrated)

Each dataset should be:

* Verified
* Cleaned
* Normalized
* Imported
* Validated

⸻

10. Company Data

Reuse

* Registration numbers
* Company names
* Province
* District
* Address
* Worker count

Review

* Duplicate records
* Missing values
* Invalid locations

⸻

11. Agency Data

Migration depends on:

* Data quality
* Duplicate detection
* License validation (where available)

⸻

12. Review Data

Review migration should include:

* Ratings
* Comments
* Pros
* Cons

Exclude any data that could compromise user privacy.

⸻

13. Database Migration

Rules

* Use Prisma Migrate.
* Do not manually modify production schema.
* Review migrations before deployment.

Every migration should be reversible where practical.

⸻

14. API Migration

Old APIs will be replaced by versioned REST APIs.

The new API should maintain business functionality while improving consistency, validation, and security.

⸻

15. UI Migration

Legacy

* Vanilla JavaScript

Target

* React
* Next.js
* Tailwind CSS

Pages should be redesigned rather than directly copied.

⸻

16. User Migration

Version 1

Existing user accounts will not be migrated unless validated.

Users may register again using the new authentication system if required.

⸻

17. Validation

After each migration phase:

Verify

* Record counts
* Data integrity
* Search functionality
* Review relationships
* API responses

Migration is complete only after validation succeeds.

⸻

18. Rollback Plan

If migration fails:

1. Stop deployment.
2. Restore previous database backup.
3. Restore previous application version.
4. Verify system health.
5. Investigate and resolve the issue.
6. Retry migration after approval.

⸻

19. Risks

Risk	Impact	Mitigation
Duplicate data	High	Data validation before import
Missing data	Medium	Import reports and verification
Schema mismatch	High	Test migrations in development first
Legacy technical debt	Medium	Rewrite rather than copy code

⸻

20. Success Criteria

Migration is considered successful when:

* Factory data is searchable.
* Agency data is available.
* Company profiles load correctly.
* Reviews display correctly.
* New APIs replace legacy APIs.
* Documentation is complete.
* Production deployment succeeds.

⸻

21. Future Improvements

Future migration work may include:

* Multi-country support
* AI-assisted data normalization
* Automated data synchronization
* Improved data quality reporting

⸻

22. References

* 00-project-overview.md
* 01-product-requirements.md
* 02-system-architecture.md
* 03-database-design.md
* 04-api-specification.md
* 05-development-guide.md
* 07-security.md
* 08-deployment.md
* 09-testing-strategy.md

⸻

23. Change History

Version	Date	Author	Description
1.0.0	2026-07-07	Solution Architecture Team	Initial migration plan