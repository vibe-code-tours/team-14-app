"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/src/contexts/ThemeContext";

interface AdminSession {
  user?: {
    id?: number;
    email?: string;
    name?: string;
    isAdmin?: boolean;
    isSuperAdmin?: boolean;
  } | null;
}

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/factories", label: "Factories", icon: "🏭" },
  { href: "/admin/reviews", label: "Reviews", icon: "💬" },
  { href: "/admin/contacts", label: "Messages", icon: "✉️" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/admins", label: "Admins", icon: "🛡️" },
];

export function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/admin/auth/session")
      .then((res) => res.json())
      .then((data) => setSession(data))
      .catch(() => {});

    fetch("/api/admin/profile")
      .then((res) => res.json())
      .then((data) => setProfileImage(data.image))
      .catch(() => {});

    const handleImageUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      setProfileImage(customEvent.detail);
    };
    window.addEventListener("profile-image-updated", handleImageUpdate);

    return () => window.removeEventListener("profile-image-updated", handleImageUpdate);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (pathname === "/admin/login") return null;

  const handleLogout = async () => {
    setLoggingOut(true);
    setDropdownOpen(false);
    await fetch("/api/admin/auth/signout", { method: "POST" });
    localStorage.setItem("admin-logout-success", "1");
    router.push("/admin/login");
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="bg-linear-to-r from-emerald-600 to-teal-600 dark:from-slate-800 dark:to-slate-900 text-white h-14 sticky top-0 z-10 shadow-md dark:shadow-slate-900/50">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Left: Logo + desktop nav */}
        <div className="flex items-center gap-6 min-w-0">
          <Link
            href="/admin/dashboard"
            className="font-bold text-lg flex items-center gap-2 hover:opacity-90 transition shrink-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}<img src="/logo.png" alt="WorkerVoice" className="h-16 w-auto" />
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">
              {session?.user?.isSuperAdmin ? "Super Admin" : "Admin"}
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  pathname.startsWith(item.href)
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Theme toggle + Profile dropdown (desktop) */}
        <div className="hidden md:flex items-center gap-2 relative" ref={dropdownRef}>
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition cursor-pointer text-lg"
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-8 h-8 rounded-full overflow-hidden bg-white/20 flex items-center justify-center hover:bg-white/30 transition cursor-pointer"
          >
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg">👤</span>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-12 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-2 z-50">
              <Link
                href="/admin/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <span>👤</span>
                )}
                Profile
              </Link>
              <Link
                href="/admin/change-password"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                <span>🔒</span> Change Password
              </Link>
              <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
              >
                <span>🚪</span> {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          )}
        </div>

        {/* Hamburger (mobile) */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-1.5 rounded-lg hover:bg-white/10 transition"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
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

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-emerald-700 dark:bg-slate-800 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition ${
                  pathname.startsWith(item.href)
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <div className="border-t border-white/10 my-2"></div>
            <Link
              href="/admin/profile"
              onClick={closeMobile}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                pathname.startsWith("/admin/profile")
                  ? "bg-white/20 text-white"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <span>👤</span>
              )}
              Profile
            </Link>
            <Link
              href="/admin/change-password"
              onClick={closeMobile}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition"
            >
              <span className="mr-2">🔒</span>Change Password
            </Link>
            <button
              onClick={() => { closeMobile(); toggleTheme(); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition"
            >
              <span className="mr-2">{theme === "light" ? "🌙" : "☀️"}</span>
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>
            <button
              onClick={() => { closeMobile(); handleLogout(); }}
              disabled={loggingOut}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition disabled:opacity-50"
            >
              {loggingOut ? "Logging out..." : "🚪 Logout"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
