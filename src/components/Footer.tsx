"use client";

import { useLanguage } from "@/src/contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 h-30 text-center text-xs text-slate-400 dark:text-slate-500 mt-12">
      <div className="max-w-5xl mx-auto px-4 h-full flex flex-col items-center justify-center">
        <p className="flex items-center justify-center">{ }<img src="/images/logo.png" alt="WorkerVoice" className="h-8 w-auto inline-block" /> {t("footer.brand")}</p>
        <p className="mt-1">{t("footer.tagline")}</p>
        <p className="mt-2">{t("footer.copyright")}</p>
      </div>
    </footer>
  );
}
