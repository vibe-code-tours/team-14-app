"use client";

import { useLanguage } from "@/src/contexts/LanguageContext";

export function AboutUs() {
  const { t } = useLanguage();

  return (
    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl p-6 md:p-8 space-y-4">
      <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
        <span>ℹ️</span> {t("about.title")}
      </h3>

      <div className="space-y-3 text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed">
        <p>{t("about.p1")}</p>

        <p>{t("about.p2")}</p>

        <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4 border border-emerald-200 dark:border-emerald-700/30">
          <p className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2 flex items-center">
            <img src="/images/logo.svg" alt="Logo" className="w-9 h-9" />
            Belief: &nbsp;
            <p>{t("about.belief")}</p>
          </p>
        </div>
         <p className="text-emerald-700 text-xs">{t("about.disclaimer")}</p>
      </div>
    </div>
  );
}
