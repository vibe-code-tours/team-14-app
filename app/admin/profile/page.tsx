"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface Profile {
  id: number;
  email: string;
  fullName: string;
  nickname: string | null;
  image: string | null;
  role: string;
  createdAt: string;
}

const DEFAULT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjEuNSI+PGNpcmNsZSBjeD0iMTIiIGN5PSI4IiByPSI0Ii8+PHBhdGggZD0iTTQgMjFjMC00LjQxOCAzLjU4Mi04IDgtOHM4IDMuNTgyIDggOCIvPjwvc3ZnPg==";

export default function AdminProfilePage() {
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
    async function fetchProfile() {
      try {
        const res = await fetch("/api/admin/profile");
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
  }, []);

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

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, nickname, image }),
      });

      if (res.ok) {
        window.dispatchEvent(new CustomEvent("profile-image-updated", { detail: image }));
        setTimeout(() => {
          setSaving(false);
          setMessage("Profile updated successfully!");
          setTimeout(() => setMessage(""), 1500);
        }, 500);
      } else {
        const data = await res.json();
        setMessage(data.error || "Failed to update profile");
      }
    } catch (error) {
      setMessage("Failed to update profile");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48 animate-pulse"></div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 animate-pulse">
          <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded-full w-20 mb-4"></div>
          <div className="h-10 bg-slate-100 dark:bg-slate-700 rounded mb-3"></div>
          <div className="h-10 bg-slate-100 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto relative">
      {/* Success Toast */}
      {message && message.includes("success") && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-[slideIn_0.3s_ease-out]">
          <div className="flex items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg shadow-lg text-sm font-medium">
            <span>✅</span>
            <span>{message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">👤 My Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your account settings</p>
      </div>

      {/* Profile Image */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">📷 Profile Image</h3>
        <div className="flex items-center gap-6">
          <div
            className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-emerald-500 transition"
            onClick={() => image && setShowLightbox(true)}
          >
            {image ? (
              <img src={image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <img src={DEFAULT_AVATAR} alt="Default" className="w-full h-full" />
            )}
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
              className="px-4 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition"
            >
              📁 Upload Image
            </button>
            {image && (
              <button
                onClick={() => setImage(null)}
                className="ml-2 px-4 py-2 text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition"
              >
                ✕ Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">✏️ Edit Profile</h3>
        <form onSubmit={handleSave}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</label>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">{profile?.email}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="mt-1 w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nickname</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="mt-1 w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "💾 Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Image Lightbox */}
      {showLightbox && image && createPortal(
        <div
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backgroundColor: "rgba(0,0,0,0.8)" }}
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
  );
}
