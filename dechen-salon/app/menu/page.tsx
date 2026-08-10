import type { Metadata } from "next";
import Link from "next/link";
import { chapters, retail } from "@/content/menu";
import { PageHero } from "@/components/layout/PageHero";
import { PriceTable } from "@/components/menu/PriceTable";
import { TierFocus } from "@/components/menu/TierFocus";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button, Arrow } from "@/components/ui/Button";
import { whatsappLink, bookingMessage } from "@/content/brand";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Price menu",
  description:
    "The complete DECHEN Salon price list: haircuts, blowdry, global colour, highlights, balayage, ash tones, babylights, extensions, Olaplex and hair spa. Majnu-ka-Tilla, New Delhi.",
  alternates: { canonical: "/menu" },
};

export default function MenuPage() {
  return (
    <>
      <PageHero
        eyebrow="Every price, published"
        title="The full menu."
        sub="Cutting and colour are quoted at three levels. The difference is the artist's experience — the products, the care and the time you get are the same at all three."
      />

      <div className="px-6 pb-20">
        <div className="mx-auto w-full max-w-4xl">
          <TierFocus>
            {/* Jump links, because this page is long by design. */}
            <nav aria-label="Menu sections" className="mb-10">
              <ul className="flex flex-wrap justify-center gap-2">
                {chapters.map((chapter) => (
                  <li key={chapter.slug}>
                    <a
                      href={`#${chapter.slug}`}
                      className="inline-block rounded-full bg-card px-4 py-2 text-sm text-muted shadow-[0_4px_14px_-10px_rgb(59_27_51_/_0.4)] transition-colors hover:text-ink"
                    >
                      {chapter.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex flex-col gap-14">
              {chapters.map((chapter) => (
                <section
                  key={chapter.slug}
                  id={chapter.slug}
                  className="scroll-mt-40"
                >
                  <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <h2 className="text-3xl sm:text-4xl">{chapter.name}</h2>
                    <Link
                      href={`/services/${chapter.slug}`}
                      className="link-underline pb-0.5 text-sm font-medium text-gold-ink"
                    >
                      About {chapter.name.toLowerCase()} &rarr;
                    </Link>
                  </div>

                  <PriceTable chapter={chapter} />
                </section>
              ))}
            </div>
          </TierFocus>

          <p className="mt-10 text-center text-xs leading-relaxed text-muted">
            Tap any service to enquire on WhatsApp. Prices are in rupees.
            Extension totals depend on how many strands you need, which we work
            out together at consultation.
          </p>
        </div>
      </div>

      {/* Retail */}
      <Section tone="cream">
        <SectionHead
          eyebrow="To take home"
          title="What we send you home with."
          sub="We only stock what we use in the chair, and we'll tell you honestly if you don't need it."
          center
        />
        <ul className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
          {retail.map((product, i) => (
            <Reveal as="li" key={product.name} delay={i * 0.06}>
              <div className="panel h-full">
                <h3 className="text-lg font-semibold text-ink">{product.name}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">
                  {product.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <section className="px-6 py-20 text-center">
        <h2 className="text-2xl sm:text-3xl">Not sure what you need?</h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
          Send us a photo of your hair and what you&rsquo;d like. We&rsquo;ll tell
          you what it takes, what it costs and how long it holds.
        </p>
        <div className="mt-8">
          <Button href={whatsappLink(bookingMessage)} size="lg" external>
            Ask on WhatsApp
            <Arrow />
          </Button>
        </div>
      </section>

      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Price menu", path: "/menu" },
        ])}
      />
    </>
  );
}
