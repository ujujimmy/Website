import Image from "next/image";
import Link from "next/link";
import { chapters } from "@/content/menu";
import { images, type ImageKey } from "@/content/images";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

/** One representative photograph per chapter. */
export const chapterImage: Record<string, ImageKey> = {
  "cuts-and-styling": "cutLayers",
  "hair-color": "colorBalayage",
  "hair-extensions": "extensionsBundles",
  treatments: "treatmentNanoplastia",
};

export function ServicePreview() {
  return (
    <Section id="services">
      <SectionHead
        eyebrow="What we do"
        title="Four things, done properly."
        sub="Cuts and styling, colour, extensions and repair. Every price is on the menu — nothing is quoted only once you're in the chair."
      />

      <ul className="mt-12 grid gap-5 sm:grid-cols-2">
        {chapters.map((chapter, i) => {
          const image = images[chapterImage[chapter.slug]];
          return (
            <Reveal as="li" key={chapter.slug} delay={i * 0.07}>
              <Link
                href={`/services/${chapter.slug}`}
                className="group block h-full overflow-hidden rounded-[var(--radius-card)] bg-card shadow-[0_1px_2px_rgb(59_27_51_/_0.04),0_12px_32px_-12px_rgb(59_27_51_/_0.1)] transition-transform duration-500 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-petal">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 92vw, 46vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                </div>
                <div className="p-7">
                  <h3 className="text-2xl text-ink">{chapter.name}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">
                    {chapter.blurb}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-gold-ink">
                    See prices
                    <svg
                      viewBox="0 0 20 20"
                      className="h-4 w-4 fill-none stroke-current stroke-[1.8] transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      <path d="M4 10h11M11 5.5L15.5 10 11 14.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
