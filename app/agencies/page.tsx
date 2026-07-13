"use client";

import { useState } from "react";
import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";
import { SuggestModal } from "@/src/components/SuggestModal";

export default function AgenciesPage() {
  const [showSuggestModal, setShowSuggestModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto p-4 mt-6 w-full space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              🤝 Recruitment Agencies
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Browse and review recruitment agencies
            </p>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
          <div className="text-5xl mb-4">🚧</div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Coming Soon
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
            Agency reviews are coming soon! In the meantime, you can suggest an
            agency to be added to our platform.
          </p>
          <button
            onClick={() => setShowSuggestModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow transition"
          >
            Suggest an Agency
          </button>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 rounded-2xl p-6 md:p-8">
          <h3 className="text-lg font-bold text-blue-800 mb-2">
            ℹ️ About Agency Reviews
          </h3>
          <p className="text-blue-700 text-sm leading-relaxed">
            We are working on adding agency reviews to help migrant workers
            choose safe and trustworthy recruitment agencies. Your suggestions
            help us grow our database.
          </p>
        </div>
      </main>

      <Footer />

      <SuggestModal
        isOpen={showSuggestModal}
        onClose={() => setShowSuggestModal(false)}
      />
    </div>
  );
}
