"use client";

import { useLanguage } from "@/src/contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400 mt-12">
      <div className="max-w-5xl mx-auto px-4">
        <p>🌏 {t("footer.brand")}</p>
        <p className="mt-1">{t("footer.tagline")}</p>
        <p className="mt-2">{t("footer.copyright")}</p>
      </div>
    </footer>
  );
}
