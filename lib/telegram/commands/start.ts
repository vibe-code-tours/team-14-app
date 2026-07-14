/**
 * /start command handler
 */

import { Context } from "grammy";
import { t, tParams, getUserLocale, setUserLocale, detectLocale } from "../i18n";
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

  // Use saved locale, or detect from Telegram language_code, default to my
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
    await ctx.reply(t(locale, "deepLinkInvalid"));
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
        await ctx.reply(t(locale, "deepLinkCompanyNotFound"));
        return;
      }

      const websiteUrl = getCompanyUrl(company.id);

      // Build message with consistent formatting
      const location = [company.district, company.province].filter(Boolean).join(", ");
      let message = `━━━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `🏭 <b>${company.name}</b>\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━━\n`;
      if (location) {
        message += `📍 ${location}\n`;
      }
      if (company.workers) {
        message += `👥 ${company.workers.toLocaleString()} ယောက်`;
      }

      await ctx.reply(message, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: t(locale, "deepLinkViewOnWebsite"), url: websiteUrl }]],
        },
      });
    } catch (error) {
      console.error("Deep link company error:", error);
      await ctx.reply(t(locale, "error"));
    }
  } else if (type === "agency") {
    await ctx.reply(t(locale, "deepLinkAgencyComingSoon"));
  } else {
    await ctx.reply(t(locale, "deepLinkUnknown"));
  }
}
