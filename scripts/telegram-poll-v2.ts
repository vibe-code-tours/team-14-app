/**
 * Telegram Bot Polling Mode (v2)
 *
 * Uses local API instead of direct database access.
 * More reliable for development.
 *
 * Run: npx tsx scripts/telegram-poll-v2.ts
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

const TELEGRAM_API = "https://api.telegram.org";
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

if (!BOT_TOKEN || BOT_TOKEN === "your-telegram-bot-token") {
  console.error("❌ TELEGRAM_BOT_TOKEN is not configured");
  process.exit(1);
}

let offset = 0;

// ============================================================
// Main Loop
// ============================================================

async function main() {
  console.log("🤖 Starting WorkerVoice Bot (Polling Mode v2)...");
  console.log("   Using API:", API_BASE);
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

  console.log(`📩 [${firstName}] ${text}`);
  console.log(`   Chat ID: ${chatId}`);

  await sendTypingAction(chatId);
  console.log(`   Typing action sent`);

  if (text === "/start") {
    await handleStart(chatId, firstName);
  } else if (text === "/help") {
    await handleHelp(chatId);
  } else if (text === "/company") {
    await sendMessage(chatId, '🔍 Please enter a company name.\n\nExample: /company โรงงาน');
  } else if (text.startsWith("/company ")) {
    const query = text.slice(9).trim();
    await handleCompanySearch(chatId, query);
  } else {
    await handleCompanySearch(chatId, text);
  }
}

// ============================================================
// Command Handlers
// ============================================================

async function handleStart(chatId: number, firstName: string): Promise<void> {
  const welcomeText = formatWelcomeMessage(firstName);
  const keyboard = getMainMenuButtons();

  await sendMessage(chatId, welcomeText, {
    parse_mode: "HTML",
    reply_markup: { inline_keyboard: keyboard },
  });

  console.log(`✅ Sent welcome to ${firstName}`);
}

async function handleHelp(chatId: number): Promise<void> {
  const helpText = formatHelpMessage();
  await sendMessage(chatId, helpText, { parse_mode: "HTML" });
  console.log("✅ Sent help message");
}

async function handleCompanySearch(chatId: number, query: string): Promise<void> {
  if (!query) {
    await sendMessage(chatId, '🔍 Please enter a company name or location.');
    return;
  }

  try {
    // Use API instead of direct database
    const searchUrl = `${API_BASE}/api/factories?keyword=${encodeURIComponent(query)}&limit=5`;
    console.log(`   Searching: ${searchUrl}`);
    const response = await fetch(searchUrl);
    const data = await response.json();
    console.log(`   Found ${data.data?.length || 0} companies`);

    if (!data.data || data.data.length === 0) {
      await sendMessage(
        chatId,
        `🔍 No companies found for "<b>${query}</b>"\n\nTry a different search term.`,
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

      // Get review stats from API
      const reviewUrl = `${API_BASE}/api/factories/${company.id}/reviews`;
      const reviewResponse = await fetch(reviewUrl);
      const reviewData = await reviewResponse.json();

      const stats = reviewData.stats || { count: 0, avgSalary: null, avgOt: null, avgHousing: null };
      const avgOverall = stats.avgSalary && stats.avgOt && stats.avgHousing
        ? Math.round(((stats.avgSalary + stats.avgOt + stats.avgHousing) / 3) * 10) / 10
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
    let message = `🔍 <b>Search results for "${query}"</b>\n\n`;

    companies.forEach((company: any, index: number) => {
      const location = [company.district, company.province].filter(Boolean).join(", ");
      message += `${index + 1}. <b>${company.name}</b>\n`;
      if (location) {
        message += `   📍 ${location}\n`;
      }
      message += `\n`;
    });

    // For localhost, just show the URL as text
    const isLocalhost = API_BASE.includes("localhost");
    if (isLocalhost) {
      message += `\n💡 Visit http://localhost:3000/factories to view details`;
    }

    await sendMessage(chatId, message, {
      parse_mode: "HTML",
    });

    console.log(`✅ Found ${companies.length} companies for: ${query}`);
  } catch (error) {
    console.error("Company search error:", error);
    await sendMessage(chatId, "❌ Sorry, something went wrong. Please try again later.");
  }
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
