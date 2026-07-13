"use client";

import { useEffect, useCallback } from "react";

interface AlertModalProps {
  isOpen: boolean;
  onClose: (confirmed: boolean) => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "warning" | "success";
  hideCancel?: boolean;
}

export function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  variant = "warning",
  hideCancel = false,
}: AlertModalProps) {
  const handleConfirm = useCallback(() => onClose(true), [onClose]);
  const handleCancel = useCallback(() => onClose(false), [onClose]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleCancel();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleCancel]);

  if (!isOpen) return null;

  const headerClass =
    variant === "success"
      ? "bg-gradient-to-r from-emerald-600 to-teal-600"
      : "bg-gradient-to-r from-amber-500 to-orange-500";

  return (
    <dialog
      open={isOpen}
      onClose={handleCancel}
      className="fixed inset-0 z-50 bg-black/50 p-0 m-0 max-w-none w-full h-full rounded-none border-0 shadow-none backdrop:visible backdrop:bg-black/50"
    >
      <div className="flex items-end sm:items-center justify-center min-h-full">
        <div className="relative bg-white dark:bg-slate-800 w-full max-w-sm sm:rounded-2xl rounded-t-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className={`${headerClass} text-white p-5 text-center`}>
            <div className="text-3xl mb-2">
              {variant === "success" ? "✅" : "🔒"}
            </div>
            <h2 className="text-lg font-bold">{title}</h2>
          </div>

          {/* Body */}
          <div className="p-6 text-center space-y-5">
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              {message}
            </p>

            <div className="flex gap-3 justify-center">
              {!hideCancel && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"
                >
                  {cancelLabel}
                </button>
              )}
              <button
                type="button"
                onClick={handleConfirm}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow transition"
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
