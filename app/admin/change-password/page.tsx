"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/src/components/PasswordInput";

export default function AdminChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match");
      setIsError(true);
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setMessage("New password must be at least 8 characters");
      setIsError(true);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsError(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setLoading(false);
          setMessage("Password changed successfully!");
          setTimeout(() => setMessage(""), 1500);
        }, 500);
      } else {
        setMessage(data.error || "Failed to change password");
        setIsError(true);
      }
    } catch (error) {
      setMessage("Failed to change password");
      setIsError(true);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto relative">
      {/* Success Toast */}
      {message && !isError && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-[slideIn_0.3s_ease-out]">
          <div className="flex items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg shadow-lg text-sm font-medium">
            <span>✅</span>
            <span>{message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">🔒 Change Password</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Update your account password</p>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordInput
            label="Current Password"
            name="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <PasswordInput
            label="New Password"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            placeholder="At least 8 characters"
          />
          <PasswordInput
            label="Confirm New Password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
          />

          {message && isError && (
            <div className="p-3 rounded-lg text-sm bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300">
              {message}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Changing..." : "🔒 Change Password"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/profile")}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition"
            >
              ← Back to Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
