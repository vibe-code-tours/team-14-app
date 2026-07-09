"use client";

import Link from "next/link";
import { useLanguage } from "@/src/contexts/LanguageContext";

const socialLinks = [
  {
    key: "telegram" as const,
    icon: "📱",
    url: "#",
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    key: "facebook" as const,
    icon: "📘",
    url: "#",
    color: "bg-blue-600 hover:bg-blue-700",
  },
  {
    key: "youtube" as const,
    icon: "🎬",
    url: "#",
    color: "bg-red-500 hover:bg-red-600",
  },
  {
    key: "line" as const,
    icon: "💬",
    url: "#",
    color: "bg-green-500 hover:bg-green-600",
  },
];

export function ContactLinks() {
  const { t } = useLanguage();

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span>📱</span> {t("contact.title")}
      </h3>

      <p className="text-sm text-slate-500 mb-4">{t("contact.subtitle")}</p>

      <div className="flex flex-wrap gap-3">
        {socialLinks.map((link) => (
          <Link
            key={link.key}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${link.color} text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition hover:shadow-md active:scale-95`}
          >
            <span>{link.icon}</span>
            {t(`contact.${link.key}`)}
          </Link>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100">
        <Link
          href="/contact"
          className="text-emerald-600 text-sm font-medium hover:underline"
        >
          {t("contact.viewFull")}
        </Link>
      </div>
    </div>
  );
}
