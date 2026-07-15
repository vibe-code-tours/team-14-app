# Telegram Bot Development Guide

> Complete guide for WorkerVoice Telegram Bot development, testing, and troubleshooting.

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Architecture Overview](#architecture-overview)
3. [Quick Start](#quick-start)
4. [Environment Variables](#environment-variables)
5. [Bot Features](#bot-features)
6. [Development Workflow](#development-workflow)
7. [Troubleshooting](#troubleshooting)
8. [Deployment](#deployment)
9. [API Reference](#api-reference)

---

## Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 24.16.0 | Runtime environment |
| **TypeScript** | 5.9.3 | Type-safe JavaScript |
| **Next.js** | 16.2.10 | React framework with App Router |
| **grammy** | Latest | Telegram Bot framework |

### Database & ORM

| Technology | Version | Purpose |
|------------|---------|---------|
| **PostgreSQL** | 16 | Primary database |
| **Prisma** | 7.8.0 | Database ORM |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Docker** | Containerized development |
| **ngrok** | HTTPS tunnel for local development |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |

### Deployment

| Platform | Purpose |
|----------|---------|
| **Vercel** | Serverless deployment |
| **Supabase** | Managed PostgreSQL |

---

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER (Telegram)                          │
│  1. Opens Telegram                                              │
│  2. Searches for @WorkVoice26_bot                               │
│  3. Sends command or message                                    │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     TELEGRAM SERVERS                            │
│  • Receives message from user                                   │
│  • Sends update to your webhook                                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                  YOUR BOT (grammy + Next.js)                    │
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │ Webhook      │    │ grammy Bot   │    │  Commands    │       │
│  │ Endpoint     │───▶│ Handler      │───▶│  & Callbacks │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│                                                                 │
│  1. Receives webhook from Telegram                              │
│  2. Verifies webhook secret                                     │
│  3. Routes to appropriate command handler                       │
│  4. Sends response back to Telegram                             │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE (PostgreSQL)                     │
│                                                                 │
│  • Searches factories by name, province, district               │
│  • Gets review statistics                                       │
│  • Returns company data                                         │
└─────────────────────────────────────────────────────────────────┘
```

### Bot Flow

```
User sends /start
       │
       ▼
Telegram sends webhook to your server
       │
       ▼
Next.js Route Handler receives update
       │
       ▼
grammy processes the update
       │
       ▼
/start command handler runs
       │
       ▼
Bot sends welcome message with menu buttons
       │
       ▼
User sees response in Telegram
```

---

## Quick Start

### Prerequisites

- Node.js 24.x
- Docker & Docker Compose
- ngrok (for local HTTPS)
- Telegram account

### 1. Start Services

```bash
# Start Docker (PostgreSQL + App)
docker compose up -d

# Start ngrok (for HTTPS tunnel)
ngrok http 3000
```

### 2. Get ngrok HTTPS URL

```bash
curl -s http://localhost:4040/api/tunnels | python3 -c "import sys, json; print(json.load(sys.stdin)['tunnels'][0]['public_url'])"
```

Example output: `https://heading-request-ooze.ngrok-free.dev`

### 3. Update `.env`

```bash
# Replace with your ngrok URL
NEXT_PUBLIC_SITE_URL=https://your-ngrok-url.ngrok-free.dev
NEXT_PUBLIC_API_URL=https://your-ngrok-url.ngrok-free.dev
```

### 4. Set Webhook

```bash
curl -X POST "https://api.telegram.org/botYOUR_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-ngrok-url.ngrok-free.dev/api/telegram/webhook",
    "secret_token": "YOUR_WEBHOOK_SECRET",
    "allowed_updates": ["message", "callback_query"]
  }'
```

### 5. Test in Telegram

Open Telegram → Find your bot → Send `/start`

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `TELEGRAM_BOT_TOKEN` | Bot token from BotFather | `your-telegram-bot-token` |
| `TELEGRAM_WEBHOOK_SECRET` | Secret for webhook verification | `ea968a84...` |
| `NEXT_PUBLIC_SITE_URL` | Website URL for button links | `https://workervoice.help` |
| `NEXT_PUBLIC_API_URL` | API URL for bot queries | `https://workervoice.help` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `AUTH_SECRET` | Auth.js secret key | - |
| `AUTH_URL` | Auth.js callback URL | `http://localhost:3000` |
| `RESEND_API_KEY` | Email service API key | - |
| `EMAIL_FROM` | Sender email address | - |

### Important Notes

- `NEXT_PUBLIC_SITE_URL` must be **HTTPS** for Telegram URL buttons to work
- For local development, use **ngrok** to get an HTTPS URL
- For production, use your **Vercel deployment URL**
- Never commit `.env` to version control

---

## Bot Features

### Supported Languages

| Language | Code | Default |
|----------|------|---------|
| English | `en` | No |
| Myanmar (Burmese) | `my` | Yes |

### Bot Commands

| Command | Description |
|---------|-------------|
| `/start` | Welcome message + main menu |
| `/help` | Show help text |
| `/company <name>` | Search companies |
| `/lang` | Change language |

### Menu Buttons

| Button | Type | Action |
|--------|------|--------|
| 🔍 ကုမ္ပဏီ ရှာဖွေရန် | Callback | Search company |
| 🌐 ဘာသာစကား ရွေးချယ်ရန် | Callback | Change language |
| ❓ အသုံးပြုနည်း | Callback | Show help |
| 👤 အကောင့်ဖွင့်ရန် | URL | Open register page |
| 📧 ဆက်သွယ်ရန် | URL | Open contact page |

### Button Types

**Callback Buttons:**
- Trigger bot action when clicked
- Send data back to bot for processing
- Used for: Search, Language, Help

**URL Buttons:**
- Open website directly in Telegram browser
- Require HTTPS URL
- Used for: Register, Contact

---

## Development Workflow

### Local Development (with Docker)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Telegram   │────▶│    ngrok    │────▶│   Docker    │
│   Servers    │     │  (HTTPS)    │     │  (localhost) │
└─────────────┘     └─────────────┘     └─────────────┘
```

**Steps:**
1. Start Docker containers
2. Start ngrok for HTTPS tunnel
3. Update `.env` with ngrok URL
4. Set webhook to ngrok URL
5. Test bot in Telegram

### Production (Vercel)

```
┌─────────────┐     ┌─────────────┐
│   Telegram   │────▶│   Vercel    │
│   Servers    │     │  (HTTPS)    │
└─────────────┘     └─────────────┘
```

**Steps:**
1. Deploy to Vercel
2. Set environment variables
3. Set webhook to Vercel URL
4. Test bot in Telegram

---

## Troubleshooting

### Problem: `/start` not working

**Check webhook status:**
```bash
curl -s "https://api.telegram.org/botYOUR_TOKEN/getWebhookInfo" | python3 -m json.tool
```

**Common issues:**
- `url: ""` → Webhook not set
- `pending_update_count > 0` → Updates stuck
- `last_error_message` shows error → Check error below

---

### Problem: "Bad Request: inline keyboard button URL is invalid"

**Cause:** URL button uses HTTP instead of HTTPS

**Solution:**
```bash
# Check your NEXT_PUBLIC_SITE_URL
grep NEXT_PUBLIC_SITE_URL .env

# Should start with https://, not http://
# Update to ngrok or production URL
```

---

### Problem: "502 Bad Gateway"

**Cause:** ngrok stopped or Docker not running

**Solution:**
```bash
# Check if ngrok is running
ps aux | grep ngrok

# Restart ngrok if stopped
ngrok http 3000

# Check if Docker is running
docker compose ps

# Restart Docker if stopped
docker compose up -d
```

---

### Problem: "404 Not Found"

**Cause:** Webhook URL points to wrong server

**Solution:**
```bash
# Check current webhook URL
curl -s "https://api.telegram.org/botYOUR_TOKEN/getWebhookInfo" | python3 -m json.tool

# Update webhook to correct URL
curl -X POST "https://api.telegram.org/botYOUR_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "YOUR_CORRECT_URL/api/telegram/webhook", "allowed_updates": ["message", "callback_query"]}'
```

---

### Problem: Buttons not responding

**Cause:** `callback_query` not in allowed_updates

**Solution:**
```bash
# Re-set webhook with callback_query
curl -X POST "https://api.telegram.org/botYOUR_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "YOUR_URL/api/telegram/webhook",
    "allowed_updates": ["message", "callback_query"]
  }'
```

---

### Problem: Docker not picking up `.env` changes

**Solution:**
```bash
# Rebuild Docker container
docker compose down
docker compose up -d --build
```

---

### Problem: "Bot not initialized" error

**Cause:** grammy bot not initialized before handling updates

**Solution:** Ensure `bot.init()` is called before `bot.handleUpdate()`

---

## Deployment

### To Vercel

```bash
# Deploy to Vercel
vercel --prod

# Set webhook to Vercel URL
curl -X POST "https://api.telegram.org/botYOUR_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-app.vercel.app/api/telegram/webhook",
    "secret_token": "YOUR_SECRET",
    "allowed_updates": ["message", "callback_query"]
  }'
```

### Update `.env` for Production

```bash
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
NEXT_PUBLIC_API_URL=https://your-app.vercel.app
```

---

## API Reference

### Telegram Bot API

- [Bot API Documentation](https://core.telegram.org/bots/api)
- [grammy Documentation](https://grammy.dev/)

### Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/telegram/webhook` | POST | Receives Telegram updates |
| `/api/telegram/webhook` | GET | Health check endpoint |

### Webhook Payload

```json
{
  "update_id": 123456789,
  "message": {
    "message_id": 1,
    "from": {
      "id": 123456,
      "first_name": "User"
    },
    "chat": {
      "id": 123456,
      "type": "private"
    },
    "text": "/start",
    "date": 1784000000
  }
}
```

### Callback Query Payload

```json
{
  "update_id": 123456790,
  "callback_query": {
    "id": "123456789",
    "from": {
      "id": 123456,
      "first_name": "User"
    },
    "message": {
      "chat": {
        "id": 123456
      }
    },
    "data": "search_company"
  }
}
```

---

## Useful Commands

```bash
# Check webhook info
curl -s "https://api.telegram.org/botYOUR_TOKEN/getWebhookInfo" | python3 -m json.tool

# Delete webhook
curl -X POST "https://api.telegram.org/botYOUR_TOKEN/deleteWebhook"

# Send test message
curl -X POST "https://api.telegram.org/botYOUR_TOKEN/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{"chat_id": YOUR_CHAT_ID, "text": "Test message"}'

# Check Docker logs
docker compose logs app --tail 50

# Restart Docker
docker compose down && docker compose up -d

# Rebuild Docker
docker compose down && docker compose up -d --build
```

---

## File Structure

```
lib/telegram/
├── bot.ts                    # grammy Bot instance
├── i18n.ts                   # Translations (EN/MY)
├── commands/
│   ├── start.ts             # /start command
│   ├── help.ts              # /help command
│   ├── search.ts            # /company search
│   └── language.ts          # Language switch
├── keyboards/
│   ├── main-menu.ts         # Main menu keyboard
│   └── language.ts          # Language selection
└── index.ts                 # Module exports

app/api/telegram/
└── webhook/
    └── route.ts             # Webhook handler
```

---

## Additional Resources

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [grammy Documentation](https://grammy.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Docker Documentation](https://docs.docker.com/)
- [ngrok Documentation](https://ngrok.com/docs)
