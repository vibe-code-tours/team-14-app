/**
 * Telegram Bot Internationalization (i18n)
 * Supports: English (en) and Myanmar/Burmese (my)
 */

export type Locale = "en" | "my";

// ============================================================
// Translations
// ============================================================

const translations = {
  en: {
    welcome: (name: string) =>
      `👋 Welcome, <b>${name}</b>!\n\n` +
      `I'm the <b>WorkerVoice Bot</b>. I help you find trustworthy workplace information.\n\n` +
      `🔍 <b>Search for a company</b> to see reviews and ratings.\n\n` +
      `Use the menu below or type a command to get started.`,

    help:
      `📖 <b>WorkerVoice Bot Commands</b>\n\n` +
      `/start - Start the bot\n` +
      `/help - Show this help\n` +
      `/company - Search for a company\n` +
      `/lang - Change language\n\n` +
      `💡 <b>Tip:</b> You can also search by typing a company name directly.`,

    searchPrompt:
      '🔍 Please enter a company name or location to search.\n\n' +
      'Examples:\n' +
      '/company โรงงาน\n' +
      '/company กรุงเทพ\n' +
      '/company สมุทรปราการ',

    searchResults: (query: string) =>
      `🔍 <b>Search results for "${query}"</b>\n\n`,

    noResults: (query: string) =>
      `🔍 No companies found for "<b>${query}</b>"\n\nTry a different search term.`,

    foundCompanies: (count: number) => `Found ${count} companies`,

    viewDetails: (name: string) => `📋 ${name}`,

    visitWebsite: "💡 Visit the website to view company details and reviews",

    error: "❌ Sorry, something went wrong. Please try again later.",

    languagePrompt:
      '🌐 Please select your language:\n\n' +
      'English or မြန်မာ',

    languageSet: "✅ Language set to English",

    location: "📍",
    workers: "👥",
    reviews: "📊",
    salary: "💰",
    overtime: "⏰",
    housing: "🏠",
  },

  my: {
    welcome: (name: string) =>
      `👋 ကြိုဆိုပါတယ် <b>${name}</b>\n\n` +
      `ကျွန်တော်တို့ <b>WorkerVoice Bot</b> ဖြစ်ပါတယ်။\n` +
      `ယုံကြည်ရတဲ့ အလုပ်ခွင် အချက်အလက်တွေ ရှာဖွေဖို့ ကူညီပေးပါတယ်။\n\n` +
      `🔍 ကုမ္ပဏီတွေကို ရှာဖွေပြီး သုံးသပ်ချက်တွေ၊ အဆင့်သတ်မှတ်ချက်တွေကို ကြည့်ရှုနိုင်ပါတယ်။\n\n` +
      `အောက်ပါ မီနူးကို အသုံးပြုပါ သို့မဟုတ် စတင်ဖို့ command ရိုက်ထည့်ပါ။\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━`,

    help:
      `📖 <b>WorkerVoice Bot ကွန်မန့်များ</b>\n\n` +
      `/start - Bot စတင်ရန်\n` +
      `/help - အကူအညီ ပြသရန်\n` +
      `/company - ကုမ္ပဏီ ရှာဖွေရန်\n` +
      `/lang - ဘာသာစကား ပြောင်းလဲရန်\n\n` +
      `💡 <b>အကြံပြုချက်:</b> ကုမ္ပဏီ အမည် တိုက်ရိုက် ရိုက်ထည့်ပြီး ရှာဖွေနိုင်ပါတယ်။`,

    searchPrompt:
      '🔍 ကုမ္ပဏီ အမည် သို့မဟုတ် နေရာ ရိုက်ထည့်ပြီး ရှာဖွေပါ။\n\n' +
      'ဥပမာများ:\n' +
      '/company စက်ရုံ\n' +
      '/company ဘန်ကောက်\n' +
      '/company စမွတ်ပရာကန်',

    searchResults: (query: string) =>
      `🔍 <b>"${query}" အတွက် ရှာဖွေမှု ရလဒ်များ</b>\n\n`,

    noResults: (query: string) =>
      `🔍 "<b>${query}</b>" အတွက် ကုမ္ပဏီ မတွေ့ပါ။\n\nအခြား ရှာဖွေမှု စကားလုံး ထည့်ပါ။`,

    foundCompanies: (count: number) => `ကုမ္ပဏီ ${count} ခု တွေ့ပါသည်`,

    viewDetails: (name: string) => `📋 ${name}`,

    visitWebsite: "💡 ကုမ္ပဏီ အသေးစိတ်နဲ့ သုံးသပ်ချက်တွေ ကြည့်ဖို့ ဝဘ်ဆိုက်သို့ သွားပါ",

    error: "❌ ဝမ်းနည်းပါတယ်၊ တစ်ခုခု မှားယွင်းသွားပါတယ်။ နောက်မှ ထပ်ကြိုးစားပါ။",

    languagePrompt:
      '🌐 ဘာသာစကား ရွေးချယ်ပါ:\n\n' +
      'English or မြန်မာ',

    languageSet: "✅ ဘာသာစကားကို မြန်မာ သို့ ပြောင်းလဲပြီးပါပြီ",

    location: "📍",
    workers: "👥",
    reviews: "📊",
    salary: "💰",
    overtime: "⏰",
    housing: "🏠",
  },
} as const;

// ============================================================
// Translation Functions
// ============================================================

/**
 * Get translation for a key (simple string)
 */
export function t(locale: Locale, key: string): string {
  const lang = translations[locale] || translations.en;
  const value = (lang as Record<string, unknown>)[key];

  if (typeof value === "string") {
    return value;
  }

  return key;
}

/**
 * Get translation with parameters (for dynamic messages)
 */
export function tParams(locale: Locale, key: string, ...args: unknown[]): string {
  const lang = translations[locale] || translations.en;
  const value = (lang as Record<string, unknown>)[key];

  if (typeof value === "function") {
    return (value as (...a: unknown[]) => string)(...args);
  }

  if (typeof value === "string") {
    return value;
  }

  return key;
}

// ============================================================
// User Locale Management (in-memory)
// ============================================================

const userLocales = new Map<number, Locale>();

/**
 * Get user locale from chat_id
 * Default: Myanmar (my)
 */
export function getUserLocale(chatId: number): Locale {
  return userLocales.get(chatId) || "my";
}

/**
 * Set user locale
 */
export function setUserLocale(chatId: number, locale: Locale): void {
  userLocales.set(chatId, locale);
}

/**
 * Detect locale from Telegram language_code
 * Default: Myanmar (my)
 */
export function detectLocale(languageCode?: string): Locale {
  // If user's Telegram is set to Myanmar, use Myanmar
  if (languageCode?.startsWith("my")) {
    return "my";
  }
  // Default to Myanmar for this project (Myanmar migrant workers)
  return "my";
}
