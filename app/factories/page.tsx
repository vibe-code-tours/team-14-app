"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";
import { SuggestModal } from "@/src/components/SuggestModal";

interface Factory {
  id: number;
  name: string;
  operator: string | null;
  district: string | null;
  province: string | null;
  workers: number | null;
  country: string;
  type: string | null;
}

interface FactoryResponse {
  data: Factory[];
  total: number;
}

export default function FactoriesPage() {
  const [factories, setFactories] = useState<Factory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 12;

  const fetchFactories = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (selectedRegion) params.set("region", selectedRegion);
      params.set("limit", limit.toString());
      params.set("offset", ((page - 1) * limit).toString());

      const res = await fetch(`/api/factories?${params}`);
      const data: FactoryResponse = await res.json();
      setFactories(data.data);
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching factories:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedRegion, page, limit]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFactories();
  }, [fetchFactories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchFactories();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar onSuggestClick={() => setShowSuggestModal(true)} />

      <main className="flex-grow max-w-5xl mx-auto p-4 mt-6 w-full space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">🏭 Factories</h1>
            <p className="text-slate-500 text-sm">
              Browse verified factories in Thailand
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 ring-emerald-500 transition">
              <span className="pl-3 text-slate-400">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by factory name..."
                className="w-full p-3 bg-transparent outline-none text-sm"
              />
            </div>
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setPage(1);
              }}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 ring-emerald-500 outline-none"
            >
              <option value="">All Regions</option>
              <option value="Bangkok_and_Central">Bangkok & Central</option>
              <option value="Eastern">Eastern</option>
              <option value="Northern">Northern</option>
              <option value="Northeastern">Northeastern</option>
              <option value="Western">Western</option>
              <option value="Southern">Southern</option>
            </select>
            <button
              type="submit"
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition text-sm"
            >
              Search
            </button>
          </form>
        </div>

        {/* Results Count */}
        <div className="text-sm text-slate-500">
          {loading ? (
            "Loading..."
          ) : (
            <>
              Showing {factories.length} of {total} factories
            </>
          )}
        </div>

        {/* Factory Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 animate-pulse"
              >
                <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : factories.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
            <p className="text-slate-500 mb-4">No factories found</p>
            <button
              onClick={() => setShowSuggestModal(true)}
              className="text-emerald-600 font-medium hover:underline"
            >
              Suggest a factory →
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {factories.map((factory) => (
              <Link
                key={factory.id}
                href={`/factories/${factory.id}`}
                className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition block group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-emerald-700 group-hover:text-emerald-600 line-clamp-2">
                    {factory.name}
                  </h3>
                  <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded whitespace-nowrap ml-2">
                    🇹🇭
                  </span>
                </div>
                <p className="text-sm text-slate-500 mb-2">
                  {[factory.district, factory.province].filter(Boolean).join(", ") ||
                    "Thailand"}
                </p>
                {factory.workers && (
                  <p className="text-xs text-slate-400">
                    {factory.workers.toLocaleString()} workers
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
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium disabled:opacity-50 hover:bg-slate-50 transition"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-slate-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium disabled:opacity-50 hover:bg-slate-50 transition"
            >
              Next
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
