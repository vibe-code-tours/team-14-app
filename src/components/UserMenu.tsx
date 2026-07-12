"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useLanguage } from "@/src/contexts/LanguageContext";
import { UserAvatar } from "./UserAvatar";

interface UserMenuProps {
  name: string | null | undefined;
  email: string | null | undefined;
  image?: string | null;
  isAdmin?: boolean;
}

export function UserMenu({ name, email, image, isAdmin }: UserMenuProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    setOpen(false);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-white/40 transition focus:outline-none focus:ring-2 focus:ring-white/40"
        aria-label="User menu"
        aria-expanded={open}
      >
        <UserAvatar name={name} image={image} size="md" />
        <svg
          className={`w-4 h-4 text-white/70 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* User info */}
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <UserAvatar name={name} image={image} size="lg" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {name || t("nav.user")}
                </p>
                {email && (
                  <p className="text-xs text-slate-500 truncate">{email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
            >
              <span>👤</span>
              {t("nav.profile")}
            </Link>
            <Link
              href="/profile/change-password"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
            >
              <span>🔑</span>
              {t("nav.changePassword")}
            </Link>
            <Link
              href="/factories/new"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
            >
              <span>🏭</span>
              {t("nav.createFactory")}
            </Link>
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
              >
                <span>🛡️</span>
                {t("nav.adminDashboard")}
              </Link>
            )}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition disabled:opacity-50"
            >
              <span>🚪</span>
              {loggingOut ? t("nav.loggingOut") : t("nav.logout")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
