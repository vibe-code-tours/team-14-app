# Telegram Bot Deployment Guide

## Overview

The WorkerVoice Telegram Bot supports:
- 🇺🇸 English and 🇲🇲 Myanmar (Burmese) languages
- Company search with real-time results
- Deep links from web to Telegram
- Vercel deployment (serverless functions)

---

## Quick Start (Local Development)

### 1. Start the Bot

```bash
# Option A: Polling mode (recommended for development)
npx tsx scripts/telegram-poll-v3.ts

# Option B: Webhook mode (requires ngrok)
ngrok http 3000
npx tsx scripts/setup-telegram-webhook.ts https://your-ngrok-url.ngrok.io
npm run dev
```

### 2. Test the Bot

Open Telegram → Search `@WorkVoice26_bot` → Send `/start`

---

## Vercel Deployment

### Step 1: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Step 2: Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `TELEGRAM_BOT_TOKEN` | `8769025500:AA...` | Bot token from BotFather |
| `TELEGRAM_WEBHOOK_SECRET` | `ea968a84...` | Random secret for webhook |
| `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` | Your Vercel URL |
| `DATABASE_URL` | `postgresql://...` | Your database URL |
| `AUTH_SECRET` | `your-secret` | Auth.js secret |

### Step 3: Set Webhook

```bash
# Set webhook to your Vercel URL
curl -X POST "https://api.telegram.org/botYOUR_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-app.vercel.app/api/telegram/webhook",
    "secret_token": "YOUR_WEBHOOK_SECRET",
    "allowed_updates": ["message"]
  }'
```

Or use the setup script:

```bash
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app \
  npx tsx scripts/setup-telegram-webhook.ts
```

### Step 4: Verify Webhook

```bash
curl "https://api.telegram.org/botYOUR_TOKEN/getWebhookInfo"
```

Expected response:
```json
{
  "ok": true,
  "result": {
    "url": "https://your-app.vercel.app/api/telegram/webhook",
    "has_custom_certificate": false,
    "pending_update_count": 0
  }
}
```

---

## Bot Commands

| Command | Description | Language |
|---------|-------------|----------|
| `/start` | Start the bot | EN/MY |
| `/help` | Show help | EN/MY |
| `/company <name>` | Search companies | EN/MY |
| `/lang` | Change language | EN/MY |
| `/lang_en` | Set English | - |
| `/lang_my` | Set Myanmar | - |

---

## Language Support

The bot automatically detects Myanmar script and responds in Myanmar.

### Manual Language Switch

User sends:
- `/lang` → Shows language selection
- `/lang_en` → Switches to English
- `/lang_my` → Switches to Myanmar

### Supported Languages

| Feature | English | Myanmar |
|---------|---------|---------|
| Welcome message | ✅ | ✅ |
| Help text | ✅ | ✅ |
| Search prompts | ✅ | ✅ |
| Error messages | ✅ | ✅ |
| Menu buttons | ✅ | ✅ |

---

## Architecture

### Local Development

```
User → Telegram → Polling Script → Local API → Database
```

### Vercel Production

```
User → Telegram → Vercel Webhook → Serverless Function → Database
```

### File Structure

```
app/api/telegram/webhook/route.ts  ← Webhook endpoint (Vercel)
scripts/telegram-poll-v3.ts        ← Polling script (local dev)
lib/telegram/
  bot.ts                           ← Bot API utilities
  formatters.ts                    ← Message formatting
  i18n.ts                          ← Language support (EN/MY)
  verify.ts                        ← Webhook verification
  index.ts                         ← Module exports
```

---

## Troubleshooting

### Bot not responding

1. Check webhook status:
   ```bash
   curl "https://api.telegram.org/botYOUR_TOKEN/getWebhookInfo"
   ```

2. Check Vercel logs in Dashboard → Functions → Logs

3. Verify environment variables are set

### "Conflict: terminated by other getUpdates"

Only one bot instance can run at a time. Stop polling before starting webhook.

### Messages not sending

1. Check bot token is valid
2. Verify `TELEGRAM_WEBHOOK_SECRET` matches
3. Check Vercel function logs for errors

---

## Security

- Webhook secret token verification
- Rate limiting (30 requests/minute/chat)
- No sensitive data in responses
- HTTPS required for production

---

## Next Steps

- [ ] Add agency search support
- [ ] Implement Telegram Login
- [ ] Add Mini App for rich UI
- [ ] Add push notifications
