"use client";

interface StarRatingProps {
  /** Rating value from 0 to 5 (supports decimals like 3.7) */
  rating: number;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Show the numeric value next to stars */
  showValue?: boolean;
  /** Additional CSS classes */
  className?: string;
}

function Star({
  fillPercent,
  sizeClass,
  index,
}: {
  fillPercent: number;
  sizeClass: string;
  index: number;
}) {
  const clipId = `star-clip-${index}-${fillPercent}`;

  return (
    <svg
      className={sizeClass}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width={`${fillPercent}%`} height="100%" />
        </clipPath>
      </defs>
      {/* Empty star (background) */}
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        className="text-gray-200"
        fill="currentColor"
      />
      {/* Filled star (clipped to percentage) */}
      {fillPercent > 0 && (
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          className="text-yellow-400"
          fill="currentColor"
          clipPath={`url(#${clipId})`}
        />
      )}
    </svg>
  );
}

export function StarRating({
  rating,
  size = "md",
  showValue = false,
  className = "",
}: StarRatingProps) {
  const clampedRating = Math.max(0, Math.min(5, rating));

  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const fillPercent =
          clampedRating >= star
            ? 100
            : clampedRating > star - 1
              ? Math.round((clampedRating - (star - 1)) * 100)
              : 0;

        return (
          <Star
            key={star}
            fillPercent={fillPercent}
            sizeClass={sizes[size]}
            index={star}
          />
        );
      })}
      {showValue && (
        <span className={`ml-1 font-semibold text-slate-600 ${textSizes[size]}`}>
          {clampedRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
