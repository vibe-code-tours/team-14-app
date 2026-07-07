04 - API Specification

Project Name: WorkerVoice – Migrant Review Platform
Document Version: 1.0.0
Status: Draft
Owner: Backend Team
Last Updated: 2026-07-07

⸻

1. Purpose

This document defines all public and internal REST APIs used by the WorkerVoice platform.

It serves as the contract between:

* Frontend
* Backend
* Telegram Bot
* Future Mobile Application
* Third-party integrations

All APIs must follow this specification unless an Architecture Decision Record (ADR) approves a change.

⸻

2. API Design Principles

The API follows these principles:

* RESTful architecture
* JSON request and response bodies
* Stateless communication
* Consistent response format
* Versioned endpoints
* Secure authentication
* Proper HTTP status codes

⸻

3. Base URL

Development

http://localhost:3000/api

Production

https://api.workervoice.example/api

⸻

4. API Versioning

Current Version

v1

Future versions

/api/v2
/api/v3

Breaking changes require a new API version.

⸻

5. Authentication

Public APIs

Authentication is not required.

Examples

* Company Search
* Company Detail
* Review List
* Articles

Protected APIs

Authentication is required.

Examples

* Submit Review
* Vote Review
* Edit Profile
* Admin APIs

Authentication Method

* Bearer Token
* JWT
* HTTPS only

⸻

6. Standard Response Format

Successful Response

{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}

Error Response

{
  "success": false,
  "message": "Validation failed.",
  "errors": []
}

⸻

7. HTTP Status Codes

Code	Meaning
200	Success
201	Resource Created
204	No Content
400	Bad Request
401	Unauthorized
403	Forbidden
404	Not Found
409	Conflict
422	Validation Error
429	Too Many Requests
500	Internal Server Error

⸻

8. Public APIs

Company Search

GET /api/companies

Purpose

Search companies by keyword.

Authentication

Not Required

Query Parameters

* keyword
* province
* district
* page
* limit

Returns

* Company list
* Pagination

⸻

Company Detail

GET /api/companies/{id}

Purpose

Retrieve company information.

Returns

* Company details
* Average rating
* Review count
* Statistics

⸻

Company Reviews

GET /api/companies/{id}/reviews

Purpose

Retrieve reviews for a company.

Returns

* Reviews
* Pagination

⸻

Agency Search

GET /api/agencies

Purpose

Search recruitment agencies.

⸻

Agency Detail

GET /api/agencies/{id}

Purpose

Retrieve agency information.

⸻

Agency Reviews

GET /api/agencies/{id}/reviews

Purpose

Retrieve agency reviews.

⸻

Articles

GET /api/articles

Purpose

Retrieve worker information articles.

⸻

9. Authentication APIs

Register

POST /api/auth/register

Purpose

Create a new account.

Request

* Email
* Password
* Display Name

⸻

Login

POST /api/auth/login

Purpose

Authenticate user.

Returns

* Access Token
* Refresh Token

⸻

Verify Email

POST /api/auth/verify-email

Purpose

Verify email address.

⸻

Logout

POST /api/auth/logout

Purpose

End user session.

⸻

10. Review APIs

Submit Review

POST /api/reviews

Purpose

Create a new anonymous review.

Authentication

Required

Request

* Company or Agency ID
* Ratings
* Pros
* Cons
* Comment

⸻

Update Review

PUT /api/reviews/{id}

Purpose

Update user’s own review.

⸻

Delete Review

DELETE /api/reviews/{id}

Purpose

Delete user’s own review.

⸻

Vote Review

POST /api/reviews/{id}/vote

Purpose

Vote Useful / Not Useful.

⸻

Report Review

POST /api/reviews/{id}/report

Purpose

Report inappropriate content.

⸻

11. User APIs

Profile

GET /api/profile

Retrieve current user profile.

⸻

PUT /api/profile

Update profile.

⸻

12. Admin APIs

Authentication

Administrator only.

Examples

* Dashboard
* Companies
* Agencies
* Reviews
* Reports
* Articles
* Users

⸻

13. Validation Rules

All APIs must validate:

* Required fields
* Data types
* String length
* Email format
* UUID format
* Pagination values

Invalid requests must return HTTP 422.

⸻

14. Rate Limiting

Recommended limits

Public APIs

* 100 requests/minute/IP

Authentication

* 10 requests/minute/IP

Review Submission

* 5 submissions/hour/user

⸻

15. Error Handling

The API should never expose:

* Stack traces
* SQL queries
* Internal file paths
* Sensitive configuration

Errors should be logged internally while returning user-friendly messages.

⸻

16. Security Requirements

All APIs must:

* Require HTTPS in production
* Validate input
* Use parameterized database queries
* Sanitize user input
* Verify authentication where required
* Enforce authorization rules

⸻

17. Telegram Bot Integration

The Telegram Bot consumes public APIs only.

Supported operations

* Company Search
* Company Detail
* Agency Search
* Review Summary

The Telegram Bot does not call protected administrative endpoints.

⸻

18. Future APIs

Future versions may include:

* Notifications
* Saved Companies
* AI Recommendations
* Mobile Push Services
* Analytics
* Employer Verification

⸻

19. API Lifecycle

New Endpoint

↓

Technical Design Review

↓

Implementation

↓

Testing

↓

Documentation Update

↓

Release

All new endpoints must be documented before deployment.

⸻

20. References

* 01-product-requirements.md
* 02-system-architecture.md
* 03-database-design.md
* 07-security.md
* 09-testing-strategy.md

⸻

21. Change History

Version	Date	Author	Description
1.0.0	2026-07-07	Backend Team	Initial API specification