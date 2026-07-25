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
import { t, tParams, getUserLocale, setUserProvince, clearUserProvince } from "@/lib/telegram/i18n";

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
    const chatId = ctx.chat?.id;
    const locale = getUserLocale(chatId || 0);

    // Match the same provinces as the web UI FactoryFilters component
    const provinceKeyboard = {
      inline_keyboard: [
        [{ text: t(locale, "allRegions"), callback_data: "province_all" }],
        [{ text: "🏙️ Bangkok", callback_data: "province_Bangkok" }],
        [{ text: "🏙️ Chonburi", callback_data: "province_Chonburi" }],
        [{ text: "🏙️ Rayong", callback_data: "province_Rayong" }],
        [{ text: "🏙️ Samut Prakan", callback_data: "province_Samut Prakan" }],
        [{ text: "🏙️ Pathum Thani", callback_data: "province_Pathum Thani" }],
        [{ text: "🏙️ Nakhon Ratchasima", callback_data: "province_Nakhon Ratchasima" }],
        [{ text: "🏙️ Chiang Mai", callback_data: "province_Chiang Mai" }],
        [{ text: "🏙️ Khon Kaen", callback_data: "province_Khon Kaen" }],
        [{ text: "🏙️ Hat Yai (Songkhla)", callback_data: "province_Hat Yai (Songkhla)" }],
        [{ text: t(locale, "backButton"), callback_data: "back_main" }],
      ],
    };

    const provincePrompt =
      `━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `<b>${t(locale, "selectRegionPrompt")}</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `${t(locale, "whichRegionPrompt")}`;

    await ctx.reply(provincePrompt, {
      parse_mode: "HTML",
      reply_markup: provinceKeyboard,
    });
  });

  // Province selection handler — store province and show region search prompt
  bot.callbackQuery(/^province_(.+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    const province = ctx.match?.[1];
    const chatId = ctx.chat?.id;
    if (!province || !chatId) return;

    const locale = getUserLocale(chatId);

    if (province === "all") {
      clearUserProvince(chatId);
      await ctx.reply(tParams(locale, "searchPrompt"), { parse_mode: "HTML" });
      return;
    }

    // Store the selected province so subsequent text searches filter by region
    setUserProvince(chatId, province);

    // Show the region search prompt instead of directly listing companies
    await ctx.reply(tParams(locale, "regionPrompt", province), {
      parse_mode: "HTML",
    });
  });

  bot.callbackQuery("back_main", async (ctx: any) => {
    await ctx.answerCallbackQuery();
    const chatId = ctx.chat?.id;
    const locale = getUserLocale(chatId || 0);
    if (chatId) clearUserProvince(chatId);
    const { getMainMenuKeyboard } = await import("@/lib/telegram/keyboards/main-menu");
    const firstName = ctx.from?.first_name || "User";
    const welcomeText = tParams(locale, "welcome", firstName);
    await ctx.reply(welcomeText, {
      parse_mode: "HTML",
      reply_markup: getMainMenuKeyboard(locale),
    });
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
