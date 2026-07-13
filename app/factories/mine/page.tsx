"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/src/contexts/LanguageContext";
import { UserAuthGuard } from "@/src/components/UserAuthGuard";
import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";

interface MyFactory {
  id: number;
  name: string;
  operator: string | null;
  province: string | null;
  district: string | null;
  status: "pending" | "approved" | "declined";
  createdAt: string;
}

interface MyFactoriesResponse {
  data: MyFactory[];
  total: number;
  limit: number;
  offset: number;
}

const ITEMS_PER_PAGE = 12;

export default function MyFactoriesPage() {
  const { t } = useLanguage();
  const [factories, setFactories] = useState<MyFactory[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchFactories = async () => {
      setLoading(true);
      try {
        const offset = (page - 1) * ITEMS_PER_PAGE;
        const res = await fetch(`/api/factories/mine?limit=${ITEMS_PER_PAGE}&offset=${offset}`);
        if (res.ok && !cancelled) {
          const data: MyFactoriesResponse = await res.json();
          setFactories(data.data);
          setTotal(data.total);
        }
      } catch (error) {
        console.error("Error fetching factories:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchFactories();

    return () => {
      cancelled = true;
    };
  }, [page]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      declined: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    };
    const labels = {
      pending: t("myFactories.status.pending"),
      approved: t("myFactories.status.approved"),
      declined: t("myFactories.status.declined"),
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <UserAuthGuard>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-5xl mx-auto w-full p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {t("myFactories.title")}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                {t("myFactories.subtitle")}
              </p>
            </div>
            <Link
              href="/factories/new"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition text-sm font-medium"
            >
              + New Factory
            </Link>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700 animate-pulse"
                >
                  <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && factories.length === 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-100 dark:border-slate-700 text-center">
              <div className="text-4xl mb-4">🏭</div>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {t("myFactories.empty")}
              </p>
              <Link
                href="/factories/new"
                className="inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition text-sm font-medium"
              >
                {t("myFactories.createFirst")}
              </Link>
            </div>
          )}

          {/* Factory List */}
          {!loading && factories.length > 0 && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {factories.map((factory) => (
                  <div
                    key={factory.id}
                    className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-1">
                        {factory.name}
                      </h3>
                      {getStatusBadge(factory.status)}
                    </div>
                    {factory.operator && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                        {factory.operator}
                      </p>
                    )}
                    {(factory.district || factory.province) && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                        📍 {[factory.district, factory.province].filter(Boolean).join(", ")}
                      </p>
                    )}
                    <div className="flex gap-2 mt-4">
                      <Link
                        href={`/factories/${factory.id}/edit`}
                        className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm text-center transition"
                      >
                        {t("myFactories.edit")}
                      </Link>
                      <Link
                        href={`/factories/${factory.id}`}
                        className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm text-center transition"
                      >
                        {t("myFactories.view")}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t("myFactories.previous")}
                  </button>
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {t("myFactories.pageOf")
                      .replace("{page}", String(page))
                      .replace("{total}", String(totalPages))}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t("myFactories.next")}
                  </button>
                </div>
              )}
            </>
          )}
        </main>
        <Footer />
      </div>
    </UserAuthGuard>
  );
}
