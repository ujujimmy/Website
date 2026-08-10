import Image from "next/image";
import Link from "next/link";
import { images, lookbook } from "@/content/images";
import { Arrow } from "@/components/ui/Button";

/**
 * The lookbook rail.
 *
 * A plain horizontally-scrollable list with scroll snapping — no JavaScript at
 * all. It used to drift sideways on a scroll-driven transform, which was the
 * sort of flourish that reads as a demo rather than as a salon, and it cost a
 * rAF loop reading layout on every frame.
 *
 * Focusable and labelled, so it can be reached and scrolled from the keyboard.
 */
export function Lookbook() {
  return (
    <section aria-labelledby="lookbook-heading" className="overflow-hidden py-20 sm:py-28">
      <div className="mx-auto mb-10 flex w-full max-w-6xl flex-wrap items-end justify-between gap-4 px-6">
        <div>
          <p className="eyebrow">The lookbook</p>
          <h2 id="lookbook-heading" className="mt-4 text-3xl sm:text-4xl">
            Our work.
          </h2>
        </div>
        <Link
          href="/gallery"
          className="link-underline inline-flex items-center gap-2 pb-1 text-sm font-medium text-gold-ink"
        >
          See the full gallery
          <Arrow />
        </Link>
      </div>

      <div
        tabIndex={0}
        role="region"
        aria-label="Lookbook, scroll horizontally"
        className="snap-x snap-mandatory overflow-x-auto scroll-px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex w-max gap-4 px-6">
          {lookbook.map((key) => {
            const image = images[key];
            return (
              <li
                key={key}
                className="w-[62vw] shrink-0 snap-start sm:w-[34vw] lg:w-[21vw]"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-petal">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 62vw, (max-width: 1024px) 34vw, 21vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
