import Image from "next/image";
import type { ImageSlot } from "@/data/images";

/**
 * A framed, graded image.
 *
 * Every photograph on this site is a compressed ~1080px Instagram file, so
 * three things are non-negotiable here:
 *
 * 1. NEVER WIDER THAN THE SOURCE. `slot.displayMax` caps the box at half the
 *    native pixel width, which is sharp on a retina phone. A stretched 1080px
 *    file is visibly soft and makes the whole site look cheap.
 * 2. ALWAYS FRAMED. A hairline maroon rule with dark space around it reads as
 *    an editorial decision. The same image bleeding to the viewport edge reads
 *    as low quality.
 * 3. ALWAYS GRADED. The unified warm grade and grain live in `.plate` in
 *    globals.css, so a set shot on four different phones with four different
 *    Instagram filters resolves into one shoot.
 *
 * `sizes` is derived from displayMax rather than written by hand, so the
 * browser can never be talked into downloading a width we do not render.
 */
export function Plate({
  slot,
  priority = false,
  className = "",
  sizes,
  maxWidth,
}: {
  slot: ImageSlot;
  priority?: boolean;
  className?: string;
  /** Override only when the slot is narrower than displayMax at some breakpoint. */
  sizes?: string;
  /**
   * Narrow this instance further. Clamped to `slot.displayMax` — a caller can
   * make an image smaller than its cap but never larger, so rule 1 above cannot
   * be broken by accident from a page.
   *
   * This is a prop rather than a `max-w-*` class because the cap is applied as
   * an inline style, and inline styles beat classes: a `max-w-[26rem]` passed
   * through `className` would silently do nothing.
   */
  maxWidth?: number;
}) {
  const cap = Math.min(maxWidth ?? slot.displayMax, slot.displayMax);

  return (
    <div className={`hairline border p-1.5 ${className}`} style={{ maxWidth: `${cap}px` }}>
      <div className="plate">
        <Image
          src={slot.src}
          alt={slot.alt}
          width={slot.width}
          height={slot.height}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          // The sources are already compressed. Re-compressing hard compounds
          // the artefacts visibly, so we spend the bytes.
          quality={90}
          sizes={sizes ?? `(max-width: ${slot.displayMax}px) 100vw, ${slot.displayMax}px`}
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}
