03 - Database Design

Project Name: WorkerVoice – Migrant Review Platform
Document Version: 1.0.0
Status: Draft
Owner: Backend Team
Last Updated: 2026-07-07

⸻

1. Purpose

This document defines the database architecture for the WorkerVoice platform.

It provides a consistent reference for:

* Database schema
* Entity relationships
* Naming conventions
* Constraints
* Indexes
* Migration strategy

All database changes must be implemented through Prisma migrations.

⸻

2. Database Technology

Component	Technology
Database	PostgreSQL
ORM	Prisma ORM
Migration	Prisma Migrate
Local Development	Docker Compose
Production	PostgreSQL (Supabase or AWS RDS)

⸻

3. Database Design Principles

The database should follow these principles:

* Normalize data where practical.
* Use UUID primary keys.
* Use foreign keys to maintain integrity.
* Never store duplicated information unnecessarily.
* Use timestamps on every table.
* Prefer soft deletion over permanent deletion where appropriate.
* All schema changes must use migrations.

⸻

4. Core Entities

The MVP consists of the following entities:

* Users (Profiles)
* Companies (Factories)
* Agencies
* Reviews
* Review Votes
* Review Reports
* Articles
* Company Views
* Suggested Organizations
* Audit Logs

⸻

5. Entity Relationships

User
 ├── Reviews
 ├── Votes
 └── Reports
Company
 ├── Reviews
 └── Views
Agency
 └── Reviews
Review
 ├── Votes
 └── Reports

⸻

6. Table Definitions

users

Purpose

Store registered user information (implemented via Auth.js's Prisma adapter).

Fields

* id (String, cuid — an adapter-mandated exception to the Int autoincrement IDs used
  elsewhere in this schema)
* email (unique)
* password_hash (nullable — allows future OAuth-only users with no password)
* full_name — the worker's real name, captured for internal admin audit trails only.
  Never exposed via any public API or UI.
* nickname (nullable) — optional privacy upgrade. If set, shown publicly instead of
  full_name wherever a name is displayed (reviews, profile). If not set, full_name is
  shown publicly by default — this is an intentional product decision, not a gap:
  nickname is an opt-in safety feature, not a system-enforced anonymity guarantee.
  Public display name resolves via `getPublicDisplayName(user)` in `lib/users.ts`
  (`nickname ?? fullName`), the only function permitted to surface a name publicly.
* role (see Role enum below)
* email_verified (nullable timestamp)
* image (nullable — adapter-standard, unused until OAuth providers are added)
* created_at / updated_at

Related Auth.js adapter tables

* accounts — OAuth provider links (unused today, Credentials-only; kept for future
  Google/Telegram login without another migration)
* sessions — unused under the JWT session strategy; kept for adapter type-contract
  compatibility and future database-session support
* verification_tokens — reused for the email-verification flow (identifier = email);
  tokens are stored as a SHA-256 hash, never in plaintext
* password_reset_tokens — separate from verification_tokens because password reset has
  a different lifecycle (per-user, 1-hour expiry); tokens stored as a SHA-256 hash
* rate_limits — fixed-window counters for register/login/password-reset rate limiting

⸻

companies

Purpose

Store factory and company information.

Suggested Fields

* id
* registration_number
* name_th
* name_en
* name_mm
* operator_name
* province
* district
* address_th
* address_en
* address_mm
* phone
* latitude
* longitude
* worker_count
* status
* created_at
* updated_at

⸻

agencies

Purpose

Store recruitment agency information.

Suggested Fields

* id
* name
* country
* address
* phone
* license_number
* website
* status
* created_at
* updated_at

⸻

reviews

Purpose

Store anonymous workplace reviews.

Suggested Fields

* id
* company_id
* agency_id
* user_id
* rating
* salary_rating
* overtime_rating
* accommodation_rating
* welfare_rating
* pros
* cons
* comment
* is_anonymous
* moderation_status
* created_at
* updated_at

⸻

review_votes

Purpose

Store useful / not useful votes.

Suggested Fields

* id
* review_id
* user_id
* vote_type
* created_at

One user may vote only once per review.

⸻

review_reports

Purpose

Allow users to report inappropriate reviews.

Suggested Fields

* id
* review_id
* reported_by
* reason
* status
* created_at

⸻

articles

Purpose

Store worker information articles.

Examples

* Labour Rights
* Visa Information
* Work Permit
* Emergency Contacts

⸻

company_views

Purpose

Track profile page views.

Suggested Fields

* id
* company_id
* viewed_at
* country
* device_type

⸻

suggested_organizations

Purpose

Store user-submitted factories or agencies awaiting approval.

⸻

audit_logs

Purpose

Record administrator actions.

⸻

7. Enumerations

Example enums

Role (UserRole)

* user
* moderator
* administrator

(Lowercase values to match this schema's existing enum-value convention —
OrganizationType.factory, SuggestionStatus.pending — and the three roles defined in
docs/operations/security.md's RBAC section.)

Review Status

* PENDING
* APPROVED
* REJECTED

Organization Type

* FACTORY
* AGENCY

Vote Type

* USEFUL
* NOT_USEFUL

Language

* MY
* EN

⸻

8. Naming Convention

Tables

* plural
* lowercase
* snake_case

Columns

* snake_case

Primary Keys

* id

Foreign Keys

* company_id
* user_id
* review_id

Timestamps

* created_at
* updated_at

⸻

9. Index Strategy

Recommended indexes

companies

* registration_number
* province
* district

reviews

* company_id
* agency_id
* created_at

review_votes

* review_id
* user_id (unique)

users

* email (unique)

⸻

10. Constraints

Examples

* Email must be unique.
* Registration number should be unique.
* One vote per user per review.
* Foreign keys must be enforced.
* Reviews require either a company_id or an agency_id.

⸻

11. Migration Strategy

Rules

* Never modify production tables manually.
* Every schema change requires a Prisma migration.
* Review migrations before merging.
* Backup production before applying migrations.

⸻

12. Seed Data

Initial seed should include:

* Thailand regions
* Provinces
* Factory data
* Sample agencies
* Sample articles

⸻

13. Data Migration Plan

Data will be migrated from the legacy WorkerVoice project.

Migration order:

1. Provinces
2. Companies
3. Agencies
4. Reviews (after schema validation)

Business logic will be rewritten; only validated data will be migrated.

⸻

14. Backup Strategy

Development

* Local PostgreSQL dump

Production

* Automated daily backup
* Point-in-time recovery where supported

⸻

15. Future Database Enhancements

Future versions may add:

* Notifications
* Saved companies
* User reputation
* AI moderation history
* Multi-country support
* Search indexing

⸻

16. References

* 01-product-requirements.md
* 02-system-architecture.md
* 04-api-specification.md
* 07-security.md

⸻

17. Change History

Version	Date	Author	Description
1.0.0	2026-07-07	Backend Team	Initial database design