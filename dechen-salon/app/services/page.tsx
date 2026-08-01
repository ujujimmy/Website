import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { chapters } from "@/content/menu";
import { images } from "@/content/images";
import { chapterImage } from "@/components/home/ServicePreview";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Button, Arrow } from "@/components/ui/Button";
import { whatsappLink, bookingMessage } from "@/content/brand";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Cuts and styling, hair colour, extensions and bond repair at DECHEN Salon, Majnu-ka-Tilla, New Delhi. Every price published.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="What we do"
        title="Four things, done properly."
        sub="Cuts and styling, colour, extensions and repair. Every price is published — nothing is quoted only once you're in the chair."
      />

      <div className="px-6 pb-24">
        <ul className="mx-auto grid w-full max-w-5xl gap-6">
          {chapters.map((chapter, i) => {
            const image = images[chapterImage[chapter.slug]];
            return (
              <Reveal as="li" key={chapter.slug} delay={i * 0.06}>
                <article className="overflow-hidden rounded-[var(--radius-card)] bg-card shadow-[0_1px_2px_rgb(59_27_51_/_0.04),0_12px_32px_-12px_rgb(59_27_51_/_0.1)] md:grid md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                  <div className="relative aspect-[16/10] bg-petal md:aspect-auto md:min-h-[16rem]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 768px) 92vw, 38vw"
                      className="object-cover"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  </div>

                  <div className="p-8 sm:p-10">
                    <h2 className="text-2xl sm:text-3xl">{chapter.name}</h2>
                    <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                      {chapter.intro}
                    </p>

                    <ul className="mt-6 flex flex-wrap gap-2">
                      {chapter.groups.map((group) => (
                        <li
                          key={group.title}
                          className="rounded-full bg-petal px-3.5 py-1.5 text-xs text-muted"
                        >
                          {group.title}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/services/${chapter.slug}`}
                      className="mt-7 inline-flex items-center gap-2 border-b border-gold-ink/40 pb-1 text-sm font-medium text-gold-ink transition-colors hover:border-gold-ink"
                    >
                      See {chapter.name.toLowerCase()} and prices
                      <Arrow />
                    </Link>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>

        <div className="mx-auto mt-14 flex max-w-5xl flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button href="/menu" size="lg" variant="secondary">
            The full price menu
          </Button>
          <Button href={whatsappLink(bookingMessage)} size="lg" external>
            Book on WhatsApp
            <Arrow />
          </Button>
        </div>
      </div>

      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
    </>
  );
}
