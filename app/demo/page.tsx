"use client";

import Link from "next/link";
import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";
import { Card, CardContent } from "@/src/components/Card";
import { useLanguage } from "@/src/contexts/LanguageContext";

const demoAccounts = [
  {
    roleKey: "demo.userAccount",
    url: "https://workervoice.help/",
    email: "demo@workervoice.org",
    password: "Demo1234!",
    featuresKey: "demo.userFeatures",
    color: "emerald",
  },
  {
    roleKey: "demo.superAdminAccount",
    url: "https://workervoice.help/admin",
    email: "demo-superadmin@workervoice.org",
    password: "Demo1234!",
    featuresKey: "demo.superAdminFeatures",
    color: "purple",
  },
  {
    roleKey: "demo.adminAccount",
    url: "https://workervoice.help/admin",
    email: "demo-admin@workervoice.org",
    password: "Demo1234!",
    featuresKey: "demo.adminFeatures",
    color: "blue",
  },
  {
    roleKey: "demo.telegramBot",
    url: "https://t.me/workervoice69_bot",
    featuresKey: "demo.telegramFeatures",
    color: "sky",
  },
];

export default function DemoPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-2xl mx-auto p-4 mt-12 w-full">
        <Card>
          <CardContent>
            <h1 className="text-2xl font-bold mb-2 text-center">
              {t("demo.title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
              {t("demo.subtitle")}
            </p>

            {/* Demo Accounts */}
            <div className="space-y-4 mb-8">
              {demoAccounts.map((account) => (
                <div
                  key={account.email ?? account.url}
                  className={`p-4 rounded-xl border ${
                    account.color === "emerald"
                      ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20"
                      : account.color === "blue"
                        ? "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20"
                        : account.color === "purple"
                          ? "border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20"
                          : "border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-900/20"
                  }`}
                >
                  <h3
                    className={`font-semibold mb-2 ${
                      account.color === "emerald"
                        ? "text-emerald-700 dark:text-emerald-300"
                        : account.color === "blue"
                          ? "text-blue-700 dark:text-blue-300"
                          : account.color === "purple"
                            ? "text-purple-700 dark:text-purple-300"
                            : "text-sky-700 dark:text-sky-300"
                    }`}
                  >
                    {t(account.roleKey)}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <a
                      href={account.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-block font-medium underline ${
                        account.color === "emerald"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : account.color === "blue"
                            ? "text-blue-600 dark:text-blue-400"
                            : account.color === "purple"
                              ? "text-purple-600 dark:text-purple-400"
                              : "text-sky-600 dark:text-sky-400"
                      }`}
                    >
                      {account.url}
                    </a>
                    {account.email && (
                      <p>
                        <span className="font-medium">{t("demo.email")}:</span>{" "}
                        <code className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded">
                          {account.email}
                        </code>
                      </p>
                    )}
                    {account.password && (
                      <p>
                        <span className="font-medium">{t("demo.password")}:</span>{" "}
                        <code className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded">
                          {account.password}
                        </code>
                      </p>
                    )}
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      <span className="font-medium">{t("demo.features")}:</span>{" "}
                      {t(account.featuresKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl mb-6">
              <h3 className="font-semibold mb-2">{t("demo.instructions")}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("demo.howToUseLinks")}
              </p>
            </div>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                href="/login"
                className="text-emerald-600 hover:underline font-medium"
              >
                {t("demo.backToLogin")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
