/**
 * Main menu keyboard builder
 */

import { type Locale } from "../i18n";
import { InlineKeyboardButton } from "grammy/types";

/**
 * Get main menu keyboard
 * Register and Contact always use URL buttons to open website pages
 */
export function getMainMenuKeyboard(locale: Locale) {
  const isMyanmar = locale === "my";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const keyboard: InlineKeyboardButton[][] = [
    [{ text: isMyanmar ? "🔍 ကုမ္ပဏီ ရှာဖွေရန်" : "🔍 Search Company", callback_data: "search_company" }],
    [{ text: isMyanmar ? "🌐 ဘာသာစကား ရွေးချယ်ရန်" : "🌐 Language", callback_data: "language" }],
    [{ text: isMyanmar ? "❓ အသုံးပြုနည်း" : "❓ Help", callback_data: "help" }],
    [{ text: isMyanmar ? "👤 အကောင့်ဖွင့်ရန်" : "👤 Register", url: `${siteUrl}/register` }],
    [{ text: isMyanmar ? "📧 ဆက်သွယ်ရန်" : "📧 Contact", url: `${siteUrl}/contact` }],
  ];

  return { inline_keyboard: keyboard };
}
