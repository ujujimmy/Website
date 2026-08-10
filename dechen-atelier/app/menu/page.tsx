import type { Metadata } from "next";
import Link from "next/link";
import { chapters, retail } from "@/content/menu";
import { pages } from "@/content/copy";
import { PageHead } from "@/components/layout/PageHead";
import { PriceTable } from "@/components/menu/PriceTable";
import { TierFocus } from "@/components/menu/TierFocus";
import { Reveal } from "@/components/ui/Reveal";
import { Button, Arrow } from "@/components/ui/Button";
import { whatsappLink, bookingMessage } from "@/content/brand";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Price index",
  description:
    "The complete DECHEN Salon price list: haircuts, blowdry, global colour, highlights, balayage, ash tones, babylights, extensions, Olaplex and hair spa. Majnu-ka-Tilla, New Delhi.",
  alternates: { canonical: "/menu" },
};

export default function MenuPage() {
  return (
    <>
      <PageHead
        eyebrow={pages.menu.eyebrow}
        title={pages.menu.title}
        lead={pages.menu.lead}
      />

      <div className="gutter pb-24">
        <TierFocus>
          {/* Jump links, because this page is long by design. */}
          <nav aria-label="Index sections" className="mb-12">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {chapters.map((chapter, i) => (
                <li key={chapter.slug}>
                  <a href={`#${chapter.slug}`} className="micro link-rule text-muted">
                    {String(i + 1).padStart(2, "0")} &nbsp; {chapter.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Each chapter uses the site's index grid: its name and number stay
              pinned in the left margin while its prices scroll past, so it is
              always clear which chapter a figure belongs to on a page this
              long. It also caps the table's width — a service name at the far
              left and a price 1,300px away at the far right is a long way for
              an eye to travel. */}
          <div className="flex flex-col gap-20 md:gap-28">
            {chapters.map((chapter, i) => (
              <section
                key={chapter.slug}
                id={chapter.slug}
                className="index-grid scroll-mt-36"
              >
                <div className="mb-8 flex flex-wrap items-baseline gap-x-6 gap-y-2 lg:sticky lg:top-32 lg:mb-0 lg:h-fit lg:flex-col lg:items-start">
                  <p className="micro text-lacquer">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="t-sub lg:mt-2">{chapter.name}</h2>
                  <Link
                    href={`/services/${chapter.slug}`}
                    className="micro link-rule text-muted lg:mt-4"
                  >
                    About this
                  </Link>
                </div>

                <PriceTable chapter={chapter} />
              </section>
            ))}
          </div>
        </TierFocus>

        <p className="mt-14 max-w-2xl text-xs leading-relaxed text-muted">
          Tap any service to enquire on WhatsApp. Prices are in rupees.
          Extension totals depend on how many strands you need, which we work out
          together at consultation.
        </p>
      </div>

      {/* Retail */}
      <section className="bg-paper-2">
        <div className="gutter py-20 md:py-24">
          <div className="index-grid">
            <Reveal className="micro flex items-baseline gap-3 pb-6 text-muted lg:flex-col lg:gap-2 lg:pb-0">
              <span className="text-lacquer">05</span>
              <span>To take home</span>
            </Reveal>

            <div>
              <h2 className="t-section max-w-xl">What we send you home with.</h2>
              <p className="prose-measure mt-6">
                We only stock what we use in the chair, and we&rsquo;ll tell you
                honestly if you don&rsquo;t need it.
              </p>

              <ul className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-2">
                {retail.map((product, i) => (
                  <Reveal as="li" key={product.name} delay={i * 0.06}>
                    <div className="border-t border-line pt-5">
                      <h3 className="t-sub">{product.name}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted">
                        {product.body}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="gutter py-20 md:py-24">
        <h2 className="t-section max-w-xl">Not sure what you need?</h2>
        <p className="prose-measure mt-6">
          Send a photograph of your hair and what you&rsquo;d like. We&rsquo;ll
          tell you what it takes, what it costs and how long it holds.
        </p>
        <div className="mt-9">
          <Button href={whatsappLink(bookingMessage)} external>
            Ask on WhatsApp
            <Arrow />
          </Button>
        </div>
      </section>

      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Price index", path: "/menu" },
        ])}
      />
    </>
  );
}
