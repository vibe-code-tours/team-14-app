/**
 * Telegram Bot Module
 * Export all Telegram-related utilities
 */

// Bot API utilities
export {
  sendMessage,
  sendMessageWithWebsiteButton,
  sendMessageWithKeyboard,
  sendTypingAction,
  setBotCommands,
  setWebhook,
  getWebhookInfo,
  deleteWebhook,
  getSiteUrl,
  getCompanyUrl,
  getAgencyUrl,
  buildDeepLink,
} from "./bot";

// Types
export type {
  TelegramMessage,
  TelegramUpdate,
  InlineKeyboardButton,
  InlineKeyboardMarkup,
} from "./bot";

// Message formatters
export {
  formatCompanyMessage,
  formatCompanyWithReviews,
  formatSearchResults,
  formatWelcomeMessage,
  formatHelpMessage,
  getMainMenuButtons,
  getCompanyActionButtons,
} from "./formatters";

export type { CompanyData, ReviewStats } from "./formatters";

// Internationalization (i18n)
export {
  type Locale,
  t,
  tParams,
  tMenu,
  getUserLocale,
  setUserLocale,
  detectLocale,
  formatCompanyInfo,
} from "./i18n";

// Verification and security
export {
  verifyWebhookSecret,
  isValidTelegramUpdate,
  checkRateLimit,
} from "./verify";
