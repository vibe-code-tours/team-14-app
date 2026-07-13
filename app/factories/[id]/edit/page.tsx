"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/src/contexts/LanguageContext";
import { UserAuthGuard } from "@/src/components/UserAuthGuard";
import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";
import { PublicFactoryForm } from "@/src/components/PublicFactoryForm";

interface Factory {
  id: number;
  name: string;
  regNumber: string | null;
  operator: string | null;
  businessActivity: string | null;
  houseNumber: string | null;
  village: string | null;
  soi: string | null;
  road: string | null;
  subdistrict: string | null;
  district: string | null;
  province: string | null;
  postalCode: string | null;
  phone: string | null;
  type: string | null;
  workers: number | null;
  country: string | null;
}

export default function EditFactoryPage() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const factoryId = params.id as string;

  const [factory, setFactory] = useState<Factory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFactory = async () => {
      try {
        const res = await fetch(`/api/factories/${factoryId}`);
        if (!res.ok) {
          throw new Error("Factory not found");
        }
        const data = await res.json();
        setFactory(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load factory");
      } finally {
        setLoading(false);
      }
    };

    fetchFactory();
  }, [factoryId]);

  const handleSuccess = () => {
    router.push("/my-factories");
  };

  return (
    <UserAuthGuard>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto w-full p-4">
          {/* Back Link */}
          <Link
            href="/my-factories"
            className="inline-flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 mb-4 transition"
          >
            {t("editFactory.back")}
          </Link>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {t("editFactory.title")}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {t("editFactory.subtitle")}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-100 dark:border-slate-700 animate-pulse">
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-100 dark:border-slate-700 text-center">
              <div className="text-4xl mb-4">❌</div>
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Link
                href="/my-factories"
                className="inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition text-sm font-medium"
              >
                {t("editFactory.back")}
              </Link>
            </div>
          )}

          {/* Edit Form */}
          {!loading && !error && factory && (
            <PublicFactoryForm
              mode="edit"
              initialData={{
                id: factory.id,
                name: factory.name,
                regNumber: factory.regNumber || "",
                operator: factory.operator || "",
                businessActivity: factory.businessActivity || "",
                houseNumber: factory.houseNumber || "",
                village: factory.village || "",
                soi: factory.soi || "",
                road: factory.road || "",
                subdistrict: factory.subdistrict || "",
                district: factory.district || "",
                province: factory.province || "",
                postalCode: factory.postalCode || "",
                phone: factory.phone || "",
                type: factory.type || "",
                workers: factory.workers ? String(factory.workers) : "",
                country: factory.country || "Thailand",
              }}
              onSuccess={handleSuccess}
            />
          )}
        </main>
        <Footer />
      </div>
    </UserAuthGuard>
  );
}
