"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
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
  image?: string | null;
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

const DEFAULT_FACTORY_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjEuNSI+PHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIvPjxwYXRoIGQ9Ik04IDE3VjdoOXY2Ii8+PHBhdGggZD0iTTEyIDE3VjEwaDciLz48L3N2Zz4=";

export function PublicFactoryForm({
  initialData,
  mode = "create",
  onSuccess,
}: PublicFactoryFormProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [image, setImage] = useState<string | null>(initialData?.image || null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [formData, setFormData] = useState<PublicFactoryFormData>({
    ...initialFormData,
    ...initialData,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
    setSuccess(false);

    try {
      const payload = {
        ...formData,
        workers: formData.workers ? parseInt(formData.workers) : null,
        image: image || null,
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

      {/* Factory Image */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
          {t("factoryForm.factoryImage")}
        </h3>
        <div className="flex items-center gap-6">
          <div
            className="w-28 h-28 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-emerald-500 transition shrink-0"
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
              className="px-4 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition"
            >
              📁 {t("factoryForm.uploadImage")}
            </button>
            {image && (
              <button
                type="button"
                onClick={() => setImage(null)}
                className="ml-2 px-4 py-2 text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition"
              >
                ✕ {t("factoryForm.removeImage")}
              </button>
            )}
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
              {t("factoryForm.imageHint")}
            </p>
          </div>
        </div>
      </div>

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
