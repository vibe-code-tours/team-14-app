/**
 * /start command handler
 */

import { Context } from "grammy";
import { tParams, getUserLocale, setUserLocale, detectLocale } from "../i18n";
import { getMainMenuKeyboard } from "../keyboards/main-menu";
import { getCompanyUrl } from "../bot";
import { prisma } from "@/lib/prisma";

/**
 * Handle /start command
 */
export async function startCommand(ctx: Context): Promise<void> {
  const chatId = ctx.chat?.id;
  if (!chatId) return;

  // Detect language from user's Telegram settings
  const userLanguage = ctx.from?.language_code;
  const savedLocale = getUserLocale(chatId);

  // Use saved locale, or detect from Telegram language_code, default to en
  const locale = savedLocale || detectLocale(userLanguage);
  setUserLocale(chatId, locale);

  console.log(`🌐 User language: ${userLanguage}, locale: ${locale}`);

  // Check for deep link payload
  const payload = ctx.match;

  if (payload && typeof payload === "string") {
    await handleDeepLink(ctx, payload, locale);
    return;
  }

  // Send welcome message with main menu
  const firstName = ctx.from?.first_name || "User";
  const welcomeText = tParams(locale, "welcome", firstName);
  const keyboard = getMainMenuKeyboard(locale);

  await ctx.reply(welcomeText, {
    parse_mode: "HTML",
    reply_markup: keyboard,
  });
}

/**
 * Handle deep link payloads (e.g., company_123)
 */
async function handleDeepLink(
  ctx: Context,
  payload: string,
  locale: "en" | "my"
): Promise<void> {
  const chatId = ctx.chat?.id;
  if (!chatId) return;

  const [type, idStr] = payload.split("_");
  const id = parseInt(idStr, 10);

  if (isNaN(id)) {
    await ctx.reply("❌ Invalid link. Please try again.");
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
        },
      });

      if (!company) {
        await ctx.reply("❌ Company not found.");
        return;
      }

      const websiteUrl = getCompanyUrl(company.id);

      // Send message with URL button
      await ctx.reply(`🏭 <b>${company.name}</b>\n\nView details on our website:`, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: "🌐 View on Website", url: websiteUrl }]],
        },
      });
    } catch (error) {
      console.error("Deep link company error:", error);
      await ctx.reply("❌ Something went wrong. Please try again.");
    }
  } else if (type === "agency") {
    await ctx.reply("🚧 Agency details coming soon!");
  } else {
    await ctx.reply("❌ Unknown link type.");
  }
}
