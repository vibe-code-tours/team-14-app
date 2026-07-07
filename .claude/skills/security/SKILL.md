---
name: security
description: Security standards for WorkerVoice.
---

# Purpose

Protect users, reviews, and infrastructure.

## Use When

- Authentication
- Authorization
- API development
- Deployment
- Security review

## Responsibilities

- JWT
- Authentication
- Authorization
- Validation
- OWASP
- Privacy
- Rate Limiting

## Standards

Always:

- Validate input
- Sanitize output
- Protect secrets
- Use HTTPS
- Hash passwords

Never:

- Commit secrets
- Trust client input
- Expose internal errors

## Workflow

Implementation

↓

Security Review

↓

OWASP Review

↓

Fix Findings

↓

Done

## Definition of Done

- Input validated
- Authorization checked
- Secrets protected
- Rate limiting configured

## References

docs/operations/security.md
