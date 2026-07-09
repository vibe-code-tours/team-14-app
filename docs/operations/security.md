07 - Security Guide

Project Name: WorkerVoice – Migrant Review Platform
Document Version: 1.0.0
Status: Approved
Owner: Security & Engineering Team
Last Updated: 2026-07-07

⸻

1. Purpose

This document defines the security standards, controls, and best practices for the WorkerVoice platform.

The primary objectives are:

* Protect user privacy.
* Protect anonymous reviewers.
* Protect company and agency data.
* Prevent abuse and spam.
* Secure the application and infrastructure.

All contributors must follow this document.

⸻

2. Security Principles

WorkerVoice follows these principles:

* Secure by Default
* Least Privilege
* Defense in Depth
* Privacy First
* Zero Trust
* Secure Development Lifecycle
* Principle of Minimum Data Collection

⸻

3. Security Objectives

The platform must protect:

* User accounts
* Anonymous reviews
* Personal information
* Company information
* Administrator accounts
* Infrastructure
* API endpoints

⸻

4. Authentication

Supported authentication:

* Email and Password
* Email Verification

Future authentication:

* Telegram Login
* Google Login
* Apple Login

Implementation

* Framework: Auth.js (NextAuth v5) with the Credentials provider and Prisma adapter.
* Session strategy: JWT (httpOnly cookie, signed with AUTH_SECRET). Database sessions
  are not used.
* Password hashing: bcryptjs, cost factor 12 (Auth.js's Credentials provider does not
  hash passwords itself).
* Email delivery (verification + password reset): Resend.

Requirements:

* Passwords must never be stored in plain text.
* Passwords must be hashed using a secure algorithm provided by the authentication provider.
* Sessions must expire automatically.
* Password reset tokens must expire after a limited time.
* Email-verification and password-reset tokens are stored as a SHA-256 hash, never in
  plaintext, and compared by hash — this extends the "never log tokens" rule to at-rest
  storage.
* Rate limiting on register, login, and password-reset is enforced via a Postgres-backed
  fixed-window counter (the `rate_limits` table), not an in-memory counter, so limits
  hold correctly across multiple app instances.
* A registered user's `full_name` is captured for internal admin audit trails only and
  must never be returned by any public-facing API. The optional `nickname` is shown
  publicly instead wherever a name is displayed; if no nickname is set, `full_name` is
  shown publicly by default. This is an intentional product decision — nickname is an
  opt-in privacy upgrade the worker can choose, not a system-enforced anonymity
  guarantee — communicated to the user at registration.

⸻

5. Authorization

Use Role-Based Access Control (RBAC).

Roles:

User

Permissions:

* View public content
* Submit reviews
* Edit own profile
* Vote on reviews
* Report reviews

⸻

Moderator

Permissions:

* Review reported content
* Hide inappropriate reviews
* Approve pending content

⸻

Administrator

Permissions:

* Full platform management
* User management
* Company management
* Agency management
* Review moderation
* System configuration

⸻

6. Anonymous Review Protection

The platform must protect worker identities.

Rules:

* Display names are never shown with anonymous reviews.
* Email addresses are never displayed publicly.
* Internal user identifiers are never exposed through the API.
* Administrator access to user information must be restricted and logged.

⸻

7. Input Validation

Validate all user input.

Examples:

* Required fields
* Email format
* UUID format
* Maximum text length
* Numeric ranges
* Allowed file types (future)

Reject invalid requests with appropriate HTTP status codes.

⸻

8. SQL Injection Prevention

Rules:

* Use Prisma ORM for database access.
* Do not concatenate SQL strings.
* Use parameterized queries when raw SQL is unavoidable.
* Review any raw SQL before merging.

⸻

9. Cross-Site Scripting (XSS)

Protect against XSS by:

* Escaping user-generated content.
* Sanitizing rich text if introduced in future.
* Avoiding unsafe HTML rendering.
* Using React’s default escaping behavior.

⸻

10. Cross-Site Request Forgery (CSRF)

For authenticated operations:

* Validate CSRF tokens where applicable.
* Use secure cookies if cookie-based authentication is implemented.
* Require HTTPS in production.

⸻

11. Rate Limiting

Apply rate limits to reduce abuse.

Suggested limits:

Public APIs

* 100 requests/minute/IP

Login

* 10 requests/minute/IP

Review Submission

* 5 submissions/hour/user

Password Reset

* 5 requests/hour/email

⸻

12. Spam Prevention

Prevent spam using:

* Email verification
* Rate limiting
* CAPTCHA (future)
* Duplicate submission detection
* Review reporting
* Moderator review

⸻

13. Secrets Management

Never store secrets in the repository.

Secrets include:

* Database credentials
* API keys
* JWT secrets
* OAuth credentials
* SMTP credentials

Use environment variables for all sensitive configuration.

⸻

14. Logging

Log important security events:

* Login attempts
* Failed authentication
* Password reset requests
* Permission failures
* Admin actions
* Unexpected server errors

Never log:

* Passwords
* Access tokens
* Refresh tokens
* Personal identification data

⸻

15. Audit Logging

Administrative actions should be recorded.

Examples:

* Company updates
* Agency updates
* Review moderation
* User role changes
* Configuration changes

Audit logs should include:

* User ID
* Action
* Timestamp
* Target resource

⸻

16. Review Moderation

Workers should be able to report inappropriate reviews.

Moderators should be able to:

* Approve
* Reject
* Hide
* Restore

Moderation decisions should be recorded in audit logs.

⸻

17. Data Privacy

Collect only the minimum information required.

Public users should never see:

* Email addresses
* Internal user IDs
* IP addresses
* Session information

Sensitive information must be accessible only to authorized administrators.

⸻

18. File Upload Security (Future)

If file uploads are added:

* Validate file types.
* Scan uploaded files.
* Limit file size.
* Store files outside the application runtime.
* Generate random filenames.

⸻

19. API Security

All APIs must:

* Validate authentication where required.
* Validate authorization.
* Validate input.
* Return consistent error responses.
* Avoid exposing implementation details.

⸻

20. Infrastructure Security

Production deployments should include:

* HTTPS
* Secure HTTP headers
* Automatic backups
* Firewall rules
* Principle of least privilege for service accounts
* Regular dependency updates

⸻

21. Dependency Management

Regularly:

* Review dependencies.
* Apply security updates after testing.
* Remove unused packages.
* Monitor security advisories.

Do not run automatic breaking updates in production without review.

⸻

22. Incident Response

If a security issue is discovered:

1. Assess impact.
2. Contain the issue.
3. Fix the vulnerability.
4. Test the solution.
5. Deploy safely.
6. Document the incident.
7. Review lessons learned.

⸻

23. Security Checklist

Before each production release:

* Authentication tested.
* Authorization verified.
* Input validation reviewed.
* Rate limiting enabled.
* Secrets configured correctly.
* HTTPS enabled.
* Backups verified.
* Logs monitored.
* Dependencies reviewed.

⸻

24. References

* 02-system-architecture.md
* 04-api-specification.md
* 05-development-guide.md
* 06-coding-standards.md
* 08-deployment.md

⸻

25. Change History

Version	Date	Author	Description
1.0.0	2026-07-07	Security & Engineering Team	Initial security guide