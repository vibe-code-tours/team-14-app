"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, use } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { DEFAULT_FACTORY_IMAGE } from "@/src/lib/constants";

interface FactoryData {
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
  country: string;
  status: "pending" | "approved" | "declined";
  image: string | null;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    nickname: string | null;
  } | null;
}

const statusVariant: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  declined: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function ViewFactoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [factory, setFactory] = useState<FactoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    async function fetchFactory() {
      try {
        const res = await fetch(`/api/admin/factories/${id}`);
        if (!res.ok) throw new Error("Factory not found");
        const data = await res.json();
        setFactory(data);
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
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-64 animate-pulse"></div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-4"></div>
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-slate-100 dark:bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !factory) {
    return (
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
        <p className="text-slate-500 dark:text-slate-400">{error || "Factory not found"}</p>
        <Link
          href="/admin/factories"
          className="text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:underline mt-4 inline-block"
        >
          ← Back to Factories
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in" style={{ animationDelay: "0ms" }}>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">👁️ View Factory</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{factory.name}</p>
        </div>
        <div>
          <Link
            href="/admin/factories"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 px-4 py-2 rounded-lg transition"
          >
            ← Back
          </Link>
        </div>
      </div>

      {/* Factory Image */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 animate-fade-in" style={{ animationDelay: "150ms" }}>
        <div className="flex items-center gap-4">
          <div
            className={`w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center ${factory.image ? "cursor-pointer hover:ring-2 hover:ring-emerald-500 transition" : ""}`}
            onClick={() => factory.image && setShowLightbox(true)}
          >
            {factory.image ? (
              <img src={factory.image} alt={factory.name} className="w-full h-full object-cover" />
            ) : (
              <img src={DEFAULT_FACTORY_IMAGE} alt={factory.name} className="w-full h-full object-cover" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{factory.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{factory.regNumber || "No registration number"}</p>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 animate-fade-in" style={{ animationDelay: "300ms" }}>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">📋 Basic Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Factory Name</label>
            <p className="mt-1 text-sm text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">{factory.name}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Registration Number</label>
            <p className="mt-1 text-sm text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">{factory.regNumber || "—"}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Operator</label>
            <p className="mt-1 text-sm text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">{factory.operator || "—"}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Business Activity</label>
            <p className="mt-1 text-sm text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">{factory.businessActivity || "—"}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone</label>
            <p className="mt-1 text-sm text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">{factory.phone || "—"}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Number of Workers</label>
            <p className="mt-1 text-sm text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">{factory.workers?.toLocaleString() || "—"}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Creator</label>
            <p className="mt-1 text-sm text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">{factory.user?.nickname || factory.user?.fullName || "—"}</p>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 animate-fade-in" style={{ animationDelay: "450ms" }}>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">📍 Address</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">House Number</label>
            <p className="mt-1 text-sm text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">{factory.houseNumber || "—"}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Village</label>
            <p className="mt-1 text-sm text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">{factory.village || "—"}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Soi</label>
            <p className="mt-1 text-sm text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">{factory.soi || "—"}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Road</label>
            <p className="mt-1 text-sm text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">{factory.road || "—"}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Subdistrict</label>
            <p className="mt-1 text-sm text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">{factory.subdistrict || "—"}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">District</label>
            <p className="mt-1 text-sm text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">{factory.district || "—"}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Province</label>
            <p className="mt-1 text-sm text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">{factory.province || "—"}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Postal Code</label>
            <p className="mt-1 text-sm text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">{factory.postalCode || "—"}</p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 animate-fade-in" style={{ animationDelay: "600ms" }}>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">⚙️ Status</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Factory Status</label>
            <p className="mt-1">
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusVariant[factory.status]}`}>
                {factory.status.charAt(0).toUpperCase() + factory.status.slice(1)}
              </span>
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Country</label>
            <p className="mt-1 text-sm text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">{factory.country}</p>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      {showLightbox && factory.image && createPortal(
        <div
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backgroundColor: "rgba(0,0,0,0.8)" }}
          onClick={() => setShowLightbox(false)}
        >
          <img
            src={factory.image}
            alt={factory.name}
            style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain" }}
          />
        </div>,
        document.body
      )}
    </div>
  );
}
