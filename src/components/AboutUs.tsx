"use client";

import { useLanguage } from "@/src/contexts/LanguageContext";

export function AboutUs() {
  const { t } = useLanguage();

  return (
    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 md:p-8 space-y-4">
      <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
        <span>ℹ️</span> {t("about.title")}
      </h3>

      <div className="space-y-3 text-sm text-emerald-700 leading-relaxed">
        <p>{t("about.p1")}</p>

        <p>{t("about.p2")}</p>

        <div className="bg-white/60 rounded-xl p-4 border border-emerald-200">
          <p className="font-semibold text-emerald-800 mb-2">🌏 Belief:</p>
          <p>{t("about.belief")}</p>
        </div>
      </div>
    </div>
  );
}
