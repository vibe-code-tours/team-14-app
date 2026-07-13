"use client";

import { useRouter } from "next/navigation";
import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";
import { UserAuthGuard } from "@/src/components/UserAuthGuard";
import { PublicFactoryForm } from "@/src/components/PublicFactoryForm";
import { useLanguage } from "@/src/contexts/LanguageContext";

export default function NewFactoryPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleSuccess = () => {
    router.push("/my-factories");
  };

  return (
    <UserAuthGuard>
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 animate-fade-in">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {t("newFactory.title")}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {t("newFactory.subtitle")}
            </p>
          </div>
          <PublicFactoryForm onSuccess={handleSuccess} />
        </main>
        <Footer />
      </div>
    </UserAuthGuard>
  );
}
