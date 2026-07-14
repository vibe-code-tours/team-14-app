/**
 * Telegram Bot Webhook Endpoint (Vercel-ready)
 *
 * Features:
 * - Myanmar and English language support
 * - Vercel serverless function compatible
 * - Direct database queries (no external API calls)
 *
 * @see https://core.telegram.org/bots/api#setwebhook
 */

import { NextRequest, NextResponse } from "next/server";
import {
  verifyWebhookSecret,
  isValidTelegramUpdate,
  checkRateLimit,
  sendMessage,
  sendTypingAction,
  getCompanyUrl,
  type Locale,
} from "@/lib/telegram";
import {
  formatCompanyWithReviews,
  getCompanyActionButtons,
} from "@/lib/telegram/formatters";
import {
  t,
  tParams,
  tMenu,
  getUserLocale,
  setUserLocale,
} from "@/lib/telegram/i18n";
import { prisma } from "@/lib/prisma";
import type { TelegramUpdate, TelegramMessage } from "@/lib/telegram";

// ============================================================
// POST /api/telegram/webhook
// ============================================================

export async function POST(req: NextRequest) {
  try {
    // 1. Verify webhook secret
    const secretToken = req.headers.get("X-Telegram-Bot-Api-Secret-Token");
    if (!verifyWebhookSecret(secretToken)) {
      console.error("Invalid webhook secret");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse the update
    const update = await req.json();

    // 3. Handle message
    if (update.message) {
      const chatId = update.message.chat.id;
      if (!checkRateLimit(`chat:${chatId}`)) {
        return NextResponse.json({ ok: true });
      }
      await handleMessage(update.message);
    }

    // 4. Handle callback query (inline keyboard buttons)
    if (update.callback_query) {
      await handleCallbackQuery(update.callback_query);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ ok: true }); // Always return 200 to Telegram
  }
}

// ============================================================
// GET /api/telegram/webhook (for testing)
// ============================================================

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Telegram webhook is active (v3 - Myanmar/English)",
    timestamp: new Date().toISOString(),
  });
}

// ============================================================
// Message Handler
// ============================================================

async function handleMessage(message: TelegramMessage): Promise<void> {
  const chatId = message.chat.id;
  const text = message.text?.trim();
  const firstName = message.from?.first_name || "User";

  if (!text) return;

  // Get user's language preference
  const locale = getUserLocale(chatId);

  await sendTypingAction(chatId);

  // Route to command handler
  if (text === "/start") {
    await handleStart(chatId, firstName, text, locale);
  } else if (text === "/help") {
    await handleHelp(chatId, locale);
  } else if (text === "/lang" || text === "/language") {
    await handleLanguage(chatId, locale);
  } else if (text === "/lang_en") {
    await handleSetLanguage(chatId, "en");
  } else if (text === "/lang_my") {
    await handleSetLanguage(chatId, "my");
  } else if (text === "/company") {
    await sendMessage(chatId, t(locale, "searchPrompt"));
  } else if (text.startsWith("/company ")) {
    const query = text.slice(9).trim();
    await handleCompanySearch(chatId, query, locale);
  } else if (text.startsWith("?start=")) {
    await handleDeepLink(chatId, text.slice(7), locale);
  } else {
    // Default: treat as company search
    await handleCompanySearch(chatId, text, locale);
  }
}

// ============================================================
// Callback Query Handler (for inline keyboard buttons)
// ============================================================

async function handleCallbackQuery(callbackQuery: any): Promise<void> {
  const chatId = callbackQuery.message?.chat?.id;
  const data = callbackQuery.data;

  if (!chatId || !data) return;

  // Answer the callback query to remove loading indicator
  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callback_query_id: callbackQuery.id }),
    }
  );

  const locale = getUserLocale(chatId);

  // Route callback data
  if (data === "search_company") {
    await sendMessage(chatId, t(locale, "searchPrompt"));
  } else if (data === "search_agency") {
    await sendMessage(chatId, "🚧 Agency search coming soon!");
  } else if (data === "help") {
    const helpText = t(locale, "help");
    await sendMessage(chatId, helpText, { parse_mode: "HTML" });
  } else if (data === "language") {
    await handleLanguage(chatId, locale);
  } else if (data === "lang_en") {
    await handleSetLanguage(chatId, "en");
  } else if (data === "lang_my") {
    await handleSetLanguage(chatId, "my");
  }
}

// ============================================================
// Command Handlers
// ============================================================

async function handleStart(
  chatId: number,
  firstName: string,
  fullText: string,
  locale: Locale
): Promise<void> {
  // Check for deep link payload
  const payload = fullText.replace("/start ", "").replace("/start", "").trim();

  if (payload) {
    await handleDeepLink(chatId, payload, locale);
    return;
  }

  const welcomeText = tParams(locale, "welcome", firstName);
  const keyboard = getMainMenuButtonsLocal(locale);

  await sendMessage(chatId, welcomeText, {
    parse_mode: "HTML",
    reply_markup: { inline_keyboard: keyboard },
  });
}

async function handleHelp(chatId: number, locale: Locale): Promise<void> {
  const helpText = t(locale, "help");
  await sendMessage(chatId, helpText, { parse_mode: "HTML" });
}

async function handleLanguage(chatId: number, currentLocale: Locale): Promise<void> {
  const text = t(currentLocale, "languagePrompt");

  const keyboard = [
    [
      { text: "🇺🇸 English", callback_data: "lang_en" },
      { text: "🇲🇲 မြန်မာ", callback_data: "lang_my" },
    ],
  ];

  await sendMessage(chatId, text, {
    reply_markup: { inline_keyboard: keyboard },
  });
}

async function handleSetLanguage(chatId: number, locale: Locale): Promise<void> {
  setUserLocale(chatId, locale);
  await sendMessage(chatId, t(locale, "languageSet"));

  const helpText = t(locale, "help");
  await sendMessage(chatId, helpText, { parse_mode: "HTML" });
}

async function handleCompanySearch(
  chatId: number,
  query: string,
  locale: Locale
): Promise<void> {
  if (!query) {
    await sendMessage(chatId, t(locale, "searchPrompt"));
    return;
  }

  try {
    // Search companies directly in database
    const companies = await prisma.factory.findMany({
      where: {
        status: "approved",
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { province: { contains: query, mode: "insensitive" } },
          { district: { contains: query, mode: "insensitive" } },
          { operator: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: {
        id: true,
        name: true,
        province: true,
        district: true,
        workers: true,
        operator: true,
      },
    });

    if (companies.length === 0) {
      await sendMessage(
        chatId,
        tParams(locale, "noResults", query),
        { parse_mode: "HTML" }
      );
      return;
    }

    // If only one result, show detailed view
    if (companies.length === 1) {
      const company = companies[0];
      const websiteUrl = getCompanyUrl(company.id);

      // Get review stats
      const stats = await prisma.review.aggregate({
        where: { factoryId: company.id, isVisible: true },
        _count: true,
        _avg: {
          ratingSalary: true,
          ratingOt: true,
          ratingHousing: true,
        },
      });

      const avgOverall =
        stats._avg.ratingSalary && stats._avg.ratingOt && stats._avg.ratingHousing
          ? (stats._avg.ratingSalary + stats._avg.ratingOt + stats._avg.ratingHousing) / 3
          : null;

      const messageText = formatCompanyWithReviews(company, {
        count: stats._count,
        avgSalary: stats._avg.ratingSalary,
        avgOt: stats._avg.ratingOt,
        avgHousing: stats._avg.ratingHousing,
        avgOverall: avgOverall ? Math.round(avgOverall * 10) / 10 : null,
      });

      const buttons = getCompanyActionButtons(company.id, websiteUrl);

      await sendMessage(chatId, messageText, {
        parse_mode: "HTML",
        reply_markup: { inline_keyboard: buttons },
      });
      return;
    }

    // Multiple results - show list
    let message = tParams(locale, "searchResults", query);

    companies.forEach((company, index) => {
      const location = [company.district, company.province]
        .filter(Boolean)
        .join(", ");
      message += `${index + 1}. <b>${company.name}</b>\n`;
      if (location) {
        message += `   ${t(locale, "location")} ${location}\n`;
      }
      message += `\n`;
    });

    message += `\n${t(locale, "visitWebsite")}`;

    await sendMessage(chatId, message, {
      parse_mode: "HTML",
    });
  } catch (error) {
    console.error("Company search error:", error);
    await sendMessage(chatId, t(locale, "error"));
  }
}

async function handleDeepLink(
  chatId: number,
  payload: string,
  locale: Locale
): Promise<void> {
  const [type, idStr] = payload.split("_");
  const id = parseInt(idStr, 10);

  if (isNaN(id)) {
    await sendMessage(chatId, t(locale, "error"));
    return;
  }

  if (type === "company") {
    try {
      const company = await prisma.factory.findUnique({
        where: { id, status: "approved" },
        select: {
          id: true,
          name: true,
          province: true,
          district: true,
          workers: true,
          operator: true,
        },
      });

      if (!company) {
        await sendMessage(chatId, t(locale, "error"));
        return;
      }

      const websiteUrl = getCompanyUrl(company.id);

      const stats = await prisma.review.aggregate({
        where: { factoryId: company.id, isVisible: true },
        _count: true,
        _avg: {
          ratingSalary: true,
          ratingOt: true,
          ratingHousing: true,
        },
      });

      const avgOverall =
        stats._avg.ratingSalary && stats._avg.ratingOt && stats._avg.ratingHousing
          ? (stats._avg.ratingSalary + stats._avg.ratingOt + stats._avg.ratingHousing) / 3
          : null;

      const messageText = formatCompanyWithReviews(company, {
        count: stats._count,
        avgSalary: stats._avg.ratingSalary,
        avgOt: stats._avg.ratingOt,
        avgHousing: stats._avg.ratingHousing,
        avgOverall: avgOverall ? Math.round(avgOverall * 10) / 10 : null,
      });

      const buttons = getCompanyActionButtons(company.id, websiteUrl);

      await sendMessage(chatId, messageText, {
        parse_mode: "HTML",
        reply_markup: { inline_keyboard: buttons },
      });
    } catch (error) {
      console.error("Deep link company error:", error);
      await sendMessage(chatId, t(locale, "error"));
    }
  } else if (type === "agency") {
    await sendMessage(chatId, "🚧 Agency details coming soon!");
  } else {
    await sendMessage(chatId, t(locale, "error"));
  }
}

// ============================================================
// Localized Menu
// ============================================================

function getMainMenuButtonsLocal(locale: Locale) {
  return [
    [{ text: tMenu(locale, "searchCompany"), callback_data: "search_company" }],
    [{ text: tMenu(locale, "searchAgency"), callback_data: "search_agency" }],
    [{ text: tMenu(locale, "language"), callback_data: "language" }],
    [{ text: tMenu(locale, "help"), callback_data: "help" }],
  ];
}
