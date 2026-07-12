"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";
import { UserAuthGuard } from "@/src/components/UserAuthGuard";
import { ChangePasswordForm } from "@/src/components/ChangePasswordForm";

export default function ChangePasswordPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-slate-500 dark:text-slate-400">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <UserAuthGuard>
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-800">
        <Navbar />
        <main className="flex-1 max-w-lg mx-auto w-full px-4 py-8 animate-fade-in">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              🔑 Change Password
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Update your account password
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <ChangePasswordForm />
          </div>
        </main>
        <Footer />
      </div>
    </UserAuthGuard>
  );
}
