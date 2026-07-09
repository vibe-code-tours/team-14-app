"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

interface NavbarProps {
  onSuggestClick?: () => void;
}

export function Navbar({ onSuggestClick }: NavbarProps) {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-6 sticky top-0 z-10 shadow-md">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-xl flex items-center gap-2 hover:opacity-90 transition">
          <span>🌏</span> WorkerVoice
        </Link>
        <div className="flex items-center gap-2 md:gap-4 text-sm md:text-base">
          <Link href="/" className="hover:text-emerald-200 transition">
            Home
          </Link>
          <Link href="/factories" className="hover:text-emerald-200 transition">
            Factories
          </Link>
          {onSuggestClick ? (
            <button
              onClick={onSuggestClick}
              className="bg-white text-emerald-600 px-4 py-1.5 rounded-full font-semibold shadow-sm hover:bg-gray-100 transition"
            >
              Suggest
            </button>
          ) : (
            <Link
              href="/suggest"
              className="bg-white text-emerald-600 px-4 py-1.5 rounded-full font-semibold shadow-sm hover:bg-gray-100 transition inline-block"
            >
              Suggest
            </Link>
          )}

          {status === "authenticated" ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-emerald-100">
                {session.user?.name}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hover:text-emerald-200 transition"
              >
                Log out
              </button>
            </div>
          ) : status === "unauthenticated" ? (
            <Link href="/login" className="hover:text-emerald-200 transition">
              Log in
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
