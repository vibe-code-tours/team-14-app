"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
        setMessage("Password changed successfully!");
        setIsError(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage(data.error || "Failed to change password");
        setIsError(true);
      }
    } catch (error) {
      setMessage("Failed to change password");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">🔒 Change Password</h1>
        <p className="text-slate-500 text-sm">Update your account password</p>
      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="At least 8 characters"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${isError ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"}`}>
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
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              ← Back to Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
