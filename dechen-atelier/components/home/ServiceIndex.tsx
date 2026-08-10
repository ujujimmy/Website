import Link from "next/link";
import { chapters, type Chapter } from "@/content/menu";
import { images, type ImageKey } from "@/content/images";
import { lowestAmount } from "@/lib/price";
import { formatAmount } from "@/lib/price";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The four chapters, as a numbered index that fills the width of the page.
 *
 * The interaction is the point: on a pointer device the row slides right and a
 * photograph fades in at the end of the line. It's all CSS on `:hover` and
 * `:focus-visible`, so it works from the keyboard and costs no JavaScript. On
 * touch there is no hover to speak of, so the pictures are never rendered
 * rather than being rendered and left permanently invisible.
 */

const chapterImage: Record<Chapter["slug"], ImageKey> = {
  "cuts-and-styling": "cutLayers",
  "hair-color": "colorBalayage",
  "hair-extensions": "extensionsBundles",
  treatments: "treatmentNanoplastia",
};

export function ServiceIndex() {
  return (
    <div>
      {chapters.map((chapter, i) => {
        const from = cheapest(chapter);
        const img = images[chapterImage[chapter.slug]];

        return (
          <Reveal key={chapter.slug} delay={i * 0.05}>
            <Link className="idx-row group" href={`/services/${chapter.slug}`}>
              <span className="micro pt-1 text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>

              <span>
                <span className="idx-title display block text-[clamp(1.75rem,4.2vw,3rem)] leading-[1.05]">
                  {chapter.name}
                </span>
                <span className="mt-2 block max-w-md text-sm leading-relaxed text-muted">
                  {chapter.blurb}
                </span>
              </span>

              <span className="hidden lg:block">
                <span className="micro block text-right text-muted">
                  {from ? `From ${formatAmount(from)}` : "On consultation"}
                </span>
              </span>

              {/* Decorative: the row already says everything this shows. */}
              <span className="idx-figure hidden lg:block" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </span>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}

/** The lowest published figure anywhere in a chapter. */
function cheapest(chapter: Chapter): number | null {
  const amounts = chapter.groups
    .flatMap((group) => group.items.map((item) => lowestAmount(item.price)))
    .filter((amount): amount is number => amount !== null);

  return amounts.length ? Math.min(...amounts) : null;
}
