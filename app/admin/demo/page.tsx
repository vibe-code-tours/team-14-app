"use client";

import Link from "next/link";
import { Card, CardContent } from "@/src/components/Card";

const demoAccounts = [
  {
    role: "User Account",
    url: "https://workervoice.help/",
    email: "demo@workervoice.org",
    password: "Demo1234!",
    features: "Browse factories, write reviews, vote on reviews",
    color: "emerald",
  },
  {
    role: "Super Admin Account",
    url: "https://workervoice.help/admin",
    email: "demo-superadmin@workervoice.org",
    password: "Demo1234!",
    features: "Full admin access — manage users, factories, reviews, settings",
    color: "purple",
  },
  {
    role: "Admin Account",
    url: "https://workervoice.help/admin",
    email: "demo-admin@workervoice.org",
    password: "Demo1234!",
    features: "Manage factories and reviews, approve/reject content",
    color: "blue",
  },
  {
    role: "Telegram Bot",
    url: "https://t.me/workervoice69_bot",
    features: "Search factories and read reviews via Telegram",
    color: "sky",
  },
];

export default function AdminDemoPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <main className="flex-grow max-w-2xl mx-auto p-4 mt-12 w-full">
        <Card>
          <CardContent>
            <h1 className="text-2xl font-bold mb-2 text-center">
              Demo Guide
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
              Use the accounts below to explore WorkerVoice features
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
                    {account.role}
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
                        <span className="font-medium">Email:</span>{" "}
                        <code className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded">
                          {account.email}
                        </code>
                      </p>
                    )}
                    {account.password && (
                      <p>
                        <span className="font-medium">Password:</span>{" "}
                        <code className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded">
                          {account.password}
                        </code>
                      </p>
                    )}
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      <span className="font-medium">Features:</span>{" "}
                      {account.features}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl mb-6">
              <h3 className="font-semibold mb-2">How to use</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click any URL above to open the demo. Use the email and password shown to log in. All accounts share the same password.
              </p>
            </div>

            {/* Back to Admin Login */}
            <div className="text-center">
              <Link
                href="/admin/login"
                className="text-emerald-600 hover:underline font-medium"
              >
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
