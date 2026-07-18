"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "./Input";
import { PasswordInput } from "./PasswordInput";
import { Button } from "./Button";
import { useLanguage } from "@/src/contexts/LanguageContext";

export function RegisterForm() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: "",
    nickname: "",
    email: "",
    password: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [verificationResent, setVerificationResent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register");
      }

      // Check if verification was resent to existing unverified account
      if (data.data?.message === "verification_resent") {
        setVerificationResent(true);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (verificationResent) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">📧</div>
        <p className="text-emerald-600 dark:text-emerald-400 font-medium">
          {t("register.verificationResent")}
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">✅</div>
        <p className="text-emerald-600 dark:text-emerald-400 font-medium">
          {t("register.checkEmail")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label={t("register.fullName")}
        required
        placeholder={t("register.fullNamePlaceholder")}
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
      />

      <div>
        <Input
          label={t("register.nickname")}
          placeholder={t("register.nicknamePlaceholder")}
          value={formData.nickname}
          onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
        />
        <p className="mt-1 text-xs text-gray-500">
          {t("register.nicknameHint")}
        </p>
      </div>

      <Input
        label={t("login.email")}
        type="email"
        required
        placeholder={t("login.emailPlaceholder")}
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />

      <PasswordInput
        label={t("login.password")}
        required
        minLength={8}
        placeholder={t("login.passwordPlaceholder")}
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-3 rounded-lg text-sm">{error}</div>
      )}

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
        />
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {t("register.agreeToTerms")}{" "}
          <Link
            href="/terms"
            rel="noopener noreferrer"
            className="text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            {t("register.agreeToTermsLink")}
          </Link>
          {t("register.agreeToTermsEnd")}
        </span>
      </label>

      <Button type="submit" isLoading={submitting} className="w-full" disabled={!agreedToTerms}>
        {t("register.createAccount")}
      </Button>
    </form>
  );
}
