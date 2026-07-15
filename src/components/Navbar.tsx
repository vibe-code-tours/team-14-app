"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useLanguage } from "@/src/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { ReviewModal } from "./ReviewModal";
import { AlertModal } from "./AlertModal";
import { UserAvatar } from "./UserAvatar";
import { UserMenu } from "./UserMenu";

export function Navbar() {
  const { t } = useLanguage();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [loginAlertOpen, setLoginAlertOpen] = useState(false);
  const { data: session, status } = useSession();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) setMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const handleWriteReviewClick = () => {
    if (status !== "authenticated") {
      setLoginAlertOpen(true);
      return;
    }
    setReviewModalOpen(true);
  };

  const handleReviewSubmitted = () => {
    // Could trigger a toast or refresh if needed
  };

  return (
    <>
      {/* Backdrop overlay — dims background when mobile menu is open */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <nav className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-slate-800 dark:to-slate-900 text-white py-3 px-4 sm:py-4 sm:px-6 sticky top-0 z-50 shadow-md dark:shadow-slate-900/50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="font-bold text-xl flex items-center gap-2 hover:opacity-90 transition"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="WorkerVoice" className="h-16 w-auto" />
          </Link>

          {/* Desktop links — visible at md (768px+) and up */}
          <div className="hidden md:flex items-center gap-3 md:gap-4 text-sm">
            <Link href="/" className="hover:text-emerald-200 transition py-1">
              {t("nav.home")}
            </Link>
            <Link href="/factories" className="hover:text-emerald-200 transition py-1">
              {t("nav.factories")}
            </Link>
            <Link
              href="/contact"
              className="hover:text-emerald-200 transition hidden md:inline"
            >
              {t("nav.contact")}
            </Link>
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              onClick={handleWriteReviewClick}
              className="bg-white text-emerald-600 px-4 py-1.5 rounded-full font-semibold shadow-sm hover:bg-gray-100 transition"
            >
              ✏️ {t("nav.writeReview")}
            </button>

            {status === "authenticated" ? (
              <>
                {session.user?.isAdmin && (
                  <Link href="/admin/dashboard" className="bg-white/20 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/30 transition">
                    🛡️
                  </Link>
                )}
                <UserMenu
                  name={session.user?.name}
                  email={session.user?.email}
                  image={session.user?.image}
                  isAdmin={session.user?.isAdmin}
                />
              </>
            ) : status === "unauthenticated" ? (
              <Link href="/login" className="hover:text-emerald-200 transition">
                {t("nav.login")}
              </Link>
            ) : null}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-1 py-2.5 px-3 md:hidden">
              <LanguageSwitcher />
              <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 -mr-1 hover:text-emerald-200 transition"
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
        </div>

        {/* Mobile dropdown — smooth slide-down via max-height transition */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col w-full gap-1 mt-3 pb-1 border-t border-white/20 pt-3">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="flex items-center w-full py-2.5 px-3 rounded-lg hover:bg-white/10 transition-colors text-sm"
            >
              {t("nav.home")}
            </Link>
            <Link
              href="/factories"
              onClick={() => setMenuOpen(false)}
              className="flex items-center w-full py-2.5 px-3 rounded-lg hover:bg-white/10 transition-colors text-sm"
            >
              {t("nav.factories")}
            </Link>
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="flex items-center w-full py-2.5 px-3 rounded-lg hover:bg-white/10 transition-colors text-sm"
            >
              {t("nav.contact")}
            </Link>
            <button
              onClick={() => { handleWriteReviewClick(); setMenuOpen(false); }}
              className="flex items-center w-full text-left py-2.5 px-3 rounded-lg hover:bg-white/10 transition-colors text-sm"
            >
              {t("nav.writeReview")}
            </button>

            {status === "authenticated" ? (
              <>
                <div className="border-t border-white/20 my-1" />
                {session.user?.isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center w-full py-2.5 px-3 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
                  >
                    🛡️ {t("nav.adminDashboard")}
                  </Link>
                )}
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center w-full py-2.5 px-3 rounded-lg hover:bg-white/10 transition-colors text-sm"
                >
                  <UserAvatar
                    name={session.user?.name}
                    image={session.user?.image}
                    size="xs"
                  />
                  &nbsp;                   {t("nav.profile")}
                </Link>
                <Link
                  href="/profile/change-password"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center w-full py-2.5 px-3 rounded-lg hover:bg-white/10 transition-colors text-sm"
                >
                  🔑 {t("nav.changePassword")}
                </Link>
            
                <Link
                  href="/my-factories"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center w-full py-2.5 px-3 rounded-lg hover:bg-white/10 transition-colors text-sm"
                >
                  🏭 {t("nav.createFactory")}
                </Link>
                <button
                  onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
                  className="flex items-center w-full text-left py-2.5 px-3 rounded-lg hover:bg-white/10 transition-colors text-sm text-red-300"
                >
                  🚪 {t("nav.logout")}
                </button>
              </>
            ) : status === "unauthenticated" ? (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center w-full py-2.5 px-3 rounded-lg hover:bg-white/10 transition-colors text-sm"
              >
                {t("nav.login")}
              </Link>
            ) : null}
          </div>
        </div>
      </nav>

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onReviewSubmitted={handleReviewSubmitted}
      />

      <AlertModal
        isOpen={loginAlertOpen}
        onClose={(confirmed) => {
          setLoginAlertOpen(false);
          if (confirmed) router.push("/login");
        }}
        title={t("nav.login")}
        message={t("auth.loginRequired")}
        confirmLabel={t("nav.login")}
        cancelLabel="Cancel"
      />
    </>
  );
}
