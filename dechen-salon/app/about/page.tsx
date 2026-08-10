import type { Metadata } from "next";
import Image from "next/image";
import { philosophy, pillars, whyChoose } from "@/content/philosophy";
import { images } from "@/content/images";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button, Arrow } from "@/components/ui/Button";
import { whatsappLink, bookingMessage } from "@/content/brand";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Our philosophy",
  description:
    "DECHEN Salon is a women-led, Tibetan-owned salon in Majnu-ka-Tilla rooted in Buddhist principles: vegan and cruelty-free products, mentorship for Tibetan youth, and hair care as a form of therapy.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our philosophy"
        title={philosophy.headline}
        sub={philosophy.body}
      />

      <div className="px-6 pb-6">
        <Reveal variant="image">
          <div className="relative mx-auto aspect-[16/10] w-full max-w-4xl overflow-hidden rounded-[2rem] bg-petal">
            <Image
              src={images.treatmentScalp.src}
              alt={images.treatmentScalp.alt}
              fill
              sizes="(max-width: 1024px) 92vw, 56rem"
              className="object-cover"
              priority
            />
          </div>
        </Reveal>
      </div>

      {/* The eight pillars */}
      <Section>
        <SectionHead
          eyebrow="What we stand for"
          title="Eight things we won't compromise on."
          center
        />

        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {pillars.map((pillar, i) => (
            <Reveal as="li" key={pillar.n} delay={Math.min(i, 5) * 0.05}>
              <article className="panel h-full">
                <span className="font-display text-3xl text-rose-deep" aria-hidden="true">
                  {pillar.n}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-ink">
                  {pillar.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">
                  {pillar.body}
                </p>
              </article>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Why choose us */}
      <Section tone="plum">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose">
            Why DECHEN
          </p>
          <h2 className="mt-4 text-3xl sm:text-4xl">
            Professional-grade, rooted in compassion.
          </h2>

          <ul className="mt-10 flex flex-col gap-3.5 text-left">
            {whyChoose.map((point, i) => (
              <Reveal as="li" key={point} delay={i * 0.06}>
                <span className="flex gap-3.5 text-base leading-relaxed text-petal/85">
                  <svg
                    viewBox="0 0 20 20"
                    className="mt-1 h-4 w-4 shrink-0 fill-none stroke-rose stroke-[2]"
                    aria-hidden="true"
                  >
                    <path
                      d="M4.5 10.5l3.5 3.5 7.5-8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {point}
                </span>
              </Reveal>
            ))}
          </ul>

          <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/founder" size="lg" variant="secondary">
              Meet Dechen
            </Button>
            <Button href={whatsappLink(bookingMessage)} size="lg" variant="ghost" external>
              Book on WhatsApp
              <Arrow />
            </Button>
          </div>
        </div>
      </Section>

      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Our philosophy", path: "/about" },
        ])}
      />
    </>
  );
}
