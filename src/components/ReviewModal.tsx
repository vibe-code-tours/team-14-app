"use client";

import { useState } from "react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  factoryId: number;
  factoryName: string;
  onReviewSubmitted: () => void;
}

export function ReviewModal({
  isOpen,
  onClose,
  factoryId,
  factoryName,
  onReviewSubmitted,
}: ReviewModalProps) {
  const [formData, setFormData] = useState({
    workerRole: "",
    countryFrom: "Myanmar",
    ratingSalary: 5,
    ratingOt: 5,
    ratingHousing: 5,
    reviewText: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/factories/${factoryId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          worker_role: formData.workerRole,
          country_from: formData.countryFrom,
          rating_salary: formData.ratingSalary,
          rating_ot: formData.ratingOt,
          rating_housing: formData.ratingHousing,
          review_text: formData.reviewText,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit review");
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({
          workerRole: "",
          countryFrom: "Myanmar",
          ratingSalary: 5,
          ratingOt: 5,
          ratingHousing: 5,
          reviewText: "",
        });
        onReviewSubmitted();
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
    setFormData({
      workerRole: "",
      countryFrom: "Myanmar",
      ratingSalary: 5,
      ratingOt: 5,
      ratingHousing: 5,
      reviewText: "",
    });
  };

  if (!isOpen) return null;

  return (
    <dialog
      open={isOpen}
      className="p-0 rounded-3xl shadow-2xl backdrop:bg-slate-900/40 w-full max-w-md border border-slate-100 overflow-hidden"
    >
      <div className="relative">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
          <h2 className="text-xl font-bold">Write a Worker Review</h2>
          <p className="text-white/80 text-xs mt-1">
            Help others make informed, safe career choices.
          </p>
        </div>

        {/* Privacy Banner */}
        <div className="bg-amber-50 border-b border-amber-100 p-4 text-xs flex gap-2.5 items-center text-amber-800">
          <span className="text-lg">🔒</span>
          <div>
            <strong className="block">
              ၁၀၀% လူမည်မဖော်ပြဘဲ လျှို့ဝှက်ပေးထားပါသည်
            </strong>
            Your name and identity are completely safe. We never share them.
          </div>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">✅</div>
            <p className="text-emerald-600 font-medium">
              ကျေးဇူးတင်ပါသည်။ သုံးသပ်ချက် အောင်မြင်စွာ တင်သွင်းပြီးပါပြီ။
            </p>
            <p className="text-slate-500 text-sm mt-2">
              Thank you! Review submitted successfully.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Your Role in Factory (အလုပ်အကိုင်)
              </label>
              <input
                type="text"
                required
                value={formData.workerRole}
                onChange={(e) =>
                  setFormData({ ...formData, workerRole: e.target.value })
                }
                placeholder="e.g. Production Operator, Packer, QC"
                className="w-full border border-slate-200 px-3.5 py-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Home Country (နေရပ်မိခင်နိုင်ငံ)
              </label>
              <select
                value={formData.countryFrom}
                onChange={(e) =>
                  setFormData({ ...formData, countryFrom: e.target.value })
                }
                className="w-full border border-slate-200 px-3.5 py-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-sm transition font-medium"
              >
                <option value="Myanmar">🇲🇲 Myanmar</option>
                <option value="Cambodia">🇰🇭 Cambodia</option>
                <option value="Laos">🇱🇦 Laos</option>
                <option value="Vietnam">🇻🇳 Vietnam</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  💰 Salary
                </label>
                <select
                  value={formData.ratingSalary}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ratingSalary: parseInt(e.target.value),
                    })
                  }
                  className="w-full border border-slate-200 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-sm transition"
                >
                  <option value="5">5/5 (Good)</option>
                  <option value="4">4/5</option>
                  <option value="3">3/5</option>
                  <option value="2">2/5</option>
                  <option value="1">1/5 (Bad)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  ⏱️ OT Fairness
                </label>
                <select
                  value={formData.ratingOt}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ratingOt: parseInt(e.target.value),
                    })
                  }
                  className="w-full border border-slate-200 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-sm transition"
                >
                  <option value="5">5/5 (Good)</option>
                  <option value="4">4/5</option>
                  <option value="3">3/5</option>
                  <option value="2">2/5</option>
                  <option value="1">1/5 (Bad)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  🏠 Housing
                </label>
                <select
                  value={formData.ratingHousing}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ratingHousing: parseInt(e.target.value),
                    })
                  }
                  className="w-full border border-slate-200 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-sm transition"
                >
                  <option value="5">5/5 (Good)</option>
                  <option value="4">4/5</option>
                  <option value="3">3/5</option>
                  <option value="2">2/5</option>
                  <option value="1">1/5 (Bad)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Your Review (သုံးသပ်ချက်)
              </label>
              <textarea
                required
                rows={3}
                value={formData.reviewText}
                onChange={(e) =>
                  setFormData({ ...formData, reviewText: e.target.value })
                }
                placeholder="Describe the working conditions, management, food, and facilities..."
                className="w-full border border-slate-200 px-3.5 py-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition"
              ></textarea>
            </div>

            {error && (
              <div className="bg-red-50 text-red-800 p-3 rounded-lg text-xs">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow transition disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}
