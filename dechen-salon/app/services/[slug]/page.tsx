import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { chapters, chapterBySlug, type Chapter } from "@/content/menu";
import { images } from "@/content/images";
import { chapterImage } from "@/components/home/ServicePreview";
import { PageHero } from "@/components/layout/PageHero";
import { PriceRows } from "@/components/menu/PriceRows";
import { Reveal } from "@/components/ui/Reveal";
import { Button, Arrow } from "@/components/ui/Button";
import { Section, SectionHead } from "@/components/ui/Section";
import { tiers } from "@/content/tiers";
import { whatsappLink, serviceMessage } from "@/content/brand";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

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

  return (
    <>
      <PageHero
        eyebrow="Services"
        title={chapter.heading}
        sub={chapter.intro}
      />

      <div className="px-6 pb-8">
        <Reveal variant="image">
          <div className="relative mx-auto aspect-[16/9] w-full max-w-4xl overflow-hidden rounded-[2rem] bg-petal">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 1024px) 92vw, 56rem"
              className="object-cover"
              priority
            />
          </div>
        </Reveal>
      </div>

      {/* Prices */}
      <div className="px-6 py-16">
        <div className="mx-auto w-full max-w-4xl">
          <h2 className="sr-only">{chapter.name} prices</h2>
          <div className="flex flex-col gap-5">
            {chapter.groups.map((group, i) => (
              <Reveal key={group.title} delay={Math.min(i, 4) * 0.05}>
                <PriceRows group={group} />
              </Reveal>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-muted">
            Tap any service to enquire on WhatsApp. Prices are in rupees and
            exclude taxes where applicable.
          </p>
        </div>
      </div>

      {/* Editorial detail, where the chapter has some. */}
      {chapter.detail?.length ? (
        <Section tone="cream">
          <div className="grid gap-10 lg:grid-cols-2">
            {chapter.detail.map((block, i) => (
              <Reveal key={block.title} delay={i * 0.07}>
                <article>
                  <h2 className="text-2xl sm:text-3xl">{block.title}</h2>
                  <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                    {block.body}
                  </p>
                  {block.points?.length ? (
                    <ul className="mt-5 flex flex-col gap-2.5">
                      {block.points.map((point) => (
                        <li key={point} className="flex gap-3 text-sm text-muted">
                          <svg
                            viewBox="0 0 20 20"
                            className="mt-0.5 h-4 w-4 shrink-0 fill-none stroke-gold stroke-[2]"
                            aria-hidden="true"
                          >
                            <path
                              d="M4.5 10.5l3.5 3.5 7.5-8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {point}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Which tier to pick */}
      <Section>
        <SectionHead
          eyebrow="Choosing"
          title="Which artist should you book?"
          sub="Every service above is offered at three levels. The difference is experience — the care is the same at all three."
          center
        />
        <ul className="mt-10 grid gap-4 lg:grid-cols-3">
          {tiers.map((tier, i) => (
            <Reveal as="li" key={tier.id} delay={i * 0.06}>
              <div className="panel h-full">
                <h3 className="text-xl text-gold-ink">{tier.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {tier.perfectFor}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
        <div className="mt-8 text-center">
          <Link
            href="/team"
            className="link-underline inline-flex items-center gap-2 pb-1 text-sm font-medium text-gold-ink"
          >
            More about the team
          </Link>
        </div>
      </Section>

      {/* Close */}
      <section className="px-6 pb-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 rounded-[2.5rem] bg-plum px-8 py-14 text-center text-petal sm:px-14">
          <h2 className="text-2xl sm:text-3xl">Ready when you are.</h2>
          <p className="max-w-md text-sm leading-relaxed text-petal/75">
            Send a message and tell us what you&rsquo;re thinking. We&rsquo;ll
            suggest the service, the artist and how long it will take.
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <Button
              href={whatsappLink(serviceMessage(chapter.name.toLowerCase()))}
              size="lg"
              variant="secondary"
              external
            >
              Enquire about {chapter.name.toLowerCase()}
              <Arrow />
            </Button>
            <Button href="/menu" size="lg" variant="ghost">
              Full price menu
            </Button>
          </div>
        </div>
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
