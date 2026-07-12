"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";
import { SuggestModal } from "@/src/components/SuggestModal";
import { PrivacyBanner } from "@/src/components/PrivacyBanner";
import { StatsBar } from "@/src/components/StatsBar";
import { FactoryFilters } from "@/src/components/FactoryFilters";
import { AboutUs } from "@/src/components/AboutUs";
import { ContactLinks } from "@/src/components/ContactLinks";
import { useLanguage } from "@/src/contexts/LanguageContext";

interface Factory {
  id: number;
  name: string;
  operator: string | null;
  district: string | null;
  province: string | null;
  workers: number | null;
  country: string;
}

interface FactoryResponse {
  data: Factory[];
  total: number;
}

export default function Home() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [factories, setFactories] = useState<Factory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedWorkerRange, setSelectedWorkerRange] = useState("");

  const fetchFactories = useCallback(async (search?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedRegion) params.set("region", selectedRegion);

      const res = await fetch(`/api/factories?${params}`);
      const data: FactoryResponse = await res.json();

      let filtered = data.data;

      // Apply worker range filter client-side
      if (selectedWorkerRange) {
        filtered = filtered.filter((factory) => {
          const workers = factory.workers || 0;
          switch (selectedWorkerRange) {
            case "small":
              return workers >= 1 && workers <= 100;
            case "medium":
              return workers >= 101 && workers <= 500;
            case "large":
              return workers > 500;
            default:
              return true;
          }
        });
      }

      // Limit to 10 factories for landing page
      setFactories(filtered.slice(0, 10));
    } catch (error) {
      console.error("Error fetching factories:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedRegion, selectedWorkerRange]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFactories();
  }, [fetchFactories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFactories(searchQuery);
  };

  const handleClearFilters = () => {
    setSelectedRegion("");
    setSelectedWorkerRange("");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <Navbar />

      {/* Privacy Banner */}
      <PrivacyBanner />

      <main className="flex-grow max-w-5xl mx-auto p-4 mt-6 w-full space-y-8 animate-fade-in">
        {/* Search Hero */}
        <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-2xl shadow-sm text-center border border-slate-100 dark:border-slate-700">
          <h2 className="text-3xl font-extrabold mb-8 text-slate-800 dark:text-slate-100">
            {t("hero.title")}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{t("hero.subtitle")}</p>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl overflow-hidden focus-within:ring-2 focus:ring-emerald-500 transition shadow-inner">
              <span className="pl-4 text-slate-400">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("hero.placeholder")}
                className="w-full min-w-0 p-4 bg-transparent outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="bg-emerald-600 text-white px-4 py-4 sm:px-6 font-medium hover:bg-emerald-700 transition active:scale-95 shrink-0"
              >
                {t("hero.searchButton")}
              </button>
            </div>
          </form>
        </div>

        {/* Stats Bar */}
        <StatsBar />

        {/* Factories Section */}
        <div>
          <div className="flex flex-row justify-between items-center gap-2 mb-4 border-b border-slate-200 dark:border-slate-600 pb-2">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>🏭</span> {t("factories.title")}
            </h3>
            <Link
              href="/factories"
              className="text-emerald-600 text-sm font-medium hover:underline"
            >
              {t("factories.viewAll")}
            </Link>
          </div>

          {/* Filters */}
          <div className="mb-4">
            <FactoryFilters
              selectedRegion={selectedRegion}
              selectedWorkerRange={selectedWorkerRange}
              onRegionChange={setSelectedRegion}
              onWorkerRangeChange={setSelectedWorkerRange}
              onClear={handleClearFilters}
            />
          </div>

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
              <p className="text-slate-500 dark:text-slate-400 mb-4">{t("factories.noResults")}</p>
              <button
                onClick={handleClearFilters}
                className="text-emerald-600 font-medium hover:underline"
              >
                {t("factories.clearFilters")}
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {factories.map((factory) => (
                <Link
                  key={factory.id}
                  href={`/factories/${factory.id}`}
                  className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer hover:shadow-md transition block group"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-lg text-emerald-700 group-hover:text-emerald-600 line-clamp-1">
                      {factory.name}
                    </h4>
                    <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                      🇹🇭
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                    {[factory.district, factory.province]
                      .filter(Boolean)
                      .join(", ") || t("factoryList.thailand")}
                  </p>
                  {factory.workers && (
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {factory.workers.toLocaleString()} {t("factoryList.workers")}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* About Us */}
        <AboutUs />

        {/* Contact Links */}
        <ContactLinks />
      </main>

      <Footer />

      <SuggestModal
        isOpen={showSuggestModal}
        onClose={() => setShowSuggestModal(false)}
      />
    </div>
  );
}
