/**
 * /company search command handler
 */

import { Context } from "grammy";
import { t, tParams, getUserLocale, getUserProvince } from "../i18n";
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

  // If no query, show search prompt (or region prompt if province is set)
  if (!query || typeof query !== "string") {
    const storedProvince = getUserProvince(chatId);
    if (storedProvince) {
      await ctx.reply(tParams(locale, "regionPrompt", storedProvince), { parse_mode: "HTML" });
    } else {
      await ctx.reply(t(locale, "searchPrompt"), { parse_mode: "HTML" });
    }
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
    const chatId = ctx.chat?.id;

    // Check if user has a province scope set
    const storedProvince = chatId ? getUserProvince(chatId) : undefined;

    // Build the where clause
    const whereBase = {
      status: "approved" as const,
      OR: [
        { name: { contains: query, mode: "insensitive" as const } },
        { province: { contains: query, mode: "insensitive" as const } },
        { district: { contains: query, mode: "insensitive" as const } },
        { operator: { contains: query, mode: "insensitive" as const } },
      ],
    };

    // If user selected a province, scope the search to that region
    const where = storedProvince ? { ...whereBase, province: storedProvince } : whereBase;

    // Search companies in database
    const companies = await prisma.factory.findMany({
      where,
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

    // If only one result, show detailed view
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

      // Build message with consistent card format
      const location = [company.district, company.province].filter(Boolean).join(", ");
      let message = `━━━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `🏭 <b>${escapeHtml(company.name)}</b>\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━━\n`;
      if (location) {
        message += `${t(locale, "locationLabel")} ${escapeHtml(location)}\n`;
      }
      if (company.workers) {
        message += `${t(locale, "workersLabel")} ${company.workers.toLocaleString()} ${t(locale, "unitsPeople")}\n`;
      }

      if (stats._count > 0) {
        message += `${t(locale, "reviewsLabel")} ${stats._count} ${t(locale, "unitsReviews")}\n`;
        if (avgOverall !== null) {
          message += `⭐ ${avgOverall}/5\n`;
        }
      } else {
        message += `${t(locale, "noReviewsYet")}\n`;
      }

      await ctx.reply(message, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: t(locale, "viewDetailsButton"), url: websiteUrl }]],
        },
      });
      return;
    }

    // Multiple results - send header then individual cards
    let header = `━━━━━━━━━━━━━━━━━━━━━━━\n`;
    header += `🔍 <b>"${escapeHtml(query)}" ${t(locale, "searchResultsLabel")} ${companies.length} ${t(locale, "unitsReviews")}</b>\n`;
    if (storedProvince) {
      header += `${t(locale, "regionLabel")} <b>${escapeHtml(storedProvince)}</b>\n`;
    }
    header += `━━━━━━━━━━━━━━━━━━━━━━━`;
    await ctx.reply(header, { parse_mode: "HTML" });

    // Send each result as a separate card with its own detail button
    for (const company of companies) {
      const location = [company.district, company.province]
        .filter(Boolean)
        .join(", ");
      let result = `━━━━━━━━━━━━━━━━━━━━━━━\n`;
      result += `🏭 <b>${escapeHtml(company.name)}</b>\n`;
      result += `━━━━━━━━━━━━━━━━━━━━━━━\n`;
      if (location) {
        result += `${t(locale, "locationLabel")} ${escapeHtml(location)}\n`;
      }
      if (company.workers) {
        result += `${t(locale, "workersLabel")} ${company.workers.toLocaleString()} ${t(locale, "unitsPeople")}`;
      }

      await ctx.reply(result, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: t(locale, "viewDetailsButton"), url: getCompanyUrl(company.id) }]],
        },
      });
    }
  } catch (error) {
    console.error("Company search error:", error);
    await ctx.reply(t(locale, "error"));
  }
}
