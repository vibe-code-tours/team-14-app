/**
 * Telegram Bot Polling Mode (v3)
 *
 * Features:
 * - Myanmar and English language support
 * - Vercel-ready (works with webhook or polling)
 * - Improved error handling
 *
 * Run: npx tsx scripts/telegram-poll-v3.ts
 */

// IMPORTANT: Load env BEFORE any other imports
import { config } from "dotenv";
config();

import {
  sendMessage,
  sendTypingAction,
  getCompanyUrl,
} from "../lib/telegram";
import {
  formatWelcomeMessage,
  formatHelpMessage,
  formatCompanyWithReviews,
  getMainMenuButtons,
  getCompanyActionButtons,
} from "../lib/telegram/formatters";
import {
  type Locale,
  t,
  tParams,
  tMenu,
  getUserLocale,
  setUserLocale,
  formatCompanyInfo,
} from "../lib/telegram/i18n";

const TELEGRAM_API = "https://api.telegram.org";
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

if (!BOT_TOKEN || BOT_TOKEN === "your-telegram-bot-token") {
  console.error("❌ TELEGRAM_BOT_TOKEN is not configured");
  process.exit(1);
}

let offset = 0;

/**
 * Answer callback query to remove loading indicator
 */
async function answerCallbackQuery(callbackQueryId: string): Promise<void> {
  await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId }),
  });
}

// ============================================================
// Main Loop
// ============================================================

async function main() {
  console.log("🤖 Starting WorkerVoice Bot (v3)...");
  console.log("   Languages: English, Myanmar");
  console.log("   API:", API_BASE);
  console.log("   Press Ctrl+C to stop\n");

  process.on("uncaughtException", (error) => {
    console.error("Uncaught exception:", error);
  });

  process.on("unhandledRejection", (error) => {
    console.error("Unhandled rejection:", error);
  });

  while (true) {
    try {
      await pollUpdates();
    } catch (error) {
      console.error("Polling error:", error);
      await sleep(5000);
    }
  }
}

// ============================================================
// Poll for Updates
// ============================================================

async function pollUpdates(): Promise<void> {
  const url = `${TELEGRAM_API}/bot${BOT_TOKEN}/getUpdates?offset=${offset}&timeout=30`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.ok) {
    console.error("Failed to get updates:", data.description);
    await sleep(1000);
    return;
  }

  for (const update of data.result) {
    offset = update.update_id + 1;

    if (update.message) {
      await handleMessage(update.message);
    } else if (update.callback_query) {
      await handleCallbackQuery(update.callback_query);
    }
  }
}

// ============================================================
// Message Handler
// ============================================================

async function handleMessage(message: any): Promise<void> {
  const chatId = message.chat.id;
  const text = message.text?.trim();
  const firstName = message.from?.first_name || "User";

  if (!text) return;

  // Get user's language preference
  const locale = getUserLocale(chatId);

  console.log(`📩 [${firstName}] ${text} (lang: ${locale})`);

  await sendTypingAction(chatId);

  // Route to command handler
  if (text === "/start") {
    await handleStart(chatId, firstName, locale);
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
  await answerCallbackQuery(callbackQuery.id);

  const locale = getUserLocale(chatId);

  console.log(`🔘 Callback: ${data} (chat: ${chatId})`);

  // Route callback data
  if (data === "search_company") {
    await sendMessage(chatId, t(locale, "searchPrompt"));
  } else if (data === "search_agency") {
    await sendMessage(chatId, "🚧 Agency search coming soon!");
  } else if (data === "help") {
    await handleHelp(chatId, locale);
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
  locale: Locale
): Promise<void> {
  const welcomeText = tParams(locale, "welcome", firstName);
  const keyboard = getMainMenuButtonsLocal(locale);

  await sendMessage(chatId, welcomeText, {
    parse_mode: "HTML",
    reply_markup: { inline_keyboard: keyboard },
  });

  console.log(`✅ Sent welcome to ${firstName} (${locale})`);
}

async function handleHelp(chatId: number, locale: Locale): Promise<void> {
  const helpText = t(locale, "help");
  await sendMessage(chatId, helpText, { parse_mode: "HTML" });
  console.log(`✅ Sent help (${locale})`);
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

  // Send updated menu
  const keyboard = getMainMenuButtonsLocal(locale);
  await sendMessage(chatId, t(locale, "help"), {
    parse_mode: "HTML",
    reply_markup: { inline_keyboard: keyboard },
  });

  console.log(`✅ Language set to ${locale} for chat ${chatId}`);
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
    // Search companies via API
    const searchUrl = `${API_BASE}/api/factories?keyword=${encodeURIComponent(query)}&limit=5`;
    console.log(`   Searching: ${query}`);
    const response = await fetch(searchUrl);
    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      await sendMessage(
        chatId,
        tParams(locale, "noResults", query),
        { parse_mode: "HTML" }
      );
      console.log(`❌ No results for: ${query}`);
      return;
    }

    const companies = data.data;

    // If only one result, show detailed view
    if (companies.length === 1) {
      const company = companies[0];
      const websiteUrl = getCompanyUrl(company.id);

      // Get review stats
      const reviewUrl = `${API_BASE}/api/factories/${company.id}/reviews`;
      const reviewResponse = await fetch(reviewUrl);
      const reviewData = await reviewResponse.json();

      const stats = reviewData.stats || {
        count: 0,
        avgSalary: null,
        avgOt: null,
        avgHousing: null,
      };
      const avgOverall =
        stats.avgSalary && stats.avgOt && stats.avgHousing
          ? Math.round(
              ((stats.avgSalary + stats.avgOt + stats.avgHousing) / 3) * 10
            ) / 10
          : null;

      const messageText = formatCompanyWithReviews(company, {
        count: stats.count,
        avgSalary: stats.avgSalary,
        avgOt: stats.avgOt,
        avgHousing: stats.avgHousing,
        avgOverall,
      });

      const buttons = getCompanyActionButtons(company.id, websiteUrl);

      await sendMessage(chatId, messageText, {
        parse_mode: "HTML",
        reply_markup: { inline_keyboard: buttons },
      });

      console.log(`✅ Sent company: ${company.name}`);
      return;
    }

    // Multiple results - show list
    let message = tParams(locale, "searchResults", query);

    companies.forEach((company: any, index: number) => {
      const location = [company.district, company.province]
        .filter(Boolean)
        .join(", ");
      message += `${index + 1}. <b>${company.name}</b>\n`;
      if (location) {
        message += `   ${t(locale, "location")} ${location}\n`;
      }
      message += `\n`;
    });

    // Add visit website note
    const isLocalhost = API_BASE.includes("localhost");
    if (isLocalhost) {
      message += `\n${t(locale, "visitWebsite")}`;
    }

    await sendMessage(chatId, message, {
      parse_mode: "HTML",
    });

    console.log(`✅ Found ${companies.length} companies for: ${query}`);
  } catch (error) {
    console.error("Company search error:", error);
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

// ============================================================
// Helpers
// ============================================================

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================
// Start
// ============================================================

main();
