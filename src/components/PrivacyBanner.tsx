"use client";

import { useLanguage } from "@/src/contexts/LanguageContext";

export function PrivacyBanner() {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-b border-emerald-100 dark:border-emerald-800/30 py-3 px-4">
      <div className="max-w-5xl mx-auto flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
          <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div className="text-sm">
          <strong className="text-emerald-800 dark:text-emerald-200">{t("privacy.title")}</strong>
          <span className="text-emerald-600 dark:text-emerald-400 ml-1.5">{t("privacy.subtitle")}</span>
        </div>
      </div>
    </div>
  );
}
