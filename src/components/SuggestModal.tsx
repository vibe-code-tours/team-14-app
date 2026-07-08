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
      className="p-0 rounded-2xl shadow-2xl backdrop:bg-slate-900/50 w-full max-w-md border-0"
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-1">Suggest New Workplace</h2>
        <p className="text-sm text-gray-500 mb-6">
          Help others by adding missing workplaces.
        </p>

        {success ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">✅</div>
            <p className="text-emerald-600 font-medium">
              Thank you! Your suggestion has been submitted for review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Workplace Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Panasonic Factory"
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 ring-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as "factory" | "agency",
                    })
                  }
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 ring-emerald-500 outline-none bg-white"
                >
                  <option value="factory">🏭 Factory</option>
                  <option value="agency">🤝 Agency</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Bangkok"
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-xs flex gap-2 items-start mt-4">
              <span>ℹ️</span>
              <p>
                <strong>Note:</strong> Admin will verify this submission to ensure
                data quality before it appears publicly.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-800 p-3 rounded-lg text-xs">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
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
