"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface AdminUser {
  id?: number;
  email?: string;
  name?: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
}

interface AdminSession {
  user?: AdminUser | null;
}

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === "/admin/login";
  const isDemoPage = pathname === "/admin/demo";

  useEffect(() => {
    if (isLoginPage || isDemoPage) return;

    fetch("/api/admin/auth/session")
      .then((res) => res.json())
      .then((data) => {
        setSession(data);
        setLoading(false);
      })
      .catch(() => {
        setSession(null);
        setLoading(false);
      });
  }, [isLoginPage]);

  // Derive loading: login page never shows loading spinner
  const isLoading = (isLoginPage || isDemoPage) ? false : loading;

  useEffect(() => {
    if (loading) return;
    if (isLoginPage || isDemoPage) return;

    if (!session?.user) {
      router.push("/admin/login");
      return;
    }

    if (!session.user.isAdmin) {
      router.push("/");
      return;
    }
  }, [session, loading, router, isLoginPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  // Always render login page and demo page, even without session
  if (isLoginPage || isDemoPage) {
    return <>{children}</>;
  }

  if (!session?.user?.isAdmin) {
    return null;
  }

  return <>{children}</>;
}
