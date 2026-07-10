"use client";

import { Badge } from "@/src/components/Badge";

interface ReviewRowProps {
  id: number;
  workerRole: string;
  countryFrom: string;
  ratingSalary: number;
  ratingOt: number;
  ratingHousing: number;
  reviewText: string;
  isVisible: boolean;
  createdAt: string;
  factoryName: string | null;
  organizationName: string | null;
  onRequestToggle: (id: number, isVisible: boolean, name: string) => void;
  index?: number;
  user?: {
    id: string;
    fullName: string;
    nickname: string | null;
  } | null;
}

export function ReviewRow({
  id,
  workerRole,
  countryFrom,
  ratingSalary,
  ratingOt,
  ratingHousing,
  reviewText,
  isVisible,
  createdAt,
  factoryName,
  organizationName,
  onRequestToggle,
  index = 0,
  user,
}: ReviewRowProps) {
  const avgRating =
    ((ratingSalary + ratingOt + ratingHousing) / 3).toFixed(1);

  return (
    <tr
      className="border-b border-slate-100 hover:bg-slate-50 transition opacity-0 animate-fade-in"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "forwards" }}
    >
      <td className="p-4">
        <span className="text-sm text-slate-500">{id}</span>
      </td>
      <td className="p-4">
        <div>
          <p className="font-medium text-slate-800 text-sm">{workerRole}</p>
          <p className="text-xs text-slate-400">
            {factoryName || organizationName || "Unknown"}
          </p>
        </div>
      </td>
      <td className="p-4">
        <p className="text-sm text-slate-600">
          {user?.nickname || user?.fullName || "—"}
        </p>
      </td>
      <td className="p-4">
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {countryFrom}
        </span>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-1.5">
          <span className="text-yellow-500 text-sm">⭐</span>
          <span className="text-sm font-medium text-slate-700">{avgRating}</span>
          <span className="text-xs text-slate-400">/5</span>
        </div>
      </td>
      <td className="p-4 max-w-xs">
        <p className="text-sm text-slate-600 line-clamp-2">{reviewText}</p>
      </td>
      <td className="p-4">
        <Badge variant={isVisible ? "success" : "warning"}>
          {isVisible ? "Visible" : "Hidden"}
        </Badge>
      </td>
      <td className="p-4">
        <button
          onClick={() => onRequestToggle(id, isVisible, factoryName || organizationName || "Unknown")}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition ${
            isVisible
              ? "text-amber-700 bg-amber-50 hover:bg-amber-100"
              : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
          }`}
        >
          {isVisible ? "Hide" : "Show"}
        </button>
      </td>
    </tr>
  );
}
