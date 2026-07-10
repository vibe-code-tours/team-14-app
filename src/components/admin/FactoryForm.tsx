"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/src/components/Input";
import { Select } from "@/src/components/Select";
import { Button } from "@/src/components/Button";
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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload = {
        ...formData,
        workers: formData.workers ? parseInt(formData.workers as string) : null,
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
    <form onSubmit={handleSubmit} className="space-y-6">
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
  );
}
