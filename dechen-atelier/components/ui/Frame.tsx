import Image from "next/image";
import type { Img } from "@/content/images";

type Ratio = "portrait" | "tall" | "wide" | "square" | "free";

/**
 * Every photograph on the site goes through here.
 *
 * The ratio lives on the wrapper, so the space a picture will occupy is
 * reserved by CSS before the file arrives. That is the whole of the site's
 * layout-shift strategy, and it is why the number is zero.
 */
export function Frame({
  img,
  ratio = "portrait",
  sizes = "100vw",
  priority = false,
  zoom = false,
  className = "",
}: {
  img: Img;
  ratio?: Ratio;
  sizes?: string;
  priority?: boolean;
  /** Slow scale on hover. For pictures that are also links. */
  zoom?: boolean;
  className?: string;
}) {
  const ratioClass = ratio === "free" ? "" : `frame-${ratio}`;

  return (
    <div
      className={`frame ${ratioClass} ${zoom ? "frame-zoom" : ""} ${className}`}
    >
      <Image
        src={img.src}
        alt={img.alt}
        width={img.width}
        height={img.height}
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
      />
    </div>
  );
}
