"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (status === "loading") return;
    if (isLoginPage) return;

    if (!session) {
      router.push("/admin/login");
      return;
    }

    if (!session.user?.isAdmin) {
      router.push("/");
      return;
    }
  }, [session, status, router, isLoginPage]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  // Always render login page, even without session
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!session?.user?.isAdmin) {
    return null;
  }

  return <>{children}</>;
}
