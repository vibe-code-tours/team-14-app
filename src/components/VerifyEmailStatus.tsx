"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function VerifyEmailStatus({ token, email }: { token: string; email: string }) {
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Verification failed");
        setStatus("success");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Verification failed");
      });
  }, [token, email]);

  if (status === "pending") {
    return <p className="text-gray-500">Verifying your email...</p>;
  }

  if (status === "error") {
    return <p className="text-red-600">{message}</p>;
  }

  return (
    <p className="text-emerald-600">
      Your email has been verified.{" "}
      <Link href="/login" className="underline">
        Log in
      </Link>
      .
    </p>
  );
}
