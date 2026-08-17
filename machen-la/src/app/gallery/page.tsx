import type { Metadata } from "next";
import { Plate } from "@/components/Plate";
import { JsonLd } from "@/components/JsonLd";
import { IMAGES } from "@/data/images";
import { breadcrumbLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "The room and the food — Machen La, Majnu ka Tilla",
  description:
    "Inside Machen La Tibet Kitchen in Majnu ka Tilla, Delhi — the dining room, the hot pot, the momo platter and the frontage on the lane.",
  path: "/gallery",
});

/**
 * Six images, placed. Not a grid.
 *
 * Every source file is ~1080px, so each one is capped at 540 CSS pixels and set
 * in a hairline frame with dark space around it. A uniform three-column grid
 * would either stretch them past their native width or shrink them into
 * thumbnails; staggering them lets each sit at its correct size and turns the
 * constraint into the layout.
 */
const PLACED = [
  { slot: IMAGES.interior, caption: "The room in the evening", offset: "" },
  { slot: IMAGES.hotPot, caption: "Hot pot, cooking at the table", offset: "md:mt-32" },
  { slot: IMAGES.momos, caption: "The momo platter", offset: "md:mt-4" },
  {
    slot: IMAGES.morningCoffee,
    caption: "Coffee at 7:30, before the lane opens",
    offset: "md:mt-28",
  },
  { slot: IMAGES.frontage, caption: "The frontage, from the lane", offset: "" },
  { slot: IMAGES.staff, caption: "In the kitchen", offset: "md:mt-24" },
];

export default function GalleryPage() {
  return (
    <>
      <section className="mx-auto max-w-[76rem] px-5 pt-12 sm:px-8 sm:pt-16">
        <h1 className="font-display max-w-[20ch] text-display-l font-semibold text-wall">
          Inside Machen La Tibet Kitchen
        </h1>
        <p className="mt-8 max-w-[52ch] text-lede text-wall-dim">
          Monastery-influenced interiors, painted colour, Tibetan music, and
          enough room between the tables to put a hot pot down. Indoor seating and
          outdoor seating.
        </p>
      </section>

      <section className="mx-auto max-w-[76rem] px-5 pt-16 pb-8 sm:px-8 sm:pt-24">
        <ul className="grid gap-16 sm:gap-20 md:grid-cols-2 md:gap-x-16">
          {PLACED.map(({ slot, caption, offset }) => (
            <li key={slot.id} className={offset}>
              <figure>
                <Plate slot={slot} sizes="(max-width: 767px) 100vw, 480px" />
                <figcaption className="mt-4 max-w-[34ch] font-mono text-meta uppercase text-wall-faint">
                  {caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <JsonLd data={breadcrumbLd([{ name: "Gallery", path: "/gallery" }])} />
    </>
  );
}
