"use client";

import { useState } from "react";
import { Input } from "@/src/components/Input";
import { Select } from "@/src/components/Select";
import { Button } from "@/src/components/Button";
import { SuccessModal } from "@/src/components/SuccessModal";
import { useLanguage } from "@/src/contexts/LanguageContext";

interface PublicFactoryFormData {
  id?: number;
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

interface PublicFactoryFormProps {
  initialData?: Partial<PublicFactoryFormData>;
  mode?: "create" | "edit";
  onSuccess?: () => void;
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

export function PublicFactoryForm({
  initialData,
  mode = "create",
  onSuccess,
}: PublicFactoryFormProps) {
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState<PublicFactoryFormData>({
    ...initialFormData,
    ...initialData,
  });

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

      const url = mode === "edit" && formData.id
        ? `/api/factories/${formData.id}`
        : "/api/factories";

      const res = await fetch(url, {
        method: mode === "edit" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit factory");
      }

      setSuccess(true);
      if (mode === "create") {
        setFormData(initialFormData);
        setShowSuccessModal(true);
      } else {
        onSuccess?.();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Notice */}
      {mode === "create" && (
        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-4 rounded-xl text-sm">
          {t("newFactory.notice")}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
          {t("factoryForm.basicInfo")}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label={t("factoryForm.factoryName")}
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder={t("factoryForm.factoryNamePlaceholder")}
          />
          <Input
            label={t("factoryForm.regNumber")}
            name="regNumber"
            value={formData.regNumber}
            onChange={handleChange}
            placeholder={t("factoryForm.regNumberPlaceholder")}
          />
          <Input
            label={t("factoryForm.operator")}
            name="operator"
            value={formData.operator}
            onChange={handleChange}
            placeholder={t("factoryForm.operatorPlaceholder")}
          />
          <Input
            label={t("factoryForm.businessActivity")}
            name="businessActivity"
            value={formData.businessActivity}
            onChange={handleChange}
            placeholder={t("factoryForm.businessActivityPlaceholder")}
          />
          <Input
            label={t("factoryForm.phone")}
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder={t("factoryForm.phonePlaceholder")}
          />
          <Input
            label={t("factoryForm.workers")}
            name="workers"
            type="number"
            value={formData.workers}
            onChange={handleChange}
            placeholder={t("factoryForm.workersPlaceholder")}
          />
        </div>
      </div>

      {/* Address */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">{t("factoryForm.address")}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label={t("factoryForm.houseNumber")}
            name="houseNumber"
            value={formData.houseNumber}
            onChange={handleChange}
            placeholder={t("factoryForm.houseNumberPlaceholder")}
          />
          <Input
            label={t("factoryForm.village")}
            name="village"
            value={formData.village}
            onChange={handleChange}
            placeholder={t("factoryForm.villagePlaceholder")}
          />
          <Input
            label={t("factoryForm.soi")}
            name="soi"
            value={formData.soi}
            onChange={handleChange}
            placeholder={t("factoryForm.soiPlaceholder")}
          />
          <Input
            label={t("factoryForm.road")}
            name="road"
            value={formData.road}
            onChange={handleChange}
            placeholder={t("factoryForm.roadPlaceholder")}
          />
          <Input
            label={t("factoryForm.subdistrict")}
            name="subdistrict"
            value={formData.subdistrict}
            onChange={handleChange}
            placeholder={t("factoryForm.subdistrictPlaceholder")}
          />
          <Input
            label={t("factoryForm.district")}
            name="district"
            value={formData.district}
            onChange={handleChange}
            placeholder={t("factoryForm.districtPlaceholder")}
          />
          <Select
            label={t("factoryForm.province")}
            name="province"
            value={formData.province}
            onChange={handleChange}
            options={provinceOptions}
            placeholder={t("factoryForm.provincePlaceholder")}
          />
          <Input
            label={t("factoryForm.postalCode")}
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder={t("factoryForm.postalCodePlaceholder")}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 p-4 rounded-xl text-sm">
          ✅ {mode === "edit"
            ? t("editFactory.success")
            : t("factorySubmitted.message")}
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" isLoading={submitting}>
          {mode === "edit" ? t("factoryForm.saveChanges") : t("factoryForm.submitFactory")}
        </Button>
      </div>
    </form>

    <SuccessModal
      isOpen={showSuccessModal}
      onClose={() => {
        setShowSuccessModal(false);
        onSuccess?.();
      }}
      title={t("factorySubmitted.title")}
      message={t("factorySubmitted.message")}
      buttonText={t("factorySubmitted.ok")}
    />
    </>
  );
}
