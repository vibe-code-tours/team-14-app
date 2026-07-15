# Telegram Bot — Vercel Deployment Checklist

> This document lists the **mandatory environment variables** that must be
> configured in Vercel **before** deploying the Telegram bot integration.
> Missing any of these will cause the deployment to fail or the bot to
> malfunction at runtime.

---

## 1. Why Environment Variables Matter

The Telegram bot depends on several external services. Without the correct
configuration, the build may succeed but the bot will fail at runtime, or
the build itself will fail if Prisma cannot connect to the database.

**Common failure symptoms:**

| Symptom | Likely Missing Variable |
|---------|------------------------|
| Build fails with Prisma error | `DATABASE_URL` |
| Bot does not respond | `TELEGRAM_BOT_TOKEN` |
| Webhook returns 401 | `TELEGRAM_WEBHOOK_SECRET` |
| Buttons link to localhost | `NEXT_PUBLIC_SITE_URL` |
| Login/register fails | `AUTH_SECRET`, `AUTH_URL` |
| Emails not sending | `RESEND_API_KEY`, `EMAIL_FROM` |

---

## 2. Required Environment Variables

### Database

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | `postgresql://user:password@host:port/dbname` | **Must be a hosted database** (Supabase, Neon, Railway). Docker `localhost` will NOT work on Vercel. |

### Authentication

| Variable | Value | Notes |
|----------|-------|-------|
| `AUTH_SECRET` | Generate with `npx auth-secret` | JWT signing secret. Never use a plain string. |
| `AUTH_URL` | `https://workervoice.help` | Must match production URL exactly. |

### Application URLs

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_SITE_URL` | `https://workervoice.help` | Used for Telegram bot buttons and deep links. Must be HTTPS. |
| `NEXT_PUBLIC_API_URL` | `https://workervoice.help` | API base URL. |

### Telegram Bot

| Variable | Value | Notes |
|----------|-------|-------|
| `TELEGRAM_BOT_TOKEN` | Token from @BotFather | Format: `123456789:ABCdefGHIjklMNOpqrSTUvwxYZ` |
| `TELEGRAM_WEBHOOK_SECRET` | Generate with `openssl rand -hex 32` | Used to verify webhook requests come from Telegram. |

### Email Service (Resend)

| Variable | Value | Notes |
|----------|-------|-------|
| `RESEND_API_KEY` | API key from Resend dashboard | Used for verification and password reset emails. |
| `EMAIL_FROM` | `no-reply@misehub.jp` | Must be from a verified domain in Resend. |

### Admin

| Variable | Value | Notes |
|----------|-------|-------|
| `ADMIN_KEY` | `YOUR_ADMIN_KEY` | Used for protected admin API routes. |

---

## 3. How to Add Environment Variables in Vercel

### Option A: Vercel Dashboard (Recommended)

1. Go to `https://vercel.com/<team>/<project>/settings/environment-variables`
2. Click **Add New**
3. Enter the variable name and value
4. Select environment: **Production** (and Preview if needed)
5. Click **Save**
6. Repeat for each variable

### Option B: Vercel CLI

```bash
# Link to the correct project first
npx vercel link

# Add each variable
npx vercel env add DATABASE_URL production
npx vercel env add AUTH_SECRET production
npx vercel env add AUTH_URL production
npx vercel env add NEXT_PUBLIC_SITE_URL production
npx vercel env add NEXT_PUBLIC_API_URL production
npx vercel env add TELEGRAM_BOT_TOKEN production
npx vercel env add TELEGRAM_WEBHOOK_SECRET production
npx vercel env add RESEND_API_KEY production
npx vercel env add EMAIL_FROM production
npx vercel env add ADMIN_KEY production
```

---

## 4. After Adding Environment Variables

### Step 1: Redeploy

Environment variables do NOT auto-redeploy. You must trigger a new deployment:

- **Dashboard:** Go to Deployments → click the failed one → click **Redeploy**
- **CLI:** `npx vercel --prod`
- **Git:** Push a new commit to the main branch

### Step 2: Set Telegram Webhook

After successful deployment, set the webhook so Telegram sends updates to
your bot:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://workervoice.help/api/telegram/webhook"}'
```

Verify webhook is set:

```bash
curl "https://api.telegram.org/bot<YOUR_TOKEN>/getWebhookInfo"
```

### Step 3: Verify

- [ ] Visit `https://workervoice.help` — page loads
- [ ] Send `/start` to bot — welcome message appears
- [ ] Send `/company စက်ရုံ` — search results with buttons appear
- [ ] Click a detail button — opens factory page
- [ ] Test language switch — works

---

## 5. Troubleshooting

### Build fails with "Can't reach database server"

**Cause:** `DATABASE_URL` points to `localhost` or is missing.

**Fix:** Use a hosted PostgreSQL connection string (Supabase, Neon, Railway).
Docker databases are not accessible from Vercel.

---

### Build fails with "@prisma/client did not initialize"

**Cause:** `prisma generate` did not run during build.

**Fix:** Ensure the build command in Vercel is:
```
npx prisma generate && next build
```

---

### Bot does not respond to commands

**Cause:** Webhook not set or `TELEGRAM_BOT_TOKEN` is wrong.

**Fix:**
1. Verify token: `curl "https://api.telegram.org/bot<TOKEN>/getMe"`
2. Set webhook (see Step 2 above)
3. Check Vercel function logs for errors

---

### Buttons link to localhost instead of production

**Cause:** `NEXT_PUBLIC_SITE_URL` is set to `http://localhost:3000`.

**Fix:** Set `NEXT_PUBLIC_SITE_URL` to `https://workervoice.help` in Vercel
and redeploy.

---

### Webhook returns 401 Unauthorized

**Cause:** `TELEGRAM_WEBHOOK_SECRET` does not match what was set in Telegram.

**Fix:**
1. Regenerate: `openssl rand -hex 32`
2. Update in Vercel environment variables
3. Redeploy
4. Re-set webhook with the new URL

---

## 6. Environment Variables Quick Copy

For convenience, here are all values to copy into Vercel:

```
DATABASE_URL=postgresql://migrant_user:YOUR_DATABASE_PASSWORD@localhost:5432/migrant_review_db
AUTH_SECRET=generate-with-npx-auth-secret
AUTH_URL=https://workervoice.help
NEXT_PUBLIC_SITE_URL=https://workervoice.help
NEXT_PUBLIC_API_URL=https://workervoice.help
TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
TELEGRAM_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET
RESEND_API_KEY=YOUR_RESEND_API_KEY
EMAIL_FROM=no-reply@misehub.jp
ADMIN_KEY=YOUR_ADMIN_KEY
```

> **IMPORTANT:** `DATABASE_URL` above uses `localhost` for reference only.
> Replace with your actual hosted PostgreSQL connection string before
> deploying to Vercel.

---

## 7. Change History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0.0 | 2026-07-15 | Engineering Team | Initial Telegram deployment checklist |
