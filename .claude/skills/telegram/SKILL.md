---
name: telegram
description: Telegram Bot and Mini App integration standards.
---

# Purpose

Provide a consistent Telegram experience.

## Use When

- Telegram Bot
- Mini App
- Webhooks
- Notifications
- Deep Links

## Responsibilities

- Telegram Bot API
- Webhooks
- Mini App
- Authentication
- Notifications

## Standards

Always:

- Verify Telegram user
- Validate webhook payloads
- Protect user privacy

Never:

- Expose sensitive data
- Trust incoming payloads

## Workflow

Telegram User

↓

Bot

↓

Webhook

↓

Backend

↓

Database

↓

Response

## Definition of Done

- Webhook verified
- Deep links tested
- Authentication reviewed

## References

docs/project/requirements.md
