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

      <main className="flex-grow max-w-5xl mx-auto p-4 md:p-8 mt-6 w-full space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            {t("contact.title")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {t("contact.subtitle")}
          </p>
        </div>

        {/* Two-column layout: Form + Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Form */}
          <ContactForm />

          {/* Social Channels */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 md:p-8 flex flex-col">
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-4">
              {t("contact.channels.title")}
            </h2>
            <ContactLinks />

            {/* Description */}
            <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t("contact.channels.description")}
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-2xl p-6 text-sm text-amber-800 dark:text-amber-200">
          <p className="font-semibold mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {t("contact.privacyTitle")}
          </p>
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
