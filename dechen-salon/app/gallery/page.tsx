import type { Metadata } from "next";
import Image from "next/image";
import { images, lookbook } from "@/content/images";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Button, Arrow } from "@/components/ui/Button";
import { Section, SectionHead } from "@/components/ui/Section";
import { brand, whatsappLink, bookingMessage } from "@/content/brand";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Balayage, babylights, ash tones, highlights, extensions and smoothing treatments from DECHEN Salon, Majnu-ka-Tilla, New Delhi.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="The lookbook"
        title="Colour, cut and length."
        sub="Balayage, babylights, ash tones, highlights and extensions. If you see something you like, send it to us — a photograph is the fastest consultation there is."
      />

      {/* A masonry-ish grid. Columns rather than grid-auto-flow so the varied
          aspect ratios pack without leaving gaps. */}
      <div className="px-6 pb-16">
        <div className="mx-auto w-full max-w-6xl columns-2 gap-4 lg:columns-3 [&>*]:mb-4">
          {lookbook.map((key, i) => {
            const image = images[key];
            return (
              <Reveal key={key} delay={Math.min(i, 6) * 0.04}>
                <figure className="break-inside-avoid overflow-hidden rounded-[1.5rem] bg-petal">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    sizes="(max-width: 640px) 46vw, (max-width: 1024px) 46vw, 31vw"
                    className="h-auto w-full"
                    loading={i < 4 ? "eager" : "lazy"}
                  />
                </figure>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Before and after */}
      <Section tone="cream">
        <SectionHead
          eyebrow="Bond repair"
          title="Before, and after."
          sub="What an Olaplex treatment does to hair that has been lightened, heat-styled and left to it. The bonds are rebuilt, not coated."
          center
        />
        <Reveal>
          <figure className="mx-auto mt-10 max-w-2xl">
            <div className="relative overflow-hidden rounded-[1.75rem] bg-petal">
              <Image
                src={images.olaplexBeforeAfter.src}
                alt={images.olaplexBeforeAfter.alt}
                width={images.olaplexBeforeAfter.width}
                height={images.olaplexBeforeAfter.height}
                sizes="(max-width: 768px) 92vw, 42rem"
                className="h-auto w-full"
                loading="lazy"
              />
              {/* Labels rather than a slider: the photograph is already a
                  side-by-side, and splitting it would only invent a seam. */}
              <span className="absolute left-4 top-4 rounded-full bg-plum/75 px-3 py-1 text-xs font-medium text-petal backdrop-blur-sm">
                Before
              </span>
              <span className="absolute right-4 top-4 rounded-full bg-plum/75 px-3 py-1 text-xs font-medium text-petal backdrop-blur-sm">
                After
              </span>
            </div>
            <figcaption className="mt-4 text-center text-xs text-muted">
              Olaplex treatment · ₹2,500–3,500
            </figcaption>
          </figure>
        </Reveal>
      </Section>

      <section className="px-6 py-20 text-center">
        <h2 className="text-2xl sm:text-3xl">Seen something you want?</h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
          Send us the picture. We&rsquo;ll tell you honestly whether it will work
          on your hair, what it takes to get there, and what it costs.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href={whatsappLink(bookingMessage)} size="lg" external>
            Send us a photo
            <Arrow />
          </Button>
          <Button href={brand.socials.instagram} size="lg" variant="secondary" external>
            {brand.socials.instagramHandle}
          </Button>
        </div>
      </section>

      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" },
        ])}
      />
    </>
  );
}
