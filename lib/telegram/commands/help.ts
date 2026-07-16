/**
 * /help command handler
 */

import { Context } from "grammy";
import { t, getUserLocale } from "../i18n";

/**
 * Handle /help command
 */
export async function helpCommand(ctx: Context): Promise<void> {
  const chatId = ctx.chat?.id;
  if (!chatId) return;

  const locale = getUserLocale(chatId);
  const helpText = t(locale, "help");

  await ctx.reply(helpText, { parse_mode: "HTML" });
}
