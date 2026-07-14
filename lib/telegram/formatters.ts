/**
 * Telegram message formatters
 * Format data into clean, mobile-friendly Telegram messages
 */

import { InlineKeyboardButton } from "./bot";

// ============================================================
// Types
// ============================================================

export interface CompanyData {
  id: number;
  name: string;
  province?: string | null;
  district?: string | null;
  workers?: number | null;
  operator?: string | null;
  phone?: string | null;
}

export interface ReviewStats {
  count: number;
  avgSalary: number | null;
  avgOt: number | null;
  avgHousing: number | null;
  avgOverall: number | null;
}

// ============================================================
// Formatters
// ============================================================

/**
 * Format a star rating (e.g., 4.2 → ⭐⭐⭐⭐☆)
 */
function formatStars(rating: number | null): string {
  if (rating === null) return "No ratings yet";
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return "★".repeat(fullStars) + (hasHalf ? "½" : "") + "☆".repeat(emptyStars);
}

/**
 * Format company for Telegram message
 */
export function formatCompanyMessage(company: CompanyData): string {
  const location = [company.district, company.province].filter(Boolean).join(", ");
  const workers = company.workers ? `${company.workers.toLocaleString()} workers` : "";

  let message = `🏭 <b>${escapeHtml(company.name)}</b>\n`;

  if (location) {
    message += `📍 ${escapeHtml(location)}\n`;
  }

  if (workers) {
    message += `👥 ${workers}\n`;
  }

  if (company.operator) {
    message += `🏢 ${escapeHtml(company.operator)}\n`;
  }

  return message;
}

/**
 * format company with review stats
 */
export function formatCompanyWithReviews(
  company: CompanyData,
  stats: ReviewStats
): string {
  let message = formatCompanyMessage(company);

  if (stats.count > 0) {
    message += `\n📊 <b>Reviews:</b> ${stats.count}\n`;
    message += `⭐ ${formatStars(stats.avgOverall)} ${stats.avgOverall?.toFixed(1) || "N/A"}/5\n`;

    if (stats.avgSalary !== null) {
      message += `💰 Salary: ${stats.avgSalary.toFixed(1)}/5\n`;
    }
    if (stats.avgOt !== null) {
      message += `⏰ Overtime: ${stats.avgOt.toFixed(1)}/5\n`;
    }
    if (stats.avgHousing !== null) {
      message += `🏠 Housing: ${stats.avgHousing.toFixed(1)}/5\n`;
    }
  } else {
    message += `\n📊 <b>No reviews yet</b>\n`;
  }

  return message;
}

/**
 * Format search results list
 */
export function formatSearchResults(
  companies: CompanyData[],
  query: string
): string {
  if (companies.length === 0) {
    return `🔍 No companies found for "<b>${escapeHtml(query)}</b>"\n\nTry a different search term.`;
  }

  let message = `🔍 <b>Search results for "${escapeHtml(query)}"</b>\n`;
  message += `Found ${companies.length} companies:\n\n`;

  companies.forEach((company, index) => {
    const location = [company.district, company.province].filter(Boolean).join(", ");
    message += `${index + 1}. <b>${escapeHtml(company.name)}</b>\n`;
    if (location) {
      message += `   📍 ${escapeHtml(location)}\n`;
    }
    message += `\n`;
  });

  return message;
}

/**
 * format welcome message
 */
export function formatWelcomeMessage(firstName: string): string {
  return (
    `👋 Welcome, <b>${escapeHtml(firstName)}</b>!\n\n` +
    `I'm the <b>WorkerVoice Bot</b>. I help you find trustworthy workplace information.\n\n` +
    `🔍 <b>Search for a company</b> to see reviews and ratings.\n\n` +
    `Use the menu below or type a command to get started.`
  );
}

/**
 * format help message
 */
export function formatHelpMessage(): string {
  return (
    `📖 <b>WorkerVoice Bot Commands</b>\n\n` +
    `/start - Start the bot and see welcome message\n` +
    `/help - Show this help message\n` +
    `/company - Search for a company\n` +
    `/agency - Search for a recruitment agency\n\n` +
    `💡 <b>Tip:</b> You can also search by typing a company name directly.`
  );
}

/**
 * Get main menu keyboard buttons
 */
export function getMainMenuButtons(): InlineKeyboardButton[][] {
  return [
    [{ text: "🔍 Search Company", callback_data: "search_company" }],
    [{ text: "📋 Search Agency", callback_data: "search_agency" }],
    [{ text: "❓ Help", callback_data: "help" }],
  ];
}

/**
 * Get company action buttons
 */
export function getCompanyActionButtons(
  companyId: number,
  websiteUrl: string
): InlineKeyboardButton[][] {
  // Telegram requires HTTPS for button URLs
  // Convert localhost HTTP to a text message instead
  const isLocalhost = websiteUrl.includes("localhost");

  if (isLocalhost) {
    // For localhost, show the URL as text since buttons require HTTPS
    return [
      [{ text: "🔍 Search Again", callback_data: "search_company" }],
    ];
  }

  return [
    [{ text: "🌐 View on Website", url: websiteUrl }],
    [{ text: "✍️ Write Review", url: `${websiteUrl}#write-review` }],
    [{ text: "🔍 Search Again", callback_data: "search_company" }],
  ];
}

/**
 * Escape HTML special characters for Telegram
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
