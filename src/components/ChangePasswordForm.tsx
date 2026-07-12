"use client";

import { useState } from "react";
import { Input } from "@/src/components/Input";
import { Button } from "@/src/components/Button";

export function ChangePasswordForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    if (formData.newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      setSubmitting(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/profile/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to change password");
      }

      setSuccess(true);
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Current Password"
        name="currentPassword"
        type="password"
        value={formData.currentPassword}
        onChange={handleChange}
        required
        placeholder="Enter current password"
      />
      <Input
        label="New Password"
        name="newPassword"
        type="password"
        value={formData.newPassword}
        onChange={handleChange}
        required
        placeholder="Enter new password (min 8 characters)"
      />
      <Input
        label="Confirm New Password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
        placeholder="Confirm new password"
      />

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-800 p-4 rounded-xl text-sm">
          ✅ Password changed successfully!
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" isLoading={submitting}>
          Change Password
        </Button>
      </div>
    </form>
  );
}
