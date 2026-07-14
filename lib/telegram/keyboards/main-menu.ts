/**
 * Main menu keyboard builder
 */

import { type Locale } from "../i18n";

/**
 * Get main menu keyboard
 */
export function getMainMenuKeyboard(locale: Locale) {
  const isMyanmar = locale === "my";

  return {
    inline_keyboard: [
      [{ text: isMyanmar ? "🔍 ကုမ္ပဏီ ရှာဖွေရန်" : "🔍 Search Company", callback_data: "search_company" }],
      [{ text: isMyanmar ? "🌐 ဘာသာစကား" : "🌐 Language", callback_data: "language" }],
      [{ text: isMyanmar ? "❓ အကူအညီ" : "❓ Help", callback_data: "help" }],
    ],
  };
}
