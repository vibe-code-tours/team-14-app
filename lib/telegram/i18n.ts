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
    // Welcome
    welcome: (name: string) =>
      `👋 Welcome, <b>${name}</b>!\n\n` +
      `I'm the <b>WorkerVoice Bot</b>. I help you find trustworthy workplace information.\n\n` +
      `🔍 <b>Search for a company</b> to see reviews and ratings.\n\n` +
      `Use the menu below or type a command to get started.`,

    // Help
    help:
      `📖 <b>WorkerVoice Bot Commands</b>\n\n` +
      `/start - Start the bot\n` +
      `/help - Show this help\n` +
      `/company - Search for a company\n` +
      `/lang - Change language\n\n` +
      `💡 <b>Tip:</b> You can also search by typing a company name directly.`,

    // Company Search
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

    // Errors
    error: "❌ Sorry, something went wrong. Please try again later.",

    // Language
    languagePrompt:
      '🌐 Please select your language:\n\n' +
      'English or မြန်မာ',

    languageSet: "✅ Language set to English",

    // Menu
    menu: {
      searchCompany: "🔍 Search Company",
      searchAgency: "📋 Search Agency",
      help: "❓ Help",
      language: "🌐 Language",
    },

    // Location labels
    location: "📍",
    workers: "👥",
    reviews: "📊",
    salary: "💰",
    overtime: "⏰",
    housing: "🏠",
  },

  my: {
    // Welcome
    welcome: (name: string) =>
      `👋 ကြိုဆိုပါတယ် <b>${name}</b>\n\n` +
      `ကျွန်တော်တို့ <b>WorkerVoice Bot</b> ဖြစ်ပါတယ်။ ယုံကြည်ရတဲ့ အလုပ်ခွင် အချက်အလက်တွေ ရှာဖွေဖို့ ကူညီပေးပါတယ်။\n\n` +
      `🔍 <b>ကုမ္ပဏီ ရှာဖွေပြီး</b> သုံးသပ်ချက်တွေနဲ့ အဆင့်သတ်မှတ်ချက်တွေ ကြည့်ပါ။\n\n` +
      `အောက်ပါ မီနူးကို အသုံးပြုပါ သို့မဟုတ် စတင်ဖို့ ကွန်မန့် ရိုက်ထည့်ပါ။`,

    // Help
    help:
      `📖 <b>WorkerVoice Bot ကွန်မန့်များ</b>\n\n` +
      `/start - Bot စတင်ရန်\n` +
      `/help - အကူအညီ ပြသရန်\n` +
      `/company - ကုမ္ပဏီ ရှာဖွေရန်\n` +
      `/lang - ဘာသာစကား ပြောင်းလဲရန်\n\n` +
      `💡 <b>အကြံပြုချက်:</b> ကုမ္ပဏီ အမည် တိုက်ရိုက် ရိုက်ထည့်ပြီး ရှာဖွေနိုင်ပါတယ်။`,

    // Company Search
    searchPrompt:
      '🔍 ကုမ္ပဏီ အမည် သို့မဟုတ် နေရာ ရိုက်ထည့်ပြီး ရှာဖွေပါ။\n\n' +
      'ဥပမာများ:\n' +
      '/company โรงงาน\n' +
      '/company กรุงเทพ\n' +
      '/company สมุทรปราการ',

    searchResults: (query: string) =>
      `🔍 <b>"${query}" အတွက် ရှာဖွေမှု ရလဒ်များ</b>\n\n`,

    noResults: (query: string) =>
      `🔍 "<b>${query}</b>" အတွက် ကုမ္ပဏီ မတွေ့ပါ။\n\nအခြား ရှာဖွေမှု စကားလုံး ထည့်ပါ။`,

    foundCompanies: (count: number) => `ကုမ္ပဏီ ${count} ခု တွေ့ပါသည်`,

    viewDetails: (name: string) => `📋 ${name}`,

    visitWebsite: "💡 ကုမ္ပဏီ အသေးစိတ်နဲ့ သုံးသပ်ချက်တွေ ကြည့်ဖို့ ဝဘ်ဆိုက်သို့ သွားပါ",

    // Errors
    error: "❌ ဝမ်းနည်းပါတယ်၊ တစ်ခုခု မှားယွင်းသွားပါတယ်။ နောက်မှ ထပ်ကြိုးစားပါ။",

    // Language
    languagePrompt:
      '🌐 ဘာသာစကား ရွေးချယ်ပါ:\n\n' +
      'English or မြန်မာ',

    languageSet: "✅ ဘာသာစကားကို မြန်မာ သို့ ပြောင်းလဲပြီးပါပြီ",

    // Menu
    menu: {
      searchCompany: "🔍 ကုမ္ပဏီ ရှာဖွေရန်",
      searchAgency: "📋 အေဂျင်စီ ရှာဖွေရန်",
      help: "❓ အကူအညီ",
      language: "🌐 ဘာသာစကား",
    },

    // Location labels
    location: "📍",
    workers: "👥",
    reviews: "📊",
    salary: "💰",
    overtime: "⏰",
    housing: "🏠",
  },
} as const;

// ============================================================
// Translation Function
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

/**
 * Get nested translation (for menu items)
 */
export function tMenu(locale: Locale, key: string): string {
  const lang = translations[locale] || translations.en;
  const menu = (lang as Record<string, unknown>).menu as Record<string, string>;
  return menu?.[key] || key;
}

/**
 * Get user locale from chat_id (stored in memory for now)
 */
const userLocales = new Map<number, Locale>();

export function getUserLocale(chatId: number): Locale {
  return userLocales.get(chatId) || "en";
}

export function setUserLocale(chatId: number, locale: Locale): void {
  userLocales.set(chatId, locale);
}

/**
 * Detect locale from text (simple heuristic)
 */
export function detectLocale(text: string): Locale {
  // Check for Myanmar script
  const myanmarRegex = /[က-႟]/;
  if (myanmarRegex.test(text)) {
    return "my";
  }
  return "en";
}

/**
 * Format company with locale-specific labels
 */
export function formatCompanyInfo(
  locale: Locale,
  name: string,
  location?: string | null,
  workers?: number | null
): string {
  let message = `🏭 <b>${name}</b>\n`;

  if (location) {
    message += `${t(locale, "location")} ${location}\n`;
  }

  if (workers) {
    message += `${t(locale, "workers")} ${workers.toLocaleString()}\n`;
  }

  return message;
}
