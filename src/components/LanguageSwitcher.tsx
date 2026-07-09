"use client";

import { useLanguage } from "@/src/contexts/LanguageContext";
import { Language } from "@/src/lib/translations";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "my" : "en");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 transition active:scale-95"
      aria-label={`Switch to ${language === "en" ? "Myanmar" : "English"}`}
    >
      <span>{language === "en" ? "🇲🇲" : "🇬🇧"}</span>
      <span>{language === "en" ? "မြန်မာ" : "EN"}</span>
    </button>
  );
}
