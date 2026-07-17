"use client";

import { usePathname } from "next/navigation";
import { AdminNavbar } from "@/src/components/admin/AdminNavbar";
import { AdminAuthGuard } from "@/src/components/admin/AdminAuthGuard";
import { ThemeProvider } from "@/src/contexts/ThemeContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const isDemoPage = pathname === "/admin/demo";

  if (isLoginPage || isDemoPage) {
    return (
      <ThemeProvider>
        {children}
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <AdminAuthGuard>
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors">
          <AdminNavbar />
          <main className="flex-grow max-w-6xl mx-auto p-4 mt-6 w-full animate-fade-in">
            {children}
          </main>
        </div>
      </AdminAuthGuard>
    </ThemeProvider>
  );
}
