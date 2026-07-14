/**
 * Telegram Bot using grammy
 * https://grammy.dev/
 */

import { Bot } from "grammy";

// ============================================================
// Bot Instance
// ============================================================

function createBot(): Bot {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  }
  return new Bot(token);
}

// Create bot instance at module scope for serverless warm starts
export const bot = createBot();

// Initialize bot (required for grammy to work)
let botInitialized = false;

export async function ensureBotInitialized(): Promise<void> {
  if (!botInitialized) {
    await bot.init();
    botInitialized = true;
    console.log("✅ Bot initialized");
  }
}

// ============================================================
// Helpers
// ============================================================

/**
 * Get the base URL for the WorkerVoice site (trailing slash stripped)
 */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

/**
 * Build a deep link URL to open a company page
 */
export function getCompanyUrl(companyId: number): string {
  return `${getSiteUrl()}/factories/${companyId}`;
}

/**
 * Build a deep link URL to open an agency page
 */
export function getAgencyUrl(agencyId: number): string {
  return `${getSiteUrl()}/agencies/${agencyId}`;
}

/**
 * Escape HTML special characters for Telegram
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
