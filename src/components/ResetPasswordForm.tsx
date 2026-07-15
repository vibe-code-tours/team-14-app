"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "./Input";
import { PasswordInput } from "./PasswordInput";
import { Button } from "./Button";

// Request form: worker enters their email to receive a reset link.
export function RequestResetForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setEmailNotVerified(false);

    try {
      const res = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Check if the error is about unverified email
        if (data.error?.includes("Email not verified")) {
          setEmailNotVerified(true);
          setSubmitting(false);
          return;
        }
        throw new Error(data.error || "Failed to send reset link");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendVerification = async () => {
    setSendingVerification(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send verification email");
      }

      setEmailNotVerified(false);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSendingVerification(false);
    }
  };

  if (submitted) {
    return (
      <p className="text-emerald-600 dark:text-emerald-400 text-sm">
        If an account with that email exists, a password reset link has been sent.
      </p>
    );
  }

  if (emailNotVerified) {
    return (
      <div className="space-y-4">
        <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
          <p className="text-amber-800 dark:text-amber-200 text-sm">
            Your email is not verified. Please verify your email first before resetting your password.
          </p>
        </div>
        <Button
          onClick={handleSendVerification}
          isLoading={sendingVerification}
          className="w-full"
        >
          Send verification email
        </Button>
        <button
          type="button"
          onClick={() => setEmailNotVerified(false)}
          className="w-full text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm">{error}</div>
      )}
      <Button type="submit" isLoading={submitting} className="w-full">
        Send reset link
      </Button>
    </form>
  );
}

// Confirm form: worker arrived via the emailed link containing a token, sets a new password.
export function ConfirmResetForm({ token }: { token: string }) {
  const [newPassword, setNewPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <p className="text-emerald-600 dark:text-emerald-400 text-sm">
        Your password has been reset.{" "}
        <Link href="/login" className="underline">
          Log in
        </Link>
        .
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PasswordInput
        label="New password"
        required
        minLength={8}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-3 rounded-lg text-sm">{error}</div>
      )}
      <Button type="submit" isLoading={submitting} className="w-full">
        Reset password
      </Button>
    </form>
  );
}
