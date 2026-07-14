"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AdminSession {
  user?: {
    id?: number;
    email?: string;
    name?: string;
    isAdmin?: boolean;
    isSuperAdmin?: boolean;
  } | null;
}

export default function NewAdminPage() {
  const router = useRouter();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [nickname, setNickname] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createdPassword, setCreatedPassword] = useState<string | null>(null);
  const [createdEmail, setCreatedEmail] = useState<string | null>(null);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (!loading && (!session?.user || !session.user.isSuperAdmin)) {
      router.push("/admin/admins");
    }
  }, [session, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  if (!session?.user?.isSuperAdmin) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullName, nickname: nickname || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create admin");
      }

      setCreatedPassword(data.password);
      setCreatedEmail(data.user.email);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (createdPassword) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            ✅ Admin Created
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Credentials have been sent to {createdEmail}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
            🔑 Generated Password
          </h3>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4 mb-4">
            <p className="text-xs text-amber-700 dark:text-amber-400 mb-2 font-medium">
              ⚠️ Save this password — it will not be shown again.
            </p>
            <code className="block text-lg font-mono font-bold text-amber-900 dark:text-amber-200 bg-white dark:bg-slate-900 px-4 py-3 rounded-lg border border-amber-200 dark:border-amber-700 select-all">
              {createdPassword}
            </code>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            The admin can login at{" "}
            <Link href="/admin/login" className="text-emerald-600 dark:text-emerald-400 hover:underline">
              /admin/login
            </Link>{" "}
            and should change their password after first login.
          </p>
        </div>

        <div className="flex justify-end">
          <Link
            href="/admin/admins"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-lg transition"
          >
            Back to Admins
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in" style={{ animationDelay: "0ms" }}>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            ➕ Create Admin
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Create a new administrator account
          </p>
        </div>
        <Link
          href="/admin/admins"
          className="text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 px-4 py-2 rounded-lg transition"
        >
          ← Back to Admins
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 animate-fade-in" style={{ animationDelay: "150ms" }}>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
            👤 Admin Details
          </h3>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4 max-w-md">
            <div>
              <label
                htmlFor="email"
                className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
              >
                Email *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                className="mt-1 w-full text-sm text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg border border-slate-200 dark:border-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition"
              />
            </div>
            <div>
              <label
                htmlFor="fullName"
                className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
              >
                Full Name *
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Enter full name"
                className="mt-1 w-full text-sm text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg border border-slate-200 dark:border-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition"
              />
            </div>
            <div>
              <label
                htmlFor="nickname"
                className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
              >
                Nickname
              </label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Optional display name"
                className="mt-1 w-full text-sm text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg border border-slate-200 dark:border-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition"
              />
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Optional — used as public display name
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={submitting || !email || !fullName}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating..." : "Create Admin"}
          </button>
        </div>
      </form>
    </div>
  );
}
