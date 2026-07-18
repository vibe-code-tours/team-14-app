"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AlertModal } from "./AlertModal";
import { useLanguage } from "@/src/contexts/LanguageContext";
import { useDebounce } from "@/src/lib/hooks/useDebounce";

interface Factory {
  id: number;
  name: string;
  operator: string | null;
  province: string | null;
  district: string | null;
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  factoryId?: number;
  factoryName?: string;
  onReviewSubmitted: () => void;
}

export function ReviewModal({
  isOpen,
  onClose,
  factoryId,
  factoryName,
  onReviewSubmitted,
}: ReviewModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    workerRole: "",
    countryFrom: "Myanmar",
    ratingSalary: 5,
    ratingOt: 5,
    ratingHousing: 5,
    reviewText: "",
  });
  const [selectedFactoryId, setSelectedFactoryId] = useState<number | null>(
    factoryId ?? null
  );
  const [selectedFactoryName, setSelectedFactoryName] = useState<string>(
    factoryName ?? ""
  );
  const [factorySearch, setFactorySearch] = useState("");
  const [factories, setFactories] = useState<Factory[]>([]);
  const [factoriesLoading, setFactoriesLoading] = useState(false);
  const [showFactoryDropdown, setShowFactoryDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const debouncedFactorySearch = useDebounce(factorySearch, 300);

  const isFactoryPreselected = !!factoryId;

  const fetchFactories = useCallback(async (search: string) => {
    setFactoriesLoading(true);
    try {
      const params = new URLSearchParams({ limit: "20" });
      if (search.trim()) {
        params.set("search", search.trim());
      }
      const res = await fetch(`/api/factories?${params}`);
      if (res.ok) {
        const data = await res.json();
        setFactories(data.data ?? []);
      }
    } catch {
      // Silently fail — user can retry
    } finally {
      setFactoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isFactoryPreselected) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchFactories(debouncedFactorySearch);
    }
  }, [debouncedFactorySearch, fetchFactories, isFactoryPreselected]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowFactoryDropdown(false);
      }
    }
    if (showFactoryDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFactoryDropdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFactoryId) {
      setError("Please select a factory before submitting.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/factories/${selectedFactoryId}/reviews`, {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setSuccess(false);
    setError("");
    setFormData({
      workerRole: "",
      countryFrom: "Myanmar",
      ratingSalary: 5,
      ratingOt: 5,
      ratingHousing: 5,
      reviewText: "",
    });
    if (!factoryId) {
      setSelectedFactoryId(null);
      setSelectedFactoryName("");
      setFactorySearch("");
      setFactories([]);
    }
  };

  if (!isOpen) return null;

  return (
    <>
    <dialog
      open={isOpen}
      onClose={handleClose}
      className="fixed inset-0 z-50 bg-black/50 p-0 m-0 max-w-none w-full h-full rounded-none border-0 shadow-none backdrop:visible backdrop:bg-black/50"
    >
      <div className="flex items-end sm:items-center justify-center min-h-full">
        <div className="relative bg-white dark:bg-slate-800 w-full max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl border border-slate-100 dark:border-slate-700 max-h-[90dvh] sm:max-h-[85dvh] flex flex-col overflow-hidden animate-slide-up">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-5 sm:p-6 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold">{t("review.title")}</h2>
                <p className="text-white/80 text-xs mt-1">
                  {t("review.subtitle")}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="text-white/60 hover:text-white transition p-1 -mr-1"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Scrollable content area */}
          <div className="overflow-y-auto overscroll-contain flex-1 min-h-0">
            {/* Privacy Banner */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-800/30 p-4 text-xs flex gap-2.5 items-center text-amber-800 dark:text-amber-200">
              <span className="text-lg shrink-0">🔒</span>
              <div>
                <strong className="block">
                  {t("privacy.title")}
                </strong>
                {t("privacy.description")}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            {/* Factory Selector — only shown when no factory is pre-selected */}
            {!isFactoryPreselected && (
              <div className="relative" ref={dropdownRef}>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  {t("review.factoryLabel")}
                </label>
                <input
                  type="text"
                  required
                  value={selectedFactoryName || factorySearch}
                  onChange={(e) => {
                    setSelectedFactoryId(null);
                    setSelectedFactoryName("");
                    setFactorySearch(e.target.value);
                    setShowFactoryDropdown(true);
                  }}
                  onFocus={() => {
                    setShowFactoryDropdown(true);
                    if (factories.length === 0) {
                      fetchFactories(factorySearch);
                    }
                  }}
                  placeholder={t("review.factoryPlaceholder")}
                  className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-3.5 py-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition"
                />
                {showFactoryDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {factoriesLoading ? (
                      <div className="px-3.5 py-2.5 text-sm text-slate-400">
                        {t("review.searching")}
                      </div>
                    ) : factories.length === 0 ? (
                      <div className="px-3.5 py-2.5 text-sm text-slate-400">
                        {t("review.noFactories")}
                      </div>
                    ) : (
                      factories.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => {
                            setSelectedFactoryId(f.id);
                            setSelectedFactoryName(f.name);
                            setFactorySearch("");
                            setShowFactoryDropdown(false);
                          }}
                          className="w-full text-left px-3.5 py-2.5 text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition border-b border-slate-50 dark:border-slate-600 last:border-0"
                        >
                          <span className="font-medium text-slate-800 dark:text-slate-100">
                            {f.name}
                          </span>
                          {(f.operator || f.province) && (
                            <span className="block text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                              {[f.operator, f.province].filter(Boolean).join(" · ")}
                            </span>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                {t("review.roleLabel")}
              </label>
              <input
                type="text"
                required
                value={formData.workerRole}
                onChange={(e) =>
                  setFormData({ ...formData, workerRole: e.target.value })
                }
                placeholder={t("review.rolePlaceholder")}
                className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-3.5 py-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                {t("review.countryLabel")}
              </label>
              <select
                value={formData.countryFrom}
                onChange={(e) =>
                  setFormData({ ...formData, countryFrom: e.target.value })
                }
                className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 pl-3.5 pr-8 py-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-no-repeat bg-[position:right_0.5rem_center] text-sm transition font-medium appearance-none"
              >
                <option value="Myanmar">🇲🇲 Myanmar</option>
                <option value="Cambodia">🇰🇭 Cambodia</option>
                <option value="Laos">🇱🇦 Laos</option>
                <option value="Vietnam">🇻🇳 Vietnam</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  💰 {t("review.salary")}
                </label>
                <select
                  value={formData.ratingSalary}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ratingSalary: parseInt(e.target.value),
                    })
                  }
                  className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 pl-3 pr-8 py-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-no-repeat bg-[position:right_0.5rem_center] text-sm transition appearance-none"
                >
                  <option value="5">5/5 (Good)</option>
                  <option value="4">4/5</option>
                  <option value="3">3/5</option>
                  <option value="2">2/5</option>
                  <option value="1">1/5 (Bad)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  ⏱️ {t("review.otFairness")}
                </label>
                <select
                  value={formData.ratingOt}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ratingOt: parseInt(e.target.value),
                    })
                  }
                  className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 pl-3 pr-8 py-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-no-repeat bg-[position:right_0.5rem_center] text-sm transition appearance-none"
                >
                  <option value="5">5/5 (Good)</option>
                  <option value="4">4/5</option>
                  <option value="3">3/5</option>
                  <option value="2">2/5</option>
                  <option value="1">1/5 (Bad)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  🏠 {t("review.housing")}
                </label>
                <select
                  value={formData.ratingHousing}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ratingHousing: parseInt(e.target.value),
                    })
                  }
                  className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 pl-3 pr-8 py-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-no-repeat bg-[position:right_0.5rem_center] text-sm transition appearance-none"
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                {t("review.reviewLabel")}
              </label>
              <textarea
                required
                rows={3}
                value={formData.reviewText}
                onChange={(e) =>
                  setFormData({ ...formData, reviewText: e.target.value })
                }
                placeholder={t("review.reviewPlaceholder")}
                className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-3.5 py-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition"
              ></textarea>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-3 rounded-lg text-xs">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"
              >
                {t("review.cancel")}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow transition disabled:opacity-50"
              >
                {submitting ? t("review.submitting") : t("review.submit")}
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </dialog>

    <AlertModal
      isOpen={success}
      onClose={() => {
        setSuccess(false);
        onClose();
        onReviewSubmitted();
      }}
      title={t("review.successTitle")}
      message={t("review.successMessage")}
      confirmLabel="OK"
      variant="success"
      hideCancel
    />
    </>
  );
}
