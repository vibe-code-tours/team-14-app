06 - Coding Standards

Project Name: WorkerVoice – Migrant Review Platform
Document Version: 1.0.0
Status: Approved
Owner: Engineering Team
Last Updated: 2026-07-07

⸻

1. Purpose

This document defines the coding standards for the WorkerVoice project.

All contributors, including developers and AI-assisted tools, must follow these standards to ensure the codebase remains consistent, maintainable, secure, and easy to review.

⸻

2. Engineering Principles

All code should be:

* Simple
* Readable
* Maintainable
* Testable
* Reusable
* Secure
* Well documented

Prefer clarity over cleverness.

⸻

3. General Rules

Developers should:

* Write self-explanatory code.
* Keep functions small.
* Avoid duplicated logic.
* Prefer composition over duplication.
* Remove unused code.
* Never commit commented-out code.
* Keep commits focused on a single change.

⸻

4. Project Structure

app/
src/
  components/
  features/
  hooks/
  lib/
  services/
  types/
  utils/
prisma/
docs/
public/
scripts/

Every file should have a clear responsibility.

⸻

5. Naming Conventions

Components

Use PascalCase.

Examples

CompanyCard.tsx
ReviewList.tsx
LoginForm.tsx

⸻

Hooks

Use camelCase beginning with use.

Examples

useCompanySearch.ts
useReviewForm.ts
usePagination.ts

⸻

Services

Use camelCase.

Examples

companyService.ts
reviewService.ts
authService.ts

⸻

Utility Files

Examples

formatDate.ts
calculateRating.ts
slugify.ts

⸻

Database Models

Use PascalCase in Prisma.

Example

Company
Review
User
Agency

Database table names should use lowercase snake_case.

Example

companies
reviews
review_votes

⸻

6. Folder Organization

Organize by feature rather than by file type whenever possible.

Example

src/features/company/
components/
hooks/
services/
types/

Each feature should be independent and reusable.

⸻

7. TypeScript Standards

Always use TypeScript.

Avoid any unless absolutely necessary.

Prefer explicit interfaces.

Example

interface Company {
  id: string;
  name: string;
}

Enable strict mode.

Never ignore compiler errors without discussion.

⸻

8. React Standards

Use:

* Functional Components
* React Hooks
* Server Components by default
* Client Components only when necessary

Avoid unnecessary state.

Keep components focused on one responsibility.

⸻

9. Next.js Standards

Use the App Router.

Use Route Handlers for APIs.

Keep page components lightweight.

Move business logic into services.

⸻

10. Component Guidelines

Components should:

* Be reusable.
* Accept typed props.
* Avoid business logic.
* Avoid direct database access.
* Be easy to test.

⸻

11. API Guidelines

API handlers should:

* Validate input.
* Return consistent response formats.
* Handle expected errors.
* Avoid business logic inside route handlers.

Move business rules into service functions.

⸻

12. Database Guidelines

Use Prisma for all database operations.

Never execute raw SQL unless justified and reviewed.

Always use migrations.

Use transactions for operations involving multiple tables.

⸻

13. Error Handling

Handle errors consistently.

Do not expose:

* Stack traces
* SQL queries
* Internal file paths

Log detailed errors internally and return user-friendly messages.

⸻

14. Logging

Log:

* Authentication failures
* Unexpected exceptions
* Database errors
* External API failures

Never log:

* Passwords
* Access tokens
* Personal data
* Secrets

⸻

15. Comments

Write comments only when they explain why, not what.

Bad

// Increment i
i++;

Good

// Prevent duplicate review submissions within the same request.

⸻

16. Documentation

Every major feature should update:

* API documentation
* Database documentation
* Relevant architecture documents

Code changes without documentation updates should not be merged.

⸻

17. Code Formatting

Use project tooling for formatting.

Do not manually reformat unrelated files.

Keep line lengths readable.

Remove unused imports before committing.

⸻

18. Git Standards

Use Conventional Commits.

Examples

feat: add company search
fix: resolve login validation
docs: update API specification
refactor: simplify review service

⸻

19. Pull Request Standards

A Pull Request should:

* Solve one problem.
* Include tests when appropriate.
* Update documentation if needed.
* Pass lint and build checks.

Reviewers should verify:

* Correctness
* Readability
* Security
* Performance
* Documentation

⸻

20. Security Guidelines

Developers must:

* Validate all input.
* Use parameterized database queries.
* Sanitize user-generated content.
* Protect sensitive routes.
* Never trust client input.

Refer to 07-security.md for detailed security practices.

⸻

21. Performance Guidelines

Prefer:

* Pagination
* Lazy loading
* Efficient database queries
* Optimized images
* Server-side rendering where appropriate

Avoid unnecessary re-renders and N+1 database queries.

⸻

22. Accessibility

Build accessible interfaces.

Use:

* Semantic HTML
* Keyboard navigation
* Appropriate labels
* Sufficient color contrast

Accessibility improvements should be included as part of feature development.

⸻

23. AI-Assisted Development

Claude Code is used to improve development productivity.

Rules:

* Read relevant documentation before generating code.
* Generate small, focused changes.
* Review all generated code.
* Do not merge unreviewed AI-generated code.
* Keep prompts and outputs aligned with project standards.

⸻

24. Definition of Done

A task is complete when:

* Requirements are implemented.
* Code follows project standards.
* Build passes.
* Lint passes.
* Documentation is updated.
* Code review is approved.
* Tests pass (when applicable).

⸻

25. References

* 05-development-guide.md
* 07-security.md
* 09-testing-strategy.md
* ADR documents

⸻

26. Change History

Version	Date	Author	Description
1.0.0	2026-07-07	Engineering Team	Initial coding standards document