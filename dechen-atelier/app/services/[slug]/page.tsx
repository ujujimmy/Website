import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  chapters,
  chapterBySlug,
  chapterHasTiers,
  type Chapter,
} from "@/content/menu";
import { images, type ImageKey } from "@/content/images";
import { PageHead } from "@/components/layout/PageHead";
import { PriceTable } from "@/components/menu/PriceTable";
import { TierFocus } from "@/components/menu/TierFocus";
import { Frame } from "@/components/ui/Frame";
import { Reveal } from "@/components/ui/Reveal";
import { Button, Arrow } from "@/components/ui/Button";
import { whatsappLink, serviceMessage } from "@/content/brand";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

const chapterImage: Record<Chapter["slug"], ImageKey> = {
  "cuts-and-styling": "cutsBanner",
  "hair-color": "colorBalayage",
  "hair-extensions": "extensionsBundles",
  treatments: "olaplexBeforeAfter",
};

export function generateStaticParams() {
  return chapters.map((chapter) => ({ slug: chapter.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const chapter = chapterBySlug[slug as Chapter["slug"]];
  if (!chapter) return {};

  return {
    title: chapter.seo.title,
    description: chapter.seo.description,
    alternates: { canonical: `/services/${chapter.slug}` },
  };
}

export default async function ChapterPage({ params }: Params) {
  const { slug } = await params;
  const chapter = chapterBySlug[slug as Chapter["slug"]];
  if (!chapter) notFound();

  const image = images[chapterImage[chapter.slug]];
  const others = chapters.filter((other) => other.slug !== chapter.slug);

  return (
    <>
      <PageHead
        eyebrow="Services"
        title={chapter.heading}
        lead={chapter.intro}
      />

      <div className="gutter">
        <Reveal variant="wipe">
          <Frame img={image} ratio="wide" sizes="100vw" />
        </Reveal>
      </div>

      {/* Prices */}
      <div className="gutter max-w-5xl py-20 md:py-24">
        <h2 className="micro mb-8 text-lacquer">Prices</h2>
        {/* No artist levels in this chapter means nothing for the filter to do,
            so it isn't shown. */}
        {chapterHasTiers(chapter) ? (
          <TierFocus>
            <PriceTable chapter={chapter} />
          </TierFocus>
        ) : (
          <PriceTable chapter={chapter} />
        )}

        <p className="mt-10 max-w-2xl text-xs leading-relaxed text-muted">
          Tap any service to enquire on WhatsApp. Prices are in rupees and
          exclude taxes where applicable.
        </p>
      </div>

      {/* Editorial detail, where the chapter has some. */}
      {chapter.detail?.length ? (
        <section className="bg-paper-2">
          <div className="gutter py-20 md:py-24">
            <div className="grid gap-x-16 gap-y-12 lg:grid-cols-2">
              {chapter.detail.map((block, i) => (
                <Reveal key={block.title} delay={i * 0.06}>
                  <div className="border-t border-line pt-6">
                    <h2 className="t-sub max-w-md">{block.title}</h2>
                    <p className="prose-measure mt-4 text-sm">{block.body}</p>
                    {block.points?.length ? (
                      <ul className="mt-5 flex flex-col gap-2">
                        {block.points.map((point) => (
                          <li
                            key={point}
                            className="flex gap-3 text-sm leading-relaxed text-muted"
                          >
                            <span aria-hidden="true" className="text-lacquer">
                              &#9679;
                            </span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Book, then the other three chapters. */}
      <section className="gutter py-20 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <h2 className="t-section max-w-xl">
              Book {chapter.name.toLowerCase()}.
            </h2>
            <p className="prose-measure mt-5">
              Message us with what you have in mind. We&rsquo;ll tell you what it
              takes and what it costs before you sit down.
            </p>
          </div>
          <Button href={whatsappLink(serviceMessage(chapter.name))} external>
            Enquire on WhatsApp
            <Arrow />
          </Button>
        </div>

        <nav aria-label="Other services" className="mt-16">
          <p className="micro mb-5 text-muted">Also here</p>
          <ul className="grid gap-x-10 sm:grid-cols-3">
            {others.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/services/${other.slug}`}
                  className="group block border-t border-line py-5"
                >
                  <span className="t-sub block transition-colors duration-500 group-hover:text-lacquer">
                    {other.name}
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-muted">
                    {other.blurb}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: chapter.name, path: `/services/${chapter.slug}` },
        ])}
      />
    </>
  );
}
