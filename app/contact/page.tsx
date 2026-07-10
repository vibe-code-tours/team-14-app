"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";
import { SuggestModal } from "@/src/components/SuggestModal";
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

export default function ContactPage() {
  const { t } = useLanguage();
  const [showSuggestModal, setShowSuggestModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto p-4 md:p-8 mt-6 w-full space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-800">
            📱 {t("contact.title")}
          </h1>
          <p className="text-slate-500">Contact Us</p>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-6">
          <h2 className="text-lg font-bold text-slate-800">
            {t("contact.socialMedia")}
          </h2>

          <div className="grid gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.key}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${link.color} text-white p-4 rounded-xl flex items-center gap-4 transition hover:shadow-md active:scale-[0.98]`}
              >
                <span className="text-2xl">{link.icon}</span>
                <div>
                  <div className="font-bold">{t(`contact.${link.key}`)}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 text-sm text-amber-800">
          <p className="font-semibold mb-2">🔒 Privacy</p>
          <p>{t("contact.privacy")}</p>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-emerald-600 hover:underline text-sm font-medium"
          >
            {t("contact.backHome")}
          </Link>
        </div>
      </main>

      <Footer />

      <SuggestModal
        isOpen={showSuggestModal}
        onClose={() => setShowSuggestModal(false)}
      />
    </div>
  );
}
