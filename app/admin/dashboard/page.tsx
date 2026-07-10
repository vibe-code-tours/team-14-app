"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { StatsCard } from "@/src/components/admin/StatsCard";
import type { AdminStats } from "@/src/types/admin";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          📊 Dashboard
        </h1>
        <p className="text-slate-500 text-sm">
          Overview of your platform
        </p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 animate-pulse"
            >
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : stats ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            icon="🏭"
            label="Total Factories"
            value={stats.totalFactories}
          />
          <StatsCard
            icon="⏳"
            label="Pending Approvals"
            value={stats.pendingFactories}
            sublabel="Factories awaiting review"
          />
          <StatsCard
            icon="💬"
            label="Total Reviews"
            value={stats.totalReviews}
          />
          <StatsCard
            icon="👁️"
            label="Visible Reviews"
            value={stats.visibleReviews}
            sublabel="Published to public"
          />
        </div>
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
          <p className="text-slate-500">Failed to load stats</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/admin/factories"
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition group"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">🏭</span>
            <div>
              <h3 className="font-bold text-slate-800 group-hover:text-emerald-600 transition">
                Manage Factories
              </h3>
              <p className="text-sm text-slate-500">
                View, create, edit, and approve factories
              </p>
            </div>
          </div>
        </Link>
        <Link
          href="/admin/reviews"
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition group"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">💬</span>
            <div>
              <h3 className="font-bold text-slate-800 group-hover:text-emerald-600 transition">
                Moderate Reviews
              </h3>
              <p className="text-sm text-slate-500">
                Approve or hide user-submitted reviews
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
