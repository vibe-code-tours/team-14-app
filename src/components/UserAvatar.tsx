"use client";

interface UserAvatarProps {
  name?: string | null;
  image?: string | null;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  xs: "w-5 h-5 text-xs",
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-11 h-11 text-base",
};

function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
  ).toUpperCase();
}

function getColorFromName(name: string | null | undefined): string {
  const colors = [
    "bg-emerald-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-rose-500",
    "bg-orange-500",
  ];
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function UserAvatar({
  name,
  image,
  size = "md",
  className = "",
}: UserAvatarProps) {
  const sizeClass = sizeClasses[size];

  if (image) {
    return (
      <img
        src={image}
        alt={name || "User"}
        className={`${sizeClass} rounded-full object-cover ring-2 ring-white/30 ${className}`}
      />
    );
  }

  const initials = getInitials(name);
  const bgColor = getColorFromName(name);

  return (
    <div
      className={`${sizeClass} ${bgColor} rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-white/30 select-none ${className}`}
    >
      {initials}
    </div>
  );
}
