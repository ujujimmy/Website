import Link from "next/link";
import { brand } from "@/content/brand";

/**
 * The wordmark: the name in Bodoni under heavy tracking, with the category set
 * small beside it. Letterspacing this wide is only legible in capitals, which
 * is precisely why it reads as a mark rather than as a word.
 */
export function Wordmark({
  size = "sm",
  className = "",
}: {
  size?: "sm" | "lg" | "xl";
  className?: string;
}) {
  const scale =
    size === "xl"
      ? "text-[clamp(2.5rem,9vw,7rem)]"
      : size === "lg"
        ? "text-2xl sm:text-3xl"
        : "text-base sm:text-lg";

  return (
    <span className={`flex items-baseline gap-2 sm:gap-2.5 ${className}`}>
      <span className={`display leading-none tracking-[0.22em] ${scale}`}>
        {brand.shortName}
      </span>
      {/* Dropped below 640px, where the header has a menu button on one side
          and a booking link on the other and the mark would collide with both.
          No opacity on it either: fading brass to 65% over ink lands at 4.14:1,
          which fails AA at this size — the colour tokens already carry the
          right contrast on both grounds, so let them. */}
      <span
        className={`micro pb-[0.15em] text-muted ${
          size === "sm" ? "hidden sm:inline" : ""
        }`}
      >
        Salon
      </span>
    </span>
  );
}

/** The wordmark as a link home. */
export function WordmarkLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${brand.name} — home`}
      className={`inline-flex ${className}`}
    >
      <Wordmark />
    </Link>
  );
}
