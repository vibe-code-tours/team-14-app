/**
 * Telegram Bot Module
 * Using grammy framework
 */

// Bot instance and helpers
export { getBot, getSiteUrl, getCompanyUrl, getAgencyUrl, escapeHtml } from "./bot";

// Commands
export { startCommand } from "./commands/start";
export { helpCommand } from "./commands/help";
export { companyCommand, textSearchHandler } from "./commands/search";
export { langCommand, languageCallback } from "./commands/language";

// Keyboards
export { getMainMenuKeyboard } from "./keyboards/main-menu";
export { getLanguageKeyboard } from "./keyboards/language";

// i18n
export { type Locale, t, tParams, getUserLocale, setUserLocale, detectLocale } from "./i18n";
