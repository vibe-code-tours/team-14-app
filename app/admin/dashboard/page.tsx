"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { StatsCard } from "@/src/components/admin/StatsCard";
import type { AdminStats } from "@/src/types/admin";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          📊 Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Overview of your platform
        </p>
      </div>

      {/* Stats Grid */}
      {stats ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
            <StatsCard icon="🏭" label="Total Factories" value={stats.totalFactories} />
          </div>
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
            <StatsCard icon="⏳" label="Pending Approvals" value={stats.pendingFactories} sublabel="Factories awaiting review" />
          </div>
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
            <StatsCard icon="💬" label="Total Reviews" value={stats.totalReviews} />
          </div>
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
            <StatsCard icon="👁️" label="Visible Reviews" value={stats.visibleReviews} sublabel="Published to public" />
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
          <p className="text-slate-500 dark:text-slate-400">Failed to load stats</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/admin/factories"
          className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition group"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">🏭</span>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 transition">
                Manage Factories
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                View, create, edit, and approve factories
              </p>
            </div>
          </div>
        </Link>
        <Link
          href="/admin/reviews"
          className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition group"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">💬</span>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 transition">
                Moderate Reviews
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Approve or hide user-submitted reviews
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
