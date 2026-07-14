/**
 * /company search command handler
 */

import { Context } from "grammy";
import { t, tParams, getUserLocale } from "../i18n";
import { getCompanyUrl, escapeHtml } from "../bot";
import { prisma } from "@/lib/prisma";

/**
 * Handle /company command
 */
export async function companyCommand(ctx: Context): Promise<void> {
  const chatId = ctx.chat?.id;
  if (!chatId) return;

  const locale = getUserLocale(chatId);
  const query = ctx.match;

  // If no query, show search prompt
  if (!query || typeof query !== "string") {
    await ctx.reply(t(locale, "searchPrompt"));
    return;
  }

  await searchCompanies(ctx, query.trim(), locale);
}

/**
 * Handle plain text messages as search queries
 */
export async function textSearchHandler(ctx: Context): Promise<void> {
  const chatId = ctx.chat?.id;
  const text = ctx.message?.text?.trim();
  if (!chatId || !text) return;

  // Skip commands
  if (text.startsWith("/")) return;

  const locale = getUserLocale(chatId);
  await searchCompanies(ctx, text, locale);
}

/**
 * Search companies and return results
 */
async function searchCompanies(
  ctx: Context,
  query: string,
  locale: "en" | "my"
): Promise<void> {
  try {
    // Search companies in database
    const companies = await prisma.factory.findMany({
      where: {
        status: "approved",
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { province: { contains: query, mode: "insensitive" } },
          { district: { contains: query, mode: "insensitive" } },
          { operator: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: {
        id: true,
        name: true,
        province: true,
        district: true,
        workers: true,
        operator: true,
      },
    });

    if (companies.length === 0) {
      await ctx.reply(tParams(locale, "noResults", query), {
        parse_mode: "HTML",
      });
      return;
    }

    // If only one result, show detailed view with URL button
    if (companies.length === 1) {
      const company = companies[0];
      const websiteUrl = getCompanyUrl(company.id);

      // Get review stats
      const stats = await prisma.review.aggregate({
        where: { factoryId: company.id, isVisible: true },
        _count: true,
        _avg: {
          ratingSalary: true,
          ratingOt: true,
          ratingHousing: true,
        },
      });

      const avgOverall =
        stats._avg.ratingSalary && stats._avg.ratingOt && stats._avg.ratingHousing
          ? Math.round(
              ((stats._avg.ratingSalary + stats._avg.ratingOt + stats._avg.ratingHousing) / 3) * 10
            ) / 10
          : null;

      // Build message
      let message = `🏭 <b>${escapeHtml(company.name)}</b>\n`;

      const location = [company.district, company.province].filter(Boolean).join(", ");
      if (location) {
        message += `📍 ${escapeHtml(location)}\n`;
      }
      if (company.workers) {
        message += `👥 ${company.workers.toLocaleString()} workers\n`;
      }

      if (stats._count > 0) {
        message += `\n📊 <b>Reviews:</b> ${stats._count}\n`;
        if (avgOverall !== null) {
          message += `⭐ ${avgOverall}/5\n`;
        }
      }

      // Send with URL button (only if HTTPS)
      const isHttps = websiteUrl.startsWith("https://");
      await ctx.reply(message, {
        parse_mode: "HTML",
        reply_markup: isHttps ? {
          inline_keyboard: [
            [{ text: "🌐 View on Website", url: websiteUrl }],
            [{ text: "✍️ Write Review", url: `${websiteUrl}#write-review` }],
          ],
        } : undefined,
      });
      return;
    }

    // Multiple results - show list
    let message = tParams(locale, "searchResults", query);

    companies.forEach((company, index) => {
      const location = [company.district, company.province]
        .filter(Boolean)
        .join(", ");
      message += `${index + 1}. <b>${escapeHtml(company.name)}</b>\n`;
      if (location) {
        message += `   📍 ${escapeHtml(location)}\n`;
      }
      message += `\n`;
    });

    message += `\n${t(locale, "visitWebsite")}`;

    await ctx.reply(message, { parse_mode: "HTML" });
  } catch (error) {
    console.error("Company search error:", error);
    await ctx.reply(t(locale, "error"));
  }
}
