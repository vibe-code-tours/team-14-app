"use client";

import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";
import { UserAuthGuard } from "@/src/components/UserAuthGuard";
import { PublicFactoryForm } from "@/src/components/PublicFactoryForm";

export default function NewFactoryPage() {
  return (
    <UserAuthGuard>
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 animate-fade-in">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              ➕ Submit a Factory
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Help other workers by sharing factory information
            </p>
          </div>
          <PublicFactoryForm />
        </main>
        <Footer />
      </div>
    </UserAuthGuard>
  );
}
