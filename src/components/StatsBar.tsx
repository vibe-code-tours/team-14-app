"use client";

import { useLanguage } from "@/src/contexts/LanguageContext";

const statIcons = ["👥", "🏭", "⭐", "📝"];
const statValues = ["10,000+", "500+", "99%", "1,000+"];
const statKeys = ["stats.users", "stats.partners", "stats.satisfaction", "stats.reviews"] as const;

export function StatsBar() {
  const { t } = useLanguage();

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statKeys.map((key, i) => (
          <div key={key} className="text-center">
            <div className="text-2xl mb-1">{statIcons[i]}</div>
            <div className="text-lg font-extrabold text-emerald-600">
              {statValues[i]}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {t(key)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
