/**
 * Telegram Bot API utilities
 * Free Bot API: https://core.telegram.org/bots/api
 */

const TELEGRAM_API = "https://api.telegram.org";

function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  }
  return token;
}

function getBotUrl(): string {
  return `${TELEGRAM_API}/bot${getBotToken()}`;
}

// ============================================================
// Types
// ============================================================

export interface TelegramMessage {
  message_id: number;
  from?: {
    id: number;
    first_name: string;
    username?: string;
  };
  chat: {
    id: number;
    type: string;
  };
  text?: string;
  date: number;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

export interface InlineKeyboardButton {
  text: string;
  url?: string;
  callback_data?: string;
}

export interface InlineKeyboardMarkup {
  inline_keyboard: InlineKeyboardButton[][];
}

// ============================================================
// API Methods
// ============================================================

/**
 * Send a text message to a chat
 */
export async function sendMessage(
  chatId: number,
  text: string,
  options?: {
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2";
    reply_markup?: InlineKeyboardMarkup;
  }
): Promise<boolean> {
  try {
    console.log(`📤 Sending message to chat ${chatId}...`);
    const url = `${getBotUrl()}/sendMessage`;
    console.log(`   URL: ${url.substring(0, 50)}...`);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: options?.parse_mode,
        reply_markup: options?.reply_markup,
      }),
    });

    const data = await response.json();
    console.log(`   Response: ok=${data.ok}, description=${data.description || "none"}`);
    return data.ok === true;
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
    return false;
  }
}

/**
 * Send a message with "View on Website" button
 */
export async function sendMessageWithWebsiteButton(
  chatId: number,
  text: string,
  websiteUrl: string,
  buttonText = "View on Website"
): Promise<boolean> {
  return sendMessage(chatId, text, {
    reply_markup: {
      inline_keyboard: [[{ text: buttonText, url: websiteUrl }]],
    },
  });
}

/**
 * Send a message with inline keyboard buttons
 */
export async function sendMessageWithKeyboard(
  chatId: number,
  text: string,
  buttons: InlineKeyboardButton[][]
): Promise<boolean> {
  return sendMessage(chatId, text, {
    reply_markup: {
      inline_keyboard: buttons,
    },
  });
}

/**
 * Send typing action (shows "typing..." in chat)
 */
export async function sendTypingAction(chatId: number): Promise<boolean> {
  try {
    const response = await fetch(`${getBotUrl()}/sendChatAction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        action: "typing",
      }),
    });

    const data = await response.json();
    return data.ok === true;
  } catch (error) {
    console.error("Failed to send typing action:", error);
    return false;
  }
}

/**
 * Set bot commands menu
 */
export async function setBotCommands(
  commands: Array<{ command: string; description: string }>
): Promise<boolean> {
  try {
    const response = await fetch(`${getBotUrl()}/setMyCommands`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commands }),
    });

    const data = await response.json();
    return data.ok === true;
  } catch (error) {
    console.error("Failed to set bot commands:", error);
    return false;
  }
}

/**
 * Set webhook URL
 */
export async function setWebhook(
  url: string,
  secretToken: string
): Promise<{ ok: boolean; description?: string }> {
  try {
    const response = await fetch(`${getBotUrl()}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        secret_token: secretToken,
        allowed_updates: ["message"],
      }),
    });

    return await response.json();
  } catch (error) {
    console.error("Failed to set webhook:", error);
    return { ok: false, description: "Network error" };
  }
}

/**
 * Get current webhook info
 */
export async function getWebhookInfo(): Promise<{
  ok: boolean;
  result?: { url: string; has_custom_certificate: boolean };
}> {
  try {
    const response = await fetch(`${getBotUrl()}/getWebhookInfo`);
    return await response.json();
  } catch (error) {
    console.error("Failed to get webhook info:", error);
    return { ok: false };
  }
}

/**
 * Delete webhook
 */
export async function deleteWebhook(): Promise<{ ok: boolean }> {
  try {
    const response = await fetch(`${getBotUrl()}/deleteWebhook`, {
      method: "POST",
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to delete webhook:", error);
    return { ok: false };
  }
}

// ============================================================
// Helpers
// ============================================================

/**
 * Get the base URL for the WorkerVoice site
 */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

/**
 * Build a deep link URL to open a company page
 */
export function getCompanyUrl(companyId: number): string {
  return `${getSiteUrl()}/factories/${companyId}`;
}

/**
 * Build a deep link URL to open an agency page
 */
export function getAgencyUrl(agencyId: number): string {
  return `${getSiteUrl()}/agencies/${agencyId}`;
}

/**
 * Build a Telegram deep link to start bot with payload
 */
export function buildDeepLink(payload: string): string {
  const botUsername = "WorkerVoiceBot"; // Update with actual bot username
  return `https://t.me/${botUsername}?start=${payload}`;
}
