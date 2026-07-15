/**
 * Telegram Bot Webhook Endpoint (grammy + Vercel)
 *
 * This endpoint receives updates from Telegram servers.
 * Uses grammy bot directly with manual update handling.
 *
 * @see https://grammy.dev/hosting/vercel
 */

import { NextRequest, NextResponse } from "next/server";
import { getBot, ensureBotInitialized } from "@/lib/telegram/bot";
import {
  startCommand,
  helpCommand,
  companyCommand,
  textSearchHandler,
  langCommand,
  languageCallback,
} from "@/lib/telegram";
import { t, tParams, getUserLocale } from "@/lib/telegram/i18n";

// ============================================================
// Register bot commands and handlers (called lazily, not at import)
// ============================================================

let handlersRegistered = false;

function registerHandlers() {
  if (handlersRegistered) return;
  handlersRegistered = true;

  const bot = getBot();

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

    const regionKeyboard = {
      inline_keyboard: [
        [{ text: "🌏 အားလုံး", callback_data: "region_all" }],
        [
          { text: "🏙️ Bangkok & Central", callback_data: "region_Bangkok_and_Central" },
        ],
        [{ text: "🌅 Eastern", callback_data: "region_Eastern" }],
        [{ text: "🌿 Northern", callback_data: "region_Northern" }],
        [{ text: "🌾 Northeastern", callback_data: "region_Northeastern" }],
        [{ text: "🌊 Western", callback_data: "region_Western" }],
        [{ text: "🏝️ Southern", callback_data: "region_Southern" }],
      ],
    };

    const regionPrompt =
      `━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🌏 <b>ဒေသရွေးချယ်ပါ</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `ဘယ်ဒေသက ကုမ္ပဏီတွေကို ရှာဖွေချင်ပါသလဲ?`;

    await ctx.reply(regionPrompt, {
      parse_mode: "HTML",
      reply_markup: regionKeyboard,
    });
  });

  // Region selection handlers
  const regionNames: Record<string, string> = {
    region_all: "အားလုံး",
    region_Bangkok_and_Central: "Bangkok & Central",
    region_Eastern: "Eastern",
    region_Northern: "Northern",
    region_Northeastern: "Northeastern",
    region_Western: "Western",
    region_Southern: "Southern",
  };

  bot.callbackQuery(/^region_(.+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    const region = ctx.match?.[1];
    const regionName = regionNames[`region_${region}`] || region;
    const locale = getUserLocale(ctx.chat?.id || 0);

    await ctx.reply(tParams(locale, "regionPrompt", regionName), { parse_mode: "HTML" });
  });

  bot.callbackQuery("search_agency", async (ctx) => {
    await ctx.answerCallbackQuery();
    const locale = getUserLocale(ctx.chat?.id || 0);
    await ctx.reply(t(locale, "agencyComingSoon"));
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
}

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

    // Ensure bot is initialized and handlers registered
    await ensureBotInitialized();
    registerHandlers();

    // Parse the update
    const update = await req.json();

    // Process the update with grammy
    await getBot().handleUpdate(update);

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
