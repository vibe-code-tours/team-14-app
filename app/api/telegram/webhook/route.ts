/**
 * Telegram Bot Webhook Endpoint (grammy + Vercel)
 *
 * This endpoint receives updates from Telegram servers.
 * Uses grammy bot directly with manual update handling.
 *
 * @see https://grammy.dev/hosting/vercel
 */

import { NextRequest, NextResponse } from "next/server";
import { bot, ensureBotInitialized } from "@/lib/telegram/bot";
import {
  startCommand,
  helpCommand,
  companyCommand,
  textSearchHandler,
  langCommand,
  languageCallback,
} from "@/lib/telegram";
import { t, getUserLocale } from "@/lib/telegram/i18n";

// ============================================================
// Register bot commands and handlers
// ============================================================

// Commands
bot.command("start", startCommand);
bot.command("help", helpCommand);
bot.command("company", companyCommand);
bot.command("lang", langCommand);
bot.command("language", langCommand);

// Callback queries (inline keyboard buttons)
bot.callbackQuery("search_company", async (ctx) => {
  await ctx.answerCallbackQuery();
  const locale = getUserLocale(ctx.chat?.id || 0);
  await ctx.reply(t(locale, "searchPrompt"));
});

bot.callbackQuery("search_agency", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("🚧 Agency search coming soon!");
});

bot.callbackQuery("help", async (ctx) => {
  await ctx.answerCallbackQuery();
  await helpCommand(ctx);
});

bot.callbackQuery("language", langCommand);
bot.callbackQuery("lang_en", languageCallback);
bot.callbackQuery("lang_my", languageCallback);

// Plain text messages (treat as search)
bot.on("message:text", textSearchHandler);

// ============================================================
// Verify webhook secret
// ============================================================

function verifyWebhookSecret(req: NextRequest): boolean {
  const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secretToken) return true; // Skip verification if no secret configured

  const receivedSecret = req.headers.get("X-Telegram-Bot-Api-Secret-Token");
  return receivedSecret === secretToken;
}

// ============================================================
// POST /api/telegram/webhook
// ============================================================

export async function POST(req: NextRequest) {
  try {
    // Verify webhook secret
    if (!verifyWebhookSecret(req)) {
      console.error("Invalid webhook secret");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure bot is initialized
    await ensureBotInitialized();

    // Parse the update
    const update = await req.json();

    // Process the update with grammy
    await bot.handleUpdate(update);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    // Always return 200 to Telegram to prevent retries
    return NextResponse.json({ ok: true });
  }
}

// ============================================================
// GET /api/telegram/webhook (for testing)
// ============================================================

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Telegram webhook is active (grammy + Vercel)",
    timestamp: new Date().toISOString(),
  });
}
