"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/src/contexts/LanguageContext";

interface Stats {
  activeUsers: number;
  partners: number;
  satisfactionRate: number;
  reviews: number;
}

const statIcons = ["👥", "🏭", "⭐", "📝"];
const statKeys = ["stats.users", "stats.partners", "stats.satisfaction", "stats.reviews"] as const;

function formatNumber(num: number): string {
  return num.toLocaleString();
}

export function StatsBar() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/stats");
        if (response.ok) {
          const data = await response.json();
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

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statKeys.map((key, i) => (
            <div key={key} className="text-center">
              <div className="text-2xl mb-1">{statIcons[i]}</div>
              <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 animate-pulse">
                --
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {t(key)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statValues = stats
    ? [
        formatNumber(stats.activeUsers) + "+",
        formatNumber(stats.partners) + "+",
        stats.satisfactionRate + "%",
        formatNumber(stats.reviews) + "+",
      ]
    : ["0+", "0+", "0%", "0+"];

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statKeys.map((key, i) => (
          <div key={key} className="text-center">
            <div className="text-2xl mb-1">{statIcons[i]}</div>
            <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
              {statValues[i]}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t(key)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
