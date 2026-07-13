"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { createPortal } from "react-dom";
import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";
import { UserAuthGuard } from "@/src/components/UserAuthGuard";
import { useLanguage } from "@/src/contexts/LanguageContext";

interface Profile {
  id: number;
  email: string;
  fullName: string;
  nickname: string | null;
  image: string | null;
  role: string;
  createdAt: string;
}

const DEFAULT_AVATAR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjEuNSI+PGNpcmNsZSBjeD0iMTIiIGN5PSI4IiByPSI0Ii8+PHBhdGggZD0iTTQgMjFjMC00LjQxOCAzLjU4Mi04IDgtOHM4IDMuNTgyIDggOCIvPjwvc3ZnPg==";

export default function ProfilePage() {
  const router = useRouter();
  const { status, update } = useSession();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [fullName, setFullName] = useState("");
  const [nickname, setNickname] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setFullName(data.fullName);
          setNickname(data.nickname || "");
          setImage(data.image);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [status]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 200;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const scale = Math.max(size / img.width, size / img.height);
        const x = (size - img.width * scale) / 2;
        const y = (size - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        setImage(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, nickname, image }),
      });

      if (res.ok) {
        setSaving(false);
        setMessage("Profile updated successfully!");
        await update();
        setTimeout(() => setMessage(""), 1500);
      } else {
        const data = await res.json();
        setSaving(false);
        setMessage(data.error || "Failed to update profile");
      }
    } catch (error) {
      setSaving(false);
      setMessage("Failed to update profile");
    }
  };

  if (status !== "authenticated" || loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48 animate-pulse" />
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 animate-pulse">
            <div className="h-20 w-20 bg-slate-200 rounded-full mb-4" />
            <div className="h-10 bg-slate-100 rounded mb-3" />
            <div className="h-10 bg-slate-100 rounded" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <UserAuthGuard>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6 relative">
        {message && (
          <div
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white ${
              message.includes("success") ? "bg-emerald-600" : "bg-red-500"
            }`}
          >
            {message}
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t("nav.profile")}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your account settings</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Profile Image</h3>
          <div className="flex items-center gap-6">
            <div
              className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-emerald-500 transition"
              onClick={() => image && setShowLightbox(true)}
            >
              <img
                src={image || DEFAULT_AVATAR}
                alt="Profile"
                className={image ? "w-full h-full object-cover" : "w-full h-full"}
              />
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 rounded-lg transition"
              >
                Upload Image
              </button>
              {image && (
                <button
                  onClick={() => setImage(null)}
                  className="ml-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 rounded-lg transition"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Edit Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Email
              </label>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                {profile?.email}
              </p>
            </div>
            <div>
              <label
                htmlFor="fullName"
                className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="mt-1 w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="nickname"
                className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
              >
                Nickname
              </label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Optional — shown publicly instead of your full name"
                className="mt-1 w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {showLightbox &&
          image &&
          createPortal(
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                backgroundColor: "rgba(0,0,0,0.8)",
              }}
              onClick={() => setShowLightbox(false)}
            >
              <img
                src={image}
                alt="Profile"
                style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain" }}
              />
            </div>,
            document.body
          )}
      </div>
      <Footer />
    </UserAuthGuard>
  );
}
