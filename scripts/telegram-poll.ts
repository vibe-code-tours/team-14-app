/**
 * Telegram Bot Polling Mode
 *
 * This script runs a long-polling connection to Telegram.
 * No ngrok needed - direct connection.
 *
 * Run: npx tsx scripts/telegram-poll.ts
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
import { prisma } from "../lib/prisma";

const TELEGRAM_API = "https://api.telegram.org";
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN || BOT_TOKEN === "your-telegram-bot-token") {
  console.error("❌ TELEGRAM_BOT_TOKEN is not configured");
  process.exit(1);
}

let offset = 0;

// ============================================================
// Main Loop
// ============================================================

async function main() {
  console.log("🤖 Starting WorkerVoice Bot (Polling Mode)...");
  console.log("   Press Ctrl+C to stop\n");

  // Handle uncaught errors
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
      await sleep(5000); // Wait 5 seconds before retry
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

  await sendTypingAction(chatId);

  // Route to command handler
  if (text === "/start") {
    await handleStart(chatId, firstName, text);
  } else if (text === "/help") {
    await handleHelp(chatId);
  } else if (text === "/company") {
    await handleCompanySearch(chatId, "");
  } else if (text.startsWith("/company ")) {
    const query = text.slice(9).trim();
    await handleCompanySearch(chatId, query);
  } else {
    // Default: treat as company search
    await handleCompanySearch(chatId, text);
  }
}

// ============================================================
// Command Handlers
// ============================================================

async function handleStart(
  chatId: number,
  firstName: string,
  fullText: string
): Promise<void> {
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

  await sendMessage(chatId, helpText, {
    parse_mode: "HTML",
  });

  console.log("✅ Sent help message");
}

async function handleCompanySearch(
  chatId: number,
  query: string
): Promise<void> {
  if (!query) {
    await sendMessage(
      chatId,
      '🔍 Please enter a company name or location to search.\n\nExamples:\n/company โรงงาน\n/company กรุงเทพ\n/company สมุทรปราการ'
    );
    return;
  }

  try {
    // Search companies in database
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
        `🔍 No companies found for "<b>${query}</b>"\n\nTry a different search term.`,
        { parse_mode: "HTML" }
      );
      console.log(`❌ No results for: ${query}`);
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

      console.log(`✅ Sent company: ${company.name}`);
      return;
    }

    // Multiple results - show list
    let message = `🔍 <b>Search results for "${query}"</b>\n\n`;

    companies.forEach((company, index) => {
      const location = [company.district, company.province]
        .filter(Boolean)
        .join(", ");
      message += `${index + 1}. <b>${company.name}</b>\n`;
      if (location) {
        message += `   📍 ${location}\n`;
      }
      message += `\n`;
    });

    message += `Tap a company name to view details on our website.`;

    // Add buttons for each company
    const buttons = companies.map((company) => [
      {
        text: `📋 ${company.name.substring(0, 30)}${company.name.length > 30 ? "..." : ""}`,
        url: getCompanyUrl(company.id),
      },
    ]);

    await sendMessage(chatId, message, {
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: buttons },
    });

    console.log(`✅ Found ${companies.length} companies for: ${query}`);
  } catch (error) {
    console.error("Company search error:", error);
    await sendMessage(
      chatId,
      "❌ Sorry, something went wrong. Please try again later."
    );
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
