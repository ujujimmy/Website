import { cn } from "@/lib/utils";

/**
 * Gold is reserved site-wide for review stars only, so a five-star row always
 * reads as the same visual idea wherever it appears.
 */
export function Stars({
  count = 5,
  className,
  size = 16,
}: {
  count?: number;
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={`${count} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={i < count ? "fill-gold" : "fill-line"}
        >
          <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.35 6.19 20.4l1.11-6.47L2.6 9.35l6.5-.95L12 2.5z" />
        </svg>
      ))}
    </span>
  );
}
