/**
 * Language selection keyboard builder
 */

/**
 * Get language selection keyboard
 */
export function getLanguageKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: "🇺🇸 English", callback_data: "lang_en" },
        { text: "🇲🇲 မြန်မာ", callback_data: "lang_my" },
      ],
    ],
  };
}
