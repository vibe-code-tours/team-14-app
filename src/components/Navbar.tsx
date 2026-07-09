"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useLanguage } from "@/src/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface NavbarProps {
  onSuggestClick?: () => void;
}

export function Navbar({ onSuggestClick }: NavbarProps) {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <nav className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-4 sm:py-4 sm:px-6 sticky top-0 z-20 shadow-md">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="font-bold text-xl flex items-center gap-2 hover:opacity-90 transition"
        >
          <span>🌏</span> WorkerVoice
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-3 md:gap-4 text-sm">
          <Link href="/" className="hover:text-emerald-200 transition py-1">
            {t("nav.home")}
          </Link>
          <Link href="/factories" className="hover:text-emerald-200 transition py-1">
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

          {status === "authenticated" ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-emerald-100">
                {session.user?.name}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hover:text-emerald-200 transition"
              >
                Log out
              </button>
            </div>
          ) : status === "unauthenticated" ? (
            <Link href="/login" className="hover:text-emerald-200 transition">
              Log in
            </Link>
          ) : null}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden p-1 -mr-1 hover:text-emerald-200 transition"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden mt-3 pb-1 space-y-1 border-t border-white/20 pt-3 animate-fade-in">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="block py-2 px-2 rounded-lg hover:bg-white/10 transition text-sm"
          >
            {t("nav.home")}
          </Link>
          <Link
            href="/factories"
            onClick={() => setMenuOpen(false)}
            className="block py-2 px-2 rounded-lg hover:bg-white/10 transition text-sm"
          >
            {t("nav.factories")}
          </Link>
          {onSuggestClick ? (
            <button
              onClick={() => { onSuggestClick(); setMenuOpen(false); }}
              className="block w-full text-left py-2 px-2 rounded-lg hover:bg-white/10 transition text-sm"
            >
              {t("nav.suggest")}
            </button>
          ) : (
            <Link
              href="/suggest"
              onClick={() => setMenuOpen(false)}
              className="block py-2 px-2 rounded-lg hover:bg-white/10 transition text-sm"
            >
              {t("nav.suggest")}
            </Link>
          )}

          {status === "authenticated" ? (
            <>
              <div className="border-t border-white/20 my-1" />
              <div className="px-2 py-1 text-xs text-emerald-200">
                {session.user?.name}
              </div>
              <button
                onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
                className="block w-full text-left py-2 px-2 rounded-lg hover:bg-white/10 transition text-sm"
              >
                Log out
              </button>
            </>
          ) : status === "unauthenticated" ? (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="block py-2 px-2 rounded-lg hover:bg-white/10 transition text-sm"
            >
              Log in
            </Link>
          ) : null}
        </div>
      )}
    </nav>
  );
}
