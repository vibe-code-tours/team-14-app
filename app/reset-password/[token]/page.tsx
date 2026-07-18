"use client";

import { use } from "react";
import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";
import { Card, CardContent } from "@/src/components/Card";
import { ConfirmResetForm } from "@/src/components/ResetPasswordForm";
import { useLanguage } from "@/src/contexts/LanguageContext";

export default function ConfirmResetPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-md mx-auto p-4 mt-12 w-full">
        <Card>
          <CardContent>
            <h1 className="text-2xl font-bold mb-6 text-center text-slate-800 dark:text-slate-100">{t("resetPassword.chooseNewPassword")}</h1>
            <ConfirmResetForm token={token} />
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
