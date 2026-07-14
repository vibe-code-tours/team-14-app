/**
 * Telegram webhook verification
 * Verifies that requests actually come from Telegram
 */

/**
 * Verify the webhook secret token from Telegram
 * Telegram sends this in X-Telegram-Bot-Api-Secret-Token header
 *
 * @see https://core.telegram.org/bots/api#setwebhook
 */
export function verifyWebhookSecret(secretToken: string | null): boolean {
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (!expectedSecret) {
    console.error("TELEGRAM_WEBHOOK_SECRET is not configured");
    return false;
  }

  if (!secretToken) {
    return false;
  }

  // Constant-time comparison to prevent timing attacks
  if (secretToken.length !== expectedSecret.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < secretToken.length; i++) {
    result |= secretToken.charCodeAt(i) ^ expectedSecret.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Validate that the update is a valid Telegram update
 */
export function isValidTelegramUpdate(update: unknown): boolean {
  if (!update || typeof update !== "object") {
    return false;
  }

  const obj = update as Record<string, unknown>;

  // Must have update_id
  if (typeof obj.update_id !== "number") {
    return false;
  }

  // Must have message (we only handle messages for now)
  if (!obj.message || typeof obj.message !== "object") {
    return false;
  }

  const message = obj.message as Record<string, unknown>;

  // Message must have chat with id
  if (!message.chat || typeof message.chat !== "object") {
    return false;
  }

  const chat = message.chat as Record<string, unknown>;
  if (typeof chat.id !== "number") {
    return false;
  }

  return true;
}

/**
 * Rate limiting check (simple in-memory for now)
 * In production, use Redis or database-backed rate limiting
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  maxRequests = 30,
  windowMs = 60000
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

/**
 * Clean up expired rate limit entries (call periodically)
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  const entries = Array.from(rateLimitMap.entries());
  for (const [key, entry] of entries) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}

// Clean up every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupRateLimits, 5 * 60 * 1000);
}
