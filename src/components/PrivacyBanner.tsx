"use client";

import { useLanguage } from "@/src/contexts/LanguageContext";

export function PrivacyBanner() {
  const { t } = useLanguage();

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-800/30 p-3 text-xs flex gap-2.5 items-center text-amber-800 dark:text-amber-200">
      <div className="max-w-5xl mx-auto w-full flex gap-2.5 items-center">
        <span className="text-lg">🔒</span>
        <div>
          <strong className="block">{t("privacy.title")}</strong>
          <span className="text-amber-700 dark:text-amber-300">{t("privacy.subtitle")}</span>
        </div>
      </div>
    </div>
  );
}
