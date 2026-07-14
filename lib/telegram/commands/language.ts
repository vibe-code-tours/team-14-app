/**
 * /lang command handler
 */

import { Context } from "grammy";
import { t, getUserLocale, setUserLocale, type Locale } from "../i18n";
import { getLanguageKeyboard } from "../keyboards/language";

/**
 * Handle /lang command - show language selection
 */
export async function langCommand(ctx: Context): Promise<void> {
  const chatId = ctx.chat?.id;
  if (!chatId) return;

  const locale = getUserLocale(chatId);
  const text = t(locale, "languagePrompt");
  const keyboard = getLanguageKeyboard();

  await ctx.reply(text, {
    reply_markup: keyboard,
  });
}

/**
 * Handle language selection callback
 */
export async function languageCallback(ctx: Context): Promise<void> {
  const chatId = ctx.chat?.id;
  if (!chatId) return;

  const data = ctx.callbackQuery?.data;
  if (!data) return;

  // Answer callback query to remove loading indicator
  await ctx.answerCallbackQuery();

  // Set language based on callback data
  let locale: Locale;
  if (data === "lang_en") {
    locale = "en";
  } else if (data === "lang_my") {
    locale = "my";
  } else {
    return;
  }

  setUserLocale(chatId, locale);

  // Send confirmation and help
  await ctx.reply(t(locale, "languageSet"));

  const helpText = t(locale, "help");
  await ctx.reply(helpText, { parse_mode: "HTML" });
}
