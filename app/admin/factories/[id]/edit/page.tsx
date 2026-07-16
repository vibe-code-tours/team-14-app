"use client";

import { useState, useEffect, use } from "react";
import { FactoryForm } from "@/src/components/admin/FactoryForm";
import type { FactoryFormData } from "@/src/types/admin";

export default function EditFactoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [factory, setFactory] = useState<FactoryFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFactory() {
      try {
        const res = await fetch(`/api/admin/factories/${id}`);
        if (!res.ok) throw new Error("Factory not found");
        const data = await res.json();
        setFactory({
          name: data.name || "",
          regNumber: data.regNumber || "",
          operator: data.operator || "",
          businessActivity: data.businessActivity || "",
          houseNumber: data.houseNumber || "",
          village: data.village || "",
          soi: data.soi || "",
          road: data.road || "",
          subdistrict: data.subdistrict || "",
          district: data.district || "",
          province: data.province || "",
          postalCode: data.postalCode || "",
          phone: data.phone || "",
          type: data.type || "",
          workers: data.workers?.toString() || "",
          country: data.country || "Thailand",
          status: data.status || "pending",
          image: data.image || null,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load factory");
      } finally {
        setLoading(false);
      }
    }
    fetchFactory();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 bg-slate-200 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded w-64 animate-pulse"></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-32 mb-4"></div>
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-slate-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !factory) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
        <p className="text-slate-500">{error || "Factory not found"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          ✏️ Edit Factory
        </h1>
        <p className="text-slate-500 text-sm">{factory.name}</p>
      </div>
      <FactoryForm mode="edit" initialData={factory} factoryId={parseInt(id)} />
    </div>
  );
}
