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

  const selectClass = "w-full sm:w-auto border border-slate-200 dark:border-slate-600 rounded-lg pl-3 pr-8 py-2 text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-no-repeat bg-[position:right_0.5rem_center] focus:ring-2 focus:ring-emerald-500 outline-none appearance-none";

  return (
    <div className="flex flex-col gap-3">
      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Region Filter */}
        <div className="flex-1 sm:flex-none">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 sm:hidden">
            {t("filters.region")}
          </label>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t("filters.region")}
            </span>
            <select
              value={selectedRegion}
              onChange={(e) => onRegionChange(e.target.value)}
              className={selectClass}
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
        </div>

        {/* Worker Count Filter */}
        <div className="flex-1 sm:flex-none">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 sm:hidden">
            {t("filters.workers")}
          </label>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t("filters.workers")}
            </span>
            <select
              value={selectedWorkerRange}
              onChange={(e) => onWorkerRangeChange(e.target.value)}
              className={selectClass}
            >
              <option value="">{t("filters.anySize")}</option>
              <option value="small">{t("filters.small")}</option>
              <option value="medium">{t("filters.medium")}</option>
              <option value="large">{t("filters.large")}</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {hasFilters && (
          <button
            onClick={onClear}
            className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 underline transition sm:ml-2"
          >
            {t("filters.clear")}
          </button>
        )}
      </div>
    </div>
  );
}
