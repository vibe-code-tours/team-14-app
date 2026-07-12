"use client";

import Link from "next/link";
import { useLanguage } from "@/src/contexts/LanguageContext";

interface SocialLink {
  key: "telegram" | "facebook" | "youtube" | "line";
  icon: string;
  url: string;
  color: string;
  hoverColor: string;
}

const socialLinks: SocialLink[] = [
  {
    key: "telegram",
    icon: "📱",
    url: "https://t.me/",
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
  },
  {
    key: "facebook",
    icon: "📘",
    url: "https://facebook.com/",
    color: "bg-blue-600",
    hoverColor: "hover:bg-blue-700",
  },
  {
    key: "youtube",
    icon: "🎬",
    url: "https://youtube.com/",
    color: "bg-red-500",
    hoverColor: "hover:bg-red-600",
  },
  {
    key: "line",
    icon: "💬",
    url: "https://line.me/",
    color: "bg-green-500",
    hoverColor: "hover:bg-green-600",
  },
];

export function ContactLinks() {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 md:p-8 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
        <span>📱</span> {t("contact.title")}
      </h3>

      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t("contact.subtitle")}</p>

      {/* Responsive grid - 1 col mobile, 2 col sm, 4 col lg */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {socialLinks.map((link) => (
          <Link
            key={link.key}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow us on ${t(`contact.${link.key}`)}`}
            className={`${link.color} ${link.hoverColor} text-white px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-blue-500`}
          >
            <span className="text-base" aria-hidden="true">
              {link.icon}
            </span>
            <span>{t(`contact.${link.key}`)}</span>
            <svg
              className="w-3.5 h-3.5 opacity-70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </Link>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
        <Link
          href="/contact"
          className="text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline inline-flex items-center gap-1 transition-colors"
        >
          {t("contact.viewFull")}
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
