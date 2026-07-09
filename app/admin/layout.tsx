"use client";

import { AdminNavbar } from "@/src/components/admin/AdminNavbar";
import { AdminAuthGuard } from "@/src/components/admin/AdminAuthGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <AdminNavbar />
        <main className="flex-grow max-w-6xl mx-auto p-4 mt-6 w-full animate-fade-in">
          {children}
        </main>
      </div>
    </AdminAuthGuard>
  );
}
