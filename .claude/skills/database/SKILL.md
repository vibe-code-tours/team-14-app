---
name: database
description: Database development standards using Prisma and PostgreSQL.
---

# Purpose

Maintain a scalable, secure, and maintainable database.

## Use When

- Designing schema
- Creating migrations
- Writing repositories
- Optimizing queries
- Reviewing database changes

## Responsibilities

- Prisma
- PostgreSQL
- Relations
- Indexes
- Constraints
- Transactions
- Migrations

## Standards

Always:

- Create migrations
- Use Repository Pattern
- Review indexes
- Preserve data
- Use transactions when necessary

Never:

- Modify production schema without migration
- Write raw SQL unless necessary
- Duplicate data

## Workflow

Requirement

↓

Schema Design

↓

Migration

↓

Repository

↓

Performance Review

↓

Testing

↓

Done

## Best Practices

- Normalize data
- Explicit foreign keys
- Index search columns
- Keep migrations small

## Definition of Done

- Migration created
- Relations verified
- Indexes reviewed
- Performance reviewed

## References

docs/architecture/database-design.md
