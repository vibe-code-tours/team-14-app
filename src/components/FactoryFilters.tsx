"use client";

import { useLanguage } from "@/src/contexts/LanguageContext";

interface FactoryFiltersProps {
  selectedRegion: string;
  selectedWorkerRange: string;
  onRegionChange: (value: string) => void;
  onWorkerRangeChange: (value: string) => void;
  onClear: () => void;
}

export function FactoryFilters({
  selectedRegion,
  selectedWorkerRange,
  onRegionChange,
  onWorkerRangeChange,
  onClear,
}: FactoryFiltersProps) {
  const { t } = useLanguage();
  const hasFilters = selectedRegion || selectedWorkerRange;

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      {/* Region Filter */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {t("filters.region")}
        </label>
        <select
          value={selectedRegion}
          onChange={(e) => onRegionChange(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="">{t("filters.allRegions")}</option>
          <option value="Bangkok_and_Central">Bangkok & Central</option>
          <option value="Eastern">Eastern</option>
          <option value="Northern">Northern</option>
          <option value="Northeastern">Northeastern</option>
          <option value="Western">Western</option>
          <option value="Southern">Southern</option>
        </select>
      </div>

      {/* Worker Count Filter */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {t("filters.workers")}
        </label>
        <select
          value={selectedWorkerRange}
          onChange={(e) => onWorkerRangeChange(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="">{t("filters.anySize")}</option>
          <option value="small">{t("filters.small")}</option>
          <option value="medium">{t("filters.medium")}</option>
          <option value="large">{t("filters.large")}</option>
        </select>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <button
          onClick={onClear}
          className="text-xs text-slate-400 hover:text-slate-600 underline transition"
        >
          {t("filters.clear")}
        </button>
      )}
    </div>
  );
}
