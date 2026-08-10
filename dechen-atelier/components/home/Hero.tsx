import { home } from "@/content/copy";
import { images } from "@/content/images";
import { whatsappLink, bookingMessage } from "@/content/brand";
import { Marquee } from "@/components/ui/Marquee";
import { Button, Arrow } from "@/components/ui/Button";

/**
 * A typographic opening, then the pictures.
 *
 * The headline is the largest-contentful-paint element and it is text, so it
 * arrives with the HTML. The photographs sit underneath as a triptych rather
 * than behind the words as a backdrop — which means no scrim, no contrast
 * compromise, and no upscaling: the source files are portrait, and this shows
 * them at close to their native width instead of cropping a 735px image across
 * a 1440px screen.
 *
 * Nothing here waits for the scroll observer. It is on screen at load, so it
 * animates on a timer — an element already in view when an observer starts is
 * exactly where scroll-triggered sites go blank.
 */

const triptych = [
  images.lookBalayageWarm,
  images.colorBalayage,
  images.lookWaves,
] as const;

export function Hero() {
  return (
    <section className="pt-12 md:pt-20">
      <div className="gutter">
        <h1 className="t-hero anim-line">
          {home.hero.lines.map((line, i) => (
            <span key={line}>
              <span style={{ animationDelay: `${0.08 + i * 0.11}s` }}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div
          className="anim-fade mt-10 flex flex-col gap-8 border-t border-line pt-8 md:mt-14 md:flex-row md:items-start md:justify-between md:gap-16"
          style={{ animationDelay: "0.45s" }}
        >
          <p className="prose-measure">{home.hero.lead}</p>

          <div className="flex shrink-0 flex-wrap gap-3">
            <Button href={whatsappLink(bookingMessage)} external>
              Book on WhatsApp
              <Arrow />
            </Button>
            <Button href="/menu" variant="line">
              Price index
            </Button>
          </div>
        </div>
      </div>

      {/* The triptych. Two of the three are hidden on a phone rather than
          stacked: three portrait crops in a column is a very long scroll before
          anything is said. */}
      <div
        className="anim-fade gutter mt-12 grid grid-cols-1 gap-3 md:mt-16 md:grid-cols-3"
        style={{ animationDelay: "0.6s" }}
      >
        {triptych.map((img, i) => (
          <div
            key={img.src}
            className={`frame frame-tall ${i > 0 ? "hidden md:block" : ""}`}
          >
            {/* Deliberately a plain <img>: this is the first paint after the
                headline, and next/image's wrapper adds nothing when the export
                is unoptimised. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              className="anim-image"
              fetchPriority={i === 0 ? "high" : undefined}
              loading={i === 0 ? undefined : "lazy"}
              decoding="async"
            />
          </div>
        ))}
      </div>

      <div className="mt-14 border-y border-line py-4 md:mt-20">
        <Marquee items={home.ticker} speed={68} />
      </div>
    </section>
  );
}
