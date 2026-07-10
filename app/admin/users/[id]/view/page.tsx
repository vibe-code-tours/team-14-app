"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

interface UserData {
  id: string;
  email: string;
  fullName: string;
  nickname: string | null;
  image: string | null;
  role: string;
  status: "active" | "blocked";
  createdAt: string;
  updatedAt: string;
}

const statusVariant: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  blocked: "bg-red-100 text-red-800",
};

export default function ViewUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/admin/users/${id}`);
        if (!res.ok) throw new Error("User not found");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load user");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 bg-slate-200 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded w-64 animate-pulse"></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-32 mb-4"></div>
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-slate-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
        <p className="text-slate-500">{error || "User not found"}</p>
        <Link
          href="/admin/users"
          className="text-emerald-600 text-sm font-medium hover:underline mt-4 inline-block"
        >
          ← Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in" style={{ animationDelay: "0ms" }}>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">👤 View User</h1>
          <p className="text-slate-500 text-sm">{user.nickname || user.fullName}</p>
        </div>
        <Link
          href="/admin/users"
          className="text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition"
        >
          ← Back
        </Link>
      </div>

      {/* Profile Image & Basic Info */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-fade-in" style={{ animationDelay: "150ms" }}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center text-slate-400">
            {user.image ? (
              <img src={user.image} alt={user.fullName} className="w-full h-full object-cover" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 21c0-4.418 3.582-8 8-8s8 3.582 8 8"/>
              </svg>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">{user.fullName}</h3>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-4">📋 Basic Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
            <p className="mt-1 text-sm text-slate-800 bg-slate-50 p-3 rounded-lg">{user.fullName}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nickname</label>
            <p className="mt-1 text-sm text-slate-800 bg-slate-50 p-3 rounded-lg">{user.nickname || "—"}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</label>
            <p className="mt-1 text-sm text-slate-800 bg-slate-50 p-3 rounded-lg">{user.email}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</label>
            <p className="mt-1 text-sm text-slate-800 bg-slate-50 p-3 rounded-lg capitalize">{user.role}</p>
          </div>
        </div>
      </div>

      {/* Status & Dates */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-fade-in" style={{ animationDelay: "300ms" }}>
        <h3 className="text-lg font-bold text-slate-800 mb-4">⚙️ Status & Dates</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
            <p className="mt-1">
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusVariant[user.status]}`}>
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </span>
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Created At</label>
            <p className="mt-1 text-sm text-slate-800 bg-slate-50 p-3 rounded-lg">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Updated</label>
            <p className="mt-1 text-sm text-slate-800 bg-slate-50 p-3 rounded-lg">
              {new Date(user.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
