"use client";

import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "./Input";
import { PasswordInput } from "./PasswordInput";
import { Button } from "./Button";
import { useLanguage } from "@/src/contexts/LanguageContext";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(t("login.invalidCredentials"));
      setSubmitting(false);
      return;
    }

    // Check session
    const res = await fetch("/api/auth/session");
    const text = await res.text();
    const session = text ? JSON.parse(text) : null;

    // Block admin accounts from user login
    if (session?.user?.isAdmin) {
      await signOut({ redirect: false });
      setError("Admin accounts must use the admin login page");
      setSubmitting(false);
      return;
    }

    router.push(callbackUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label={t("login.email")}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <PasswordInput
        label={t("login.password")}
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <div className="bg-red-50 text-red-800 p-3 rounded-lg text-sm">{error}</div>
      )}

      <Button type="submit" isLoading={submitting} className="w-full">
        {t("nav.login")}
      </Button>

      <p className="text-sm text-gray-500 text-center">
        <Link href="/reset-password" className="text-emerald-600 hover:underline">
          {t("login.forgotPassword")}
        </Link>
      </p>
    </form>
  );
}
