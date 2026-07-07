---
name: nextjs
description: Standards and workflow for developing Next.js features in WorkerVoice.
---

# Purpose

This skill defines the engineering standards for building frontend and API features using Next.js.

## Use When

- Creating pages
- Creating layouts
- Creating components
- Creating Route Handlers
- Refactoring frontend code

## Responsibilities

- App Router
- Server Components
- Client Components
- Route Handlers
- Tailwind integration
- Loading and Error UI

## Standards

Always:

- Use App Router
- Prefer Server Components
- Keep components small
- Use TypeScript
- Use Tailwind CSS
- Use "@/..." imports

Never:

- Duplicate UI
- Mix business logic into components
- Access the database directly from UI

## Workflow

Requirement

↓

Design Component

↓

Implement

↓

Connect API

↓

Responsive Review

↓

Accessibility Review

↓

Testing

↓

Done

## Best Practices

- Mobile-first
- Accessible UI
- Reusable components
- Strong typing
- Clean folder structure

## Definition of Done

- TypeScript passes
- ESLint passes
- Responsive
- Accessible
- Loading UI
- Error UI

## References

docs/architecture/system-architecture.md

docs/ui/ui-ux-guidelines.md

docs/engineering/coding-standards.md
