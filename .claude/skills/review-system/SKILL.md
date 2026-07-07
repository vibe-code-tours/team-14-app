---
name: review-system
description: Business workflow for anonymous worker reviews.
---

# Purpose

Implement and maintain the WorkerVoice review system.

## Use When

- Creating review features
- Updating review logic
- Moderation
- Rating calculation
- Voting

## Responsibilities

- Anonymous Reviews
- Ratings
- Useful / Not Useful
- Moderation
- Spam Detection
- Review Statistics

## Standards

Always:

- Protect worker privacy
- Validate review input
- Prevent spam
- Support moderation
- Update statistics

Never:

- Reveal reviewer identity
- Allow duplicate voting
- Delete reviews without audit

## Workflow

Review Submitted

↓

Validation

↓

Spam Check

↓

Store Review

↓

Update Statistics

↓

Display

## Best Practices

- Anonymous by default
- Transparent moderation
- Fair rating calculation

## Definition of Done

- Review stored
- Statistics updated
- Privacy protected
- Validation completed

## References

docs/project/requirements.md
