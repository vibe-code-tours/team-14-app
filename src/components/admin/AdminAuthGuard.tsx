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
  const [checkedPath, setCheckedPath] = useState<string | null>(null);

  const isLoginPage = pathname === "/admin/login";
  const isDemoPage = pathname === "/admin/demo";

  useEffect(() => {
    if (isLoginPage || isDemoPage) {
      return;
    }

    let active = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10_000);
    fetch("/api/admin/auth/session", { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error("Unable to load admin session");
        return res.json();
      })
      .then((data) => {
        if (active) {
          setSession(data);
          setCheckedPath(pathname);
        }
      })
      .catch(() => {
        if (active) {
          setSession(null);
          setCheckedPath(pathname);
        }
      })
      .finally(() => {
        window.clearTimeout(timeout);
      });

    return () => {
      active = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [pathname, isLoginPage, isDemoPage]);

  // Derive loading: login page never shows loading spinner
  const isLoading = !isLoginPage && !isDemoPage && checkedPath !== pathname;

  useEffect(() => {
    if (isLoading) return;
    if (isLoginPage || isDemoPage) return;

    if (!session?.user) {
      router.push("/admin/login");
      return;
    }

    if (!session.user.isAdmin) {
      router.push("/");
      return;
    }
  }, [session, isLoading, router, isLoginPage, isDemoPage]);

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
