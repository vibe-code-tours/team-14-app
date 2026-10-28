"use client";

import Link from "next/link";
import { useLanguage } from "@/src/contexts/LanguageContext";
import Image from "next/image";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 h-30 text-center text-xs text-slate-400 dark:text-slate-500 mt-12">
      <div className="max-w-5xl mx-auto px-4 h-full flex flex-col items-center justify-center">
        <p className="flex items-center justify-center"><Image src="/images/logo.png" alt="WorkerVoice" width={1280} height={427} className="h-5 w-auto inline-block" />&nbsp;{t("footer.brand")}</p>
        <p className="mt-1">{t("footer.tagline")}</p>
        <p className="mt-2">
          {t("footer.copyright")}{" "}
          <Link href="/terms" className="text-emerald-600 dark:text-emerald-400 hover:underline">
            {t("footer.terms")}
          </Link>
        </p>
      </div>
    </footer>
  );
}
