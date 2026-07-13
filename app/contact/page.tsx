"use client";

import Link from "next/link";
import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";
import { ContactLinks } from "@/src/components/ContactLinks";
import { ContactForm } from "@/src/components/ContactForm";
import { useLanguage } from "@/src/contexts/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto p-4 md:p-8 mt-6 w-full space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            {t("contact.title")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {t("contact.subtitle")}
          </p>
        </div>

        {/* Contact Form */}
        <ContactForm />

        {/* Social Channels */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 md:p-8">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-4">
            {t("contact.channels.title")}
          </h2>
          <ContactLinks />
        </div>

        {/* Privacy Notice */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-2xl p-6 text-sm text-amber-800 dark:text-amber-200">
          <p className="font-semibold mb-2">🔒 Privacy</p>
          <p>{t("contact.privacy")}</p>
        </div>

        {/* Back Link */}
        <div className="text-center pb-4">
          <Link
            href="/"
            className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm font-medium"
          >
            {t("contact.backHome")}
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
