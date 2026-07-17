"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PasswordInput } from "@/src/components/PasswordInput";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const showLogout = localStorage.getItem("admin-logout-success");
    if (showLogout) {
      localStorage.removeItem("admin-logout-success");
      /* eslint-disable react-hooks/set-state-in-effect */
      setSuccessMsg("Logout successful!");
      setSuccess(true);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      setSuccessMsg("Login successful! Redirecting...");
      setSuccess(true);
      setTimeout(() => router.push("/admin/dashboard"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-linear-to-br from-emerald-600 via-teal-600 to-emerald-700 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Success Toast */}
      {success && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg shadow-lg text-sm font-medium">
            <span>✅</span>
            <span>{successMsg || "Login successful! Redirecting..."}</span>
          </div>
        </div>
      )}
      {/* Decorative circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/10 dark:bg-white/5" />
      <div className="absolute -bottom-48 -left-24 w-[500px] h-[500px] rounded-full bg-white/10 dark:bg-white/5" />
      <div className="absolute top-1/4 right-0 w-64 h-64 rounded-full bg-white/10 dark:bg-white/5" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-white/10 dark:bg-white/5" />

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
          <div className="inline-flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}<img src="/images/logo.png" alt="WorkerVoice" className="h-20 sm:h-28 md:h-36 w-auto" />
          </div>
          <p className="text-slate-700 dark:text-emerald-100 -mt-2 sm:-mt-6 md:-mt-10">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 opacity-0 animate-[fadeIn_0.5s_ease-out_0.2s_forwards]">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-1">Welcome back</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Sign in to your admin account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-white mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>

            <div>
              <PasswordInput
                label="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-xl border border-red-100 dark:border-red-800 flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/admin/demo" className="text-sm text-emerald-600 hover:underline">
              Try demo accounts →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
