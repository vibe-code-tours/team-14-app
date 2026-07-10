"use client";

import { usePathname } from "next/navigation";
import { AdminNavbar } from "@/src/components/admin/AdminNavbar";
import { AdminAuthGuard } from "@/src/components/admin/AdminAuthGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AdminAuthGuard>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <AdminNavbar />
        <main className="flex-grow max-w-6xl mx-auto p-4 mt-6 w-full animate-fade-in">
          {children}
        </main>
      </div>
    </AdminAuthGuard>
  );
}
