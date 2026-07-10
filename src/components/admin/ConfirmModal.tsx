"use client";

import { Button } from "@/src/components/Button";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const confirmStyles =
    variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
      : "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500";

  return (
    <dialog
      open={isOpen}
      className="p-0 rounded-2xl shadow-2xl backdrop:bg-slate-900/40 w-full max-w-sm border border-slate-100 overflow-hidden"
    >
      <div className="p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-hidden focus:ring-2 focus:ring-offset-2 px-4 py-2 text-base disabled:opacity-50 ${confirmStyles}`}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
