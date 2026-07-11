"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/factories", label: "Factories", icon: "🏭" },
  { href: "/admin/reviews", label: "Reviews", icon: "💬" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/admins", label: "Admins", icon: "🛡️" },
];

export function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === "/admin/login") return null;

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOut({ redirect: false });
    router.push("/admin/login");
    setLoggingOut(false);
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="bg-linear-to-r from-emerald-600 to-teal-600 text-white sticky top-0 z-10 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo + desktop nav */}
        <div className="flex items-center gap-6">
          <Link
            href="/admin/dashboard"
            className="font-bold text-lg flex items-center gap-2 hover:opacity-90 transition shrink-0"
          >
            <span>🌏</span>
            <span className="hidden sm:inline">WorkerVoice</span>
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

        {/* Right: Profile + Logout (desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/admin/profile"
            className={`text-sm px-3 py-1.5 rounded-lg transition ${
              pathname.startsWith("/admin/profile")
                ? "bg-white/20 text-white"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            👤 Profile
          </Link>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
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
        <div className="md:hidden border-t border-white/10 animate-fade-in">
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
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition ${
                pathname.startsWith("/admin/profile")
                  ? "bg-white/20 text-white"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              👤 Profile
            </Link>
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
