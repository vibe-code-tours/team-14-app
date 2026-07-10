"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Input } from "@/src/components/Input";
import { Button } from "@/src/components/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Invalid email or password");
      }

      // Check if user is admin by fetching session
      const res = await fetch("/api/auth/session");
      const session = await res.json();

      if (!session?.user?.isAdmin) {
        throw new Error("Unauthorized: Admin access required");
      }

      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8 rounded-t-2xl">
          <div className="text-center">
            <span className="text-4xl">🌏</span>
            <h1 className="text-2xl font-bold mt-3">WorkerVoice Admin</h1>
            <p className="text-white/80 text-sm mt-1">
              Sign in to manage factories and reviews
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white p-8 rounded-b-2xl shadow-sm border border-t-0 border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@workervoice.com"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />

            {error && (
              <div className="bg-red-50 text-red-800 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button type="submit" isLoading={loading} className="w-full">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-slate-500 hover:text-emerald-600 transition"
            >
              ← Back to WorkerVoice
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
