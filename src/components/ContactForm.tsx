"use client";

import { useState } from "react";
import { useLanguage } from "@/src/contexts/LanguageContext";
import { Button } from "@/src/components/Button";
import { Input } from "@/src/components/Input";

type FormState = "idle" | "loading" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function ContactForm() {
  const { t } = useLanguage();
  const [formState, setFormState] = useState<FormState>("idle");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t("contact.form.nameRequired");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("contact.form.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("contact.form.emailInvalid");
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t("contact.form.subjectRequired");
    }

    if (!formData.message.trim()) {
      newErrors.message = t("contact.form.messageRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setFormState("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to send");

      setFormState("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setFormState("error");
    }
  }

  function handleChange(
    field: keyof FormData,
    value: string
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleRetry() {
    setFormState("idle");
  }

  if (formState === "success") {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 md:p-8 text-center animate-fade-in">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-emerald-600 dark:text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          {t("contact.form.successTitle")}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          {t("contact.form.successMessage")}
        </p>
        <Button onClick={handleRetry} variant="secondary">
          {t("contact.form.retry")}
        </Button>
      </div>
    );
  }

  if (formState === "error") {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 md:p-8 text-center animate-fade-in">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          {t("contact.form.errorTitle")}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          {t("contact.form.errorMessage")}
        </p>
        <Button onClick={handleRetry} variant="secondary">
          {t("contact.form.retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 md:p-8 animate-fade-in">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
        {t("contact.form.title")}
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        {t("contact.form.subtitle")}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label={t("contact.form.name")}
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder={t("contact.form.namePlaceholder")}
            error={errors.name}
            autoComplete="name"
          />
          <Input
            label={t("contact.form.email")}
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder={t("contact.form.emailPlaceholder")}
            error={errors.email}
            autoComplete="email"
          />
        </div>

        <Input
          label={t("contact.form.subject")}
          type="text"
          value={formData.subject}
          onChange={(e) => handleChange("subject", e.target.value)}
          placeholder={t("contact.form.subjectPlaceholder")}
          error={errors.subject}
        />

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            {t("contact.form.message")}
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
            placeholder={t("contact.form.messagePlaceholder")}
            rows={5}
            className={`w-full px-4 py-2 border rounded-lg text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none ${
              errors.message
                ? "border-red-500"
                : "border-gray-300 dark:border-slate-600"
            }`}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
        </div>

        <Button
          type="submit"
          isLoading={formState === "loading"}
          className="w-full sm:w-auto"
        >
          {t("contact.form.submit")}
        </Button>
      </form>
    </div>
  );
}
