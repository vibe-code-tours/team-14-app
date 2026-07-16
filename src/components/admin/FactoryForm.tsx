"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Input } from "@/src/components/Input";
import { Select } from "@/src/components/Select";
import { Button } from "@/src/components/Button";
import { DEFAULT_FACTORY_IMAGE } from "@/src/lib/constants";
import type { FactoryFormData } from "@/src/types/admin";

interface FactoryFormProps {
  mode: "create" | "edit";
  initialData?: Partial<FactoryFormData>;
  factoryId?: number;
}

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "declined", label: "Declined" },
];

const provinceOptions = [
  { value: "Bangkok", label: "Bangkok" },
  { value: "Chonburi", label: "Chonburi" },
  { value: "Rayong", label: "Rayong" },
  { value: "Samut Prakan", label: "Samut Prakan" },
  { value: "Pathum Thani", label: "Pathum Thani" },
  { value: "Nakhon Ratchasima", label: "Nakhon Ratchasima" },
  { value: "Chiang Mai", label: "Chiang Mai" },
  { value: "Khon Kaen", label: "Khon Kaen" },
  { value: "Hat Yai", label: "Hat Yai (Songkhla)" },
];

export function FactoryForm({ mode, initialData, factoryId }: FactoryFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState<string | null>(initialData?.image || null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [formData, setFormData] = useState<FactoryFormData>({
    name: initialData?.name || "",
    regNumber: initialData?.regNumber || "",
    operator: initialData?.operator || "",
    businessActivity: initialData?.businessActivity || "",
    houseNumber: initialData?.houseNumber || "",
    village: initialData?.village || "",
    soi: initialData?.soi || "",
    road: initialData?.road || "",
    subdistrict: initialData?.subdistrict || "",
    district: initialData?.district || "",
    province: initialData?.province || "",
    postalCode: initialData?.postalCode || "",
    phone: initialData?.phone || "",
    type: initialData?.type || "",
    workers: initialData?.workers || "",
    country: initialData?.country || "Thailand",
    status: initialData?.status || "pending",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 400;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const scale = Math.max(size / img.width, size / img.height);
        const x = (size - img.width * scale) / 2;
        const y = (size - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        setImage(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload = {
        ...formData,
        workers: formData.workers ? parseInt(formData.workers as string) : null,
        image: image || null,
      };

      const url =
        mode === "create"
          ? "/api/admin/factories"
          : `/api/admin/factories/${factoryId}`;

      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save factory");
      }

      router.push("/admin/factories");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Factory Image */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">🖼️ Factory Image</h3>
        <div className="flex items-center gap-6">
          <div
            className="w-28 h-28 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-emerald-500 transition shrink-0"
            onClick={() => image && setShowLightbox(true)}
          >
            <img
              src={image || DEFAULT_FACTORY_IMAGE}
              alt="Factory"
              className={image ? "w-full h-full object-cover" : "w-12 h-12 opacity-40"}
            />
          </div>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
            >
              📁 Upload Logo
            </button>
            {image && (
              <button
                type="button"
                onClick={() => setImage(null)}
                className="ml-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition"
              >
                ✕ Remove
              </button>
            )}
            <p className="text-xs text-slate-400 mt-2">
              JPG or PNG, will be cropped to a square.
            </p>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">
          📋 Basic Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Factory Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter factory name"
          />
          <Input
            label="Registration Number"
            name="regNumber"
            value={formData.regNumber}
            onChange={handleChange}
            placeholder="e.g. 0105519000001"
          />
          <Input
            label="Operator"
            name="operator"
            value={formData.operator}
            onChange={handleChange}
            placeholder="Company operator name"
          />
          <Input
            label="Business Activity"
            name="businessActivity"
            value={formData.businessActivity}
            onChange={handleChange}
            placeholder="e.g. Textile manufacturing"
          />
          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Contact phone number"
          />
          <Input
            label="Number of Workers"
            name="workers"
            type="number"
            value={formData.workers}
            onChange={handleChange}
            placeholder="e.g. 500"
          />
        </div>
      </div>

      {/* Address */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">📍 Address</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="House Number"
            name="houseNumber"
            value={formData.houseNumber}
            onChange={handleChange}
            placeholder="House/Building number"
          />
          <Input
            label="Village"
            name="village"
            value={formData.village}
            onChange={handleChange}
            placeholder="Village/Moo"
          />
          <Input
            label="Soi"
            name="soi"
            value={formData.soi}
            onChange={handleChange}
            placeholder="Soi"
          />
          <Input
            label="Road"
            name="road"
            value={formData.road}
            onChange={handleChange}
            placeholder="Road name"
          />
          <Input
            label="Subdistrict"
            name="subdistrict"
            value={formData.subdistrict}
            onChange={handleChange}
            placeholder="Subdistrict (Tambon)"
          />
          <Input
            label="District"
            name="district"
            value={formData.district}
            onChange={handleChange}
            placeholder="District (Amphoe)"
          />
          <Select
            label="Province"
            name="province"
            value={formData.province}
            onChange={handleChange}
            options={provinceOptions}
            placeholder="Select province"
          />
          <Input
            label="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="e.g. 10110"
          />
        </div>
      </div>

      {/* Status */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">⚙️ Status</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Select
            label="Factory Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={statusOptions}
          />
          <Input
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={submitting}>
          {mode === "create" ? "Create Factory" : "Save Changes"}
        </Button>
      </div>
    </form>

    {showLightbox &&
      image &&
      createPortal(
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backgroundColor: "rgba(0,0,0,0.8)",
          }}
          onClick={() => setShowLightbox(false)}
        >
          <img
            src={image}
            alt="Factory"
            style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain" }}
          />
        </div>,
        document.body
      )}
    </>
  );
}
