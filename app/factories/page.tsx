"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";
import { SuggestModal } from "@/src/components/SuggestModal";
import { FactoryFilters } from "@/src/components/FactoryFilters";
import { useLanguage } from "@/src/contexts/LanguageContext";
import { DEFAULT_FACTORY_IMAGE } from "@/src/lib/constants";
import { useDebounce } from "@/src/lib/hooks/useDebounce";

interface Factory {
  id: number;
  name: string;
  operator: string | null;
  district: string | null;
  province: string | null;
  workers: number | null;
  country: string;
  type: string | null;
  image: string | null;
}

interface FactoryResponse {
  data: Factory[];
  total: number;
}

const WORKER_RANGES: Record<string, { min?: number; max?: number }> = {
  small: { min: 1, max: 100 },
  medium: { min: 101, max: 500 },
  large: { min: 501 },
};

export default function FactoriesPage() {
  const { t } = useLanguage();
  const [factories, setFactories] = useState<Factory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedWorkerRange, setSelectedWorkerRange] = useState("");
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 12;
  const debouncedQuery = useDebounce(searchQuery, 300);
  const abortRef = useRef<AbortController | null>(null);

  const fetchFactories = useCallback(async (query: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("search", query);
      if (selectedRegion) params.set("province", selectedRegion);
      const range = WORKER_RANGES[selectedWorkerRange];
      if (range?.min !== undefined) params.set("workers_min", String(range.min));
      if (range?.max !== undefined) params.set("workers_max", String(range.max));
      params.set("limit", limit.toString());
      params.set("offset", ((page - 1) * limit).toString());
      const res = await fetch(`/api/factories?${params}`, {
        signal: controller.signal,
      });
      if (!res.ok) {
        setFactories([]);
        setTotal(0);
        return;
      }
      const data: FactoryResponse = await res.json();
      setFactories(data?.data ?? []);
      setTotal(data?.total ?? 0);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("Error fetching factories:", error);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [selectedRegion, selectedWorkerRange, page, limit]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFactories(debouncedQuery);
  }, [fetchFactories, debouncedQuery]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto p-4 mt-6 w-full space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t("factoryList.title")}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {t("factoryList.subtitle")}
            </p>
          </div>
          <Link
            href="/factories/new"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition text-sm whitespace-nowrap"
          >
            {t("factoryList.submitFactory")}
          </Link>
        </div>

        {/* Search & Filters */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex flex-col gap-3">
            {/* Search input */}
            <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg overflow-hidden focus-within:ring-2 ring-emerald-500 transition">
              <span className="pl-3 text-slate-400">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder={t("factoryList.searchPlaceholder")}
                className="w-full p-3 bg-transparent outline-none text-sm"
              />
            </div>
            {/* Filter row */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <FactoryFilters
                selectedRegion={selectedRegion}
                selectedWorkerRange={selectedWorkerRange}
                onRegionChange={(value) => {
                  setSelectedRegion(value);
                  setPage(1);
                }}
                onWorkerRangeChange={(value) => {
                  setSelectedWorkerRange(value);
                  setPage(1);
                }}
                onClear={() => {
                  setSelectedRegion("");
                  setSelectedWorkerRange("");
                  setPage(1);
                }}
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {loading ? (
            t("factoryList.loading")
          ) : (
            t("factoryList.showing").replace("{count}", String(factories.length)).replace("{total}", String(total))
          )}
        </div>

        {/* Factory Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 animate-pulse"
              >
                <div className="h-5 bg-slate-200 dark:bg-slate-600 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : factories.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
            <p className="text-slate-500 dark:text-slate-400 mb-4">{t("factoryList.empty")}</p>
            <button
              onClick={() => setShowSuggestModal(true)}
              className="text-emerald-600 font-medium hover:underline"
            >
              {t("factoryList.suggestFactory")}
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {factories.map((factory) => (
              <Link
                key={factory.id}
                href={`/factories/${factory.id}`}
                className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition block group"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={factory.image || DEFAULT_FACTORY_IMAGE}
                      alt={factory.name}
                      className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                    />
                    <h3 className="font-bold text-emerald-700 group-hover:text-emerald-600 line-clamp-2">
                      {factory.name}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800 px-3 py-1 rounded-full whitespace-nowrap ml-2">
                    🇹🇭
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                  {[factory.district, factory.province].filter(Boolean).join(", ") ||
                    "Thailand"}
                </p>
                {factory.workers && (
                  <p className="text-xs text-slate-400">
                    {factory.workers.toLocaleString()} {t("factoryList.workers")}
                  </p>
                )}
                {factory.type && (
                  <p className="text-xs text-slate-400 mt-1">{factory.type}</p>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-medium disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              {t("factoryList.previous")}
            </button>
            <span className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300">
              {t("factoryList.pageOf").replace("{page}", String(page)).replace("{total}", String(totalPages))}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-medium disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              {t("factoryList.next")}
            </button>
          </div>
        )}
      </main>

      <Footer />

      <SuggestModal
        isOpen={showSuggestModal}
        onClose={() => setShowSuggestModal(false)}
      />
    </div>
  );
}
