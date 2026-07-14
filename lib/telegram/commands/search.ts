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

      // Build message with better format
      let message = `━━━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `🏭 <b>${escapeHtml(company.name)}</b>\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

      const location = [company.district, company.province].filter(Boolean).join(", ");
      if (location) {
        message += `📍 <b>နေရာ:</b> ${escapeHtml(location)}\n`;
      }
      if (company.workers) {
        message += `👥 <b>လုပ်သား:</b> ${company.workers.toLocaleString()} ယောက်\n`;
      }

      if (stats._count > 0) {
        message += `\n📊 <b>သုံးသပ်ချက်:</b> ${stats._count} ခု\n`;
        if (avgOverall !== null) {
          const stars = "⭐".repeat(Math.round(avgOverall));
          message += `${stars} <b>${avgOverall}/5</b>\n`;
        }
      } else {
        message += `\n📊 <b>သုံးသပ်ချက်:</b> မရှိသေးပါ\n`;
      }

      message += `\n🔗 အသေးစိတ်ကြည့်ရန်: ${websiteUrl}`;

      await ctx.reply(message, {
        parse_mode: "HTML",
      });
      return;
    }

    // Multiple results - show list with better format
    let message = `━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `🔍 <b>"${escapeHtml(query)}" ရှာဖွေမှု ရလဒ် ${companies.length} ခု</b>\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    companies.forEach((company, index) => {
      const location = [company.district, company.province]
        .filter(Boolean)
        .join(", ");
      message += `<b>${index + 1}. ${escapeHtml(company.name)}</b>\n`;
      if (location) {
        message += `   📍 ${escapeHtml(location)}\n`;
      }
      if (company.workers) {
        message += `   👥 ${company.workers.toLocaleString()} ယောက်\n`;
      }
      message += `   🔗 ${getCompanyUrl(company.id)}\n\n`;
    });

    message += `💡 အသေးစိတ်ကြည့်ရန် link ကို click ပါ`;

    await ctx.reply(message, { parse_mode: "HTML" });
  } catch (error) {
    console.error("Company search error:", error);
    await ctx.reply(t(locale, "error"));
  }
}
