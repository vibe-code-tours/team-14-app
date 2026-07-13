"use client";

import { useState } from "react";

interface SuggestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SuggestModal({ isOpen, onClose }: SuggestModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "factory" as "factory" | "agency",
    country: "Thailand",
    city: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({ name: "", type: "factory", country: "Thailand", city: "" });
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setSuccess(false);
    setFormData({ name: "", type: "factory", country: "Thailand", city: "" });
  };

  if (!isOpen) return null;

  return (
    <dialog
      open={isOpen}
      className="fixed inset-0 m-auto p-0 rounded-2xl shadow-2xl w-full max-w-md border-0 bg-white dark:bg-slate-800 z-50"
    >
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 -z-10"
        onClick={handleClose}
      />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-1 text-slate-800 dark:text-slate-100">Suggest New Workplace</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
          Help others by adding missing workplaces.
        </p>

        {success ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">✅</div>
            <p className="text-emerald-600 dark:text-emerald-400 font-medium">
              Thank you! Your suggestion has been submitted for review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Workplace Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Panasonic Factory"
                className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 p-2.5 rounded-lg focus:ring-2 ring-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as "factory" | "agency",
                    })
                  }
                  className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 pl-3 pr-8 py-2.5 rounded-lg focus:ring-2 ring-emerald-500 outline-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-no-repeat bg-[position:right_0.5rem_center] appearance-none"
                >
                  <option value="factory">🏭 Factory</option>
                  <option value="agency">🤝 Agency</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Bangkok"
                  className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 p-2.5 rounded-lg focus:ring-2 ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-3 rounded-lg text-xs flex gap-2 items-start mt-4">
              <span>ℹ️</span>
              <p>
                <strong>Note:</strong> Admin will verify this submission to ensure
                data quality before it appears publicly.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-3 rounded-lg text-xs">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 font-medium text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Suggestion"}
              </button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}
