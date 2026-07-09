"use client";

import Link from "next/link";
import { useLanguage } from "@/src/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface NavbarProps {
  onSuggestClick?: () => void;
}

export function Navbar({ onSuggestClick }: NavbarProps) {
  const { t } = useLanguage();

  return (
    <nav className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-6 sticky top-0 z-10 shadow-md">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="font-bold text-xl flex items-center gap-2 hover:opacity-90 transition"
        >
          <span>🌏</span> WorkerVoice
        </Link>
        <div className="flex items-center gap-2 md:gap-4 text-sm md:text-base">
          <Link href="/" className="hover:text-emerald-200 transition">
            {t("nav.home")}
          </Link>
          <Link href="/factories" className="hover:text-emerald-200 transition">
            {t("nav.factories")}
          </Link>
          <Link
            href="/contact"
            className="hover:text-emerald-200 transition hidden sm:inline"
          >
            {t("nav.contact")}
          </Link>
          <LanguageSwitcher />
          {onSuggestClick ? (
            <button
              onClick={onSuggestClick}
              className="bg-white text-emerald-600 px-4 py-1.5 rounded-full font-semibold shadow-sm hover:bg-gray-100 transition"
            >
              {t("nav.suggest")}
            </button>
          ) : (
            <Link
              href="/suggest"
              className="bg-white text-emerald-600 px-4 py-1.5 rounded-full font-semibold shadow-sm hover:bg-gray-100 transition inline-block"
            >
              {t("nav.suggest")}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
