"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/factories", label: "Factories", icon: "🏭" },
  { href: "/admin/reviews", label: "Reviews", icon: "💬" },
];

export function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOut({ redirect: false });
    router.push("/admin/login");
    setLoggingOut(false);
  };

  return (
    <nav className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white sticky top-0 z-10 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/admin/dashboard"
            className="font-bold text-lg flex items-center gap-2 hover:opacity-90 transition"
          >
            <span>🌏</span> WorkerVoice
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">
              Admin
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
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
        >
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </nav>
  );
}
