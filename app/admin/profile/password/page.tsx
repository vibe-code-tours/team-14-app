"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      setSaving(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      setSaving(false);
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to change password");
      }

      setSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in" style={{ animationDelay: "0ms" }}>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">🔒 Change Password</h1>
          <p className="text-slate-500 text-sm">Update your account password</p>
        </div>
        <Link
          href="/admin/profile"
          className="text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition"
        >
          ← Back to Profile
        </Link>
      </div>

      {/* Password Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-fade-in" style={{ animationDelay: "150ms" }}>
          <h3 className="text-lg font-bold text-slate-800 mb-4">🔑 Password</h3>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          <div className="space-y-4 max-w-md">
            <div>
              <label
                htmlFor="currentPassword"
                className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
              >
                Current Password *
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="mt-1 w-full text-sm text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition"
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
              >
                New Password *
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="mt-1 w-full text-sm text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition"
              />
              <p className="text-xs text-slate-400 mt-1">Minimum 8 characters</p>
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
              >
                Confirm New Password *
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="mt-1 w-full text-sm text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={saving || !currentPassword || !newPassword || !confirmPassword}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Changing..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
