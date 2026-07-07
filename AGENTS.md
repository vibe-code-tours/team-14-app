# Agent Instructions for Migrant Review Platform

## Project Context

This is a Next.js 14 App Router project with TypeScript, Tailwind CSS, Prisma ORM, and PostgreSQL.

## Development Methodology

### Feature Development Workflow

1. **Plan First** — Use `/plan-feature` to analyze requirements
2. **Build Incrementally** — Use `/build-feature` to implement
3. **Test Manually** — Verify in browser
4. **Lint & Type Check** — Run `npm run lint` and `npx tsc --noEmit`
5. **Commit** — Small, focused commits

### Code Organization

```
app/                    # Next.js App Router
├── page.tsx            # Page components (Server Components by default)
├── layout.tsx          # Layout components
└── api/                # API routes (Route Handlers)

lib/                    # Business logic & database helpers
├── prisma.ts           # Database client
├── factories.ts        # Factory operations
├── reviews.ts          # Review operations
└── suggestions.ts      # Suggestion operations

src/components/         # Reusable UI components (Client Components)
src/types/              # TypeScript type definitions
```

### Component Guidelines

- **Server Components (default)** — Use for data fetching, static content
- **Client Components (`'use client'`)** — Use only for:
  - Forms and user input
  - Interactive UI (modals, dropdowns)
  - Browser APIs (localStorage, geolocation)
  - Event handlers

### API Design

- Use Route Handlers in `app/api/`
- Return consistent JSON format: `{ data: ..., error: ... }`
- Validate input before database operations
- Use Prisma for database queries

### Database

- Schema in `prisma/schema.prisma`
- Run migrations: `npx prisma migrate dev`
- Use `lib/` helpers for database operations
- Never query database directly in components

## Available Commands

| Command | Description |
|---------|-------------|
| `/plan-feature [description]` | Analyze and plan a feature |
| `/build-feature [description]` | Implement a feature |
| `/fix-lint` | Fix ESLint errors |
| `/fix-types` | Fix TypeScript errors |
| `/test-api [endpoint]` | Test an API endpoint |
| `/check-db` | Check database connection |

## MCP Servers

- **context7** — Fetch library documentation
- **playwright** — Browser testing
- **sequential-thinking** — Complex problem solving
- **github** — GitHub integration
- **postgres** — Direct database queries

## Quality Checklist

Before completing any feature:

- [ ] TypeScript types defined
- [ ] Server Component used by default
- [ ] Client Component only when needed
- [ ] API endpoints documented
- [ ] Error handling implemented
- [ ] ESLint passes
- [ ] No TypeScript errors
