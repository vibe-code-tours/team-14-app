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
}

interface FactoryResponse {
  data: Factory[];
  total: number;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [factories, setFactories] = useState<Factory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuggestModal, setShowSuggestModal] = useState(false);

  const fetchFactories = useCallback(async (search?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("limit", "6");

      const res = await fetch(`/api/factories?${params}`);
      const data: FactoryResponse = await res.json();
      setFactories(data.data);
    } catch (error) {
      console.error("Error fetching factories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFactories();
  }, [fetchFactories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFactories(searchQuery);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar onSuggestClick={() => setShowSuggestModal(true)} />

      <main className="flex-grow max-w-5xl mx-auto p-4 mt-6 w-full space-y-8 animate-fade-in">
        {/* Search Hero */}
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm text-center border border-gray-100">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900">
            Find a safe workplace
          </h2>
          <p className="text-gray-500 mb-6">
            Real reviews from migrant workers in Thailand 🇹🇭
          </p>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex items-center bg-gray-50 border rounded-xl overflow-hidden focus-within:ring-2 ring-emerald-500 transition shadow-inner">
              <span className="pl-4 text-gray-400">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search factory name / စက်ရုံအမည်ကို ရှာဖွေပါ..."
                className="w-full p-4 bg-transparent outline-none"
              />
              <button
                type="submit"
                className="bg-emerald-600 text-white px-6 py-4 font-medium hover:bg-emerald-700 transition"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Factories Section */}
        <div>
          <div className="flex justify-between items-end mb-4 border-b pb-2">
            <h3 className="text-xl font-bold">🏭 Factories</h3>
            <Link
              href="/factories"
              className="text-emerald-600 text-sm font-medium hover:underline"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 animate-pulse"
                >
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : factories.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
              No factories found. Try a different search term.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {factories.map((factory) => (
                <Link
                  key={factory.id}
                  href={`/factories/${factory.id}`}
                  className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition block"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-lg text-emerald-700 line-clamp-1">
                      {factory.name}
                    </h4>
                    <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded whitespace-nowrap ml-2">
                      🇹🇭 TH
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    {[factory.district, factory.province].filter(Boolean).join(", ") || "Thailand"}
                  </p>
                  {factory.workers && (
                    <p className="text-xs text-gray-400">
                      {factory.workers.toLocaleString()} workers
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 md:p-8">
          <h3 className="text-lg font-bold text-emerald-800 mb-2">
            ℹ️ About WorkerVoice
          </h3>
          <p className="text-emerald-700 text-sm leading-relaxed">
            WorkerVoice helps migrant workers make informed decisions about
            workplaces. Read anonymous reviews from other workers about salary,
            overtime, housing conditions, and more. Your identity is always
            protected.
          </p>
        </div>
      </main>

      <Footer />

      <SuggestModal
        isOpen={showSuggestModal}
        onClose={() => setShowSuggestModal(false)}
      />
    </div>
  );
}
