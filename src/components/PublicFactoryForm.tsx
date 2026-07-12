"use client";

import { useState } from "react";
import { Input } from "@/src/components/Input";
import { Select } from "@/src/components/Select";
import { Button } from "@/src/components/Button";

interface PublicFactoryFormData {
  name: string;
  regNumber: string;
  operator: string;
  businessActivity: string;
  houseNumber: string;
  village: string;
  soi: string;
  road: string;
  subdistrict: string;
  district: string;
  province: string;
  postalCode: string;
  phone: string;
  type: string;
  workers: string;
  country: string;
}

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

const initialFormData: PublicFactoryFormData = {
  name: "",
  regNumber: "",
  operator: "",
  businessActivity: "",
  houseNumber: "",
  village: "",
  soi: "",
  road: "",
  subdistrict: "",
  district: "",
  province: "",
  postalCode: "",
  phone: "",
  type: "",
  workers: "",
  country: "Thailand",
};

export function PublicFactoryForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<PublicFactoryFormData>(initialFormData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const payload = {
        ...formData,
        workers: formData.workers ? parseInt(formData.workers) : null,
      };

      const res = await fetch("/api/factories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit factory");
      }

      setSuccess(true);
      setFormData(initialFormData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Notice */}
      <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm">
        📝 Your submission will be reviewed by an admin before appearing
        publicly.
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

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-800 p-4 rounded-xl text-sm">
          ✅ Factory submitted successfully! It will appear after admin review.
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" isLoading={submitting}>
          Submit Factory
        </Button>
      </div>
    </form>
  );
}
