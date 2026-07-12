"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";
import { Card, CardContent } from "@/src/components/Card";
import { LoginForm } from "@/src/components/LoginForm";
import { useLanguage } from "@/src/contexts/LanguageContext";

export default function LoginPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-md mx-auto p-4 mt-12 w-full">
        <Card>
          <CardContent>
            <h1 className="text-2xl font-bold mb-6 text-center">{t("login.title")}</h1>
            <Suspense>
              <LoginForm />
            </Suspense>
            <p className="text-sm text-gray-500 text-center mt-6">
              {t("login.noAccount")}{" "}
              <Link href="/register" className="text-emerald-600 hover:underline">
                {t("login.createOne")}
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
