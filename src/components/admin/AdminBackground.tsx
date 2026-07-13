"use client";

export function AdminBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#f8fafb]">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-emerald-50/80 via-white to-teal-50/60" />

      {/* Aurora rays */}
      <div className="aurora-ray aurora-1" />
      <div className="aurora-ray aurora-2" />
      <div className="aurora-ray aurora-3" />

      {/* Large floating blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* Geometric shapes */}
      <div className="geo geo-ring geo-1" />
      <div className="geo geo-ring geo-2" />
      <div className="geo geo-diamond geo-3" />
      <div className="geo geo-hex geo-4" />
      <div className="geo geo-dot geo-5" />
      <div className="geo geo-dot geo-6" />
      <div className="geo geo-dot geo-7" />
      <div className="geo geo-ring geo-8" />

      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid" />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-multiply" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
    </div>
  );
}
