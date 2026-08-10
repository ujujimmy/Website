import type { Metadata } from "next";
import Image from "next/image";
import { founder } from "@/content/founder";
import { images } from "@/content/images";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button, Arrow } from "@/components/ui/Button";
import { whatsappLink, serviceMessage } from "@/content/brand";
import { JsonLd } from "@/components/JsonLd";
import { founderLd, breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Dechen Dolkar — Founder & Creative Director",
  description:
    "Dechen Dolkar: India's first Master Hair Extensions Trainer, All-India Educator for Olaplex, Balmain and BBCOS Italy, and founder of DECHEN Salon in Majnu-ka-Tilla, New Delhi.",
  alternates: { canonical: "/founder" },
};

export default function FounderPage() {
  return (
    <>
      <PageHero eyebrow={founder.role} title={`Meet ${founder.name}`} />

      <section className="px-6 pb-16">
        <div className="mx-auto grid w-full max-w-5xl items-start gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
          <Reveal variant="image">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] bg-petal lg:mx-0 lg:sticky lg:top-28">
              <Image
                src={images.founder.src}
                alt={images.founder.alt}
                fill
                sizes="(max-width: 1024px) 80vw, 32vw"
                className="object-cover"
                priority
              />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <blockquote className="border-l-2 border-gold/50 pl-6 font-display text-lg italic leading-relaxed text-ink sm:text-xl">
                {founder.quote}
              </blockquote>
            </Reveal>

            {founder.bio.map((paragraph, i) => (
              <Reveal key={i} delay={0.08 + i * 0.06}>
                <p className="mt-7 text-base leading-relaxed text-muted">
                  {paragraph}
                </p>
              </Reveal>
            ))}

            <Reveal delay={0.24}>
              <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-gold-ink">
                In short
              </h2>
              <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {founder.credentials.map((credential) => (
                  <div key={credential.label}>
                    <dt className="text-sm font-semibold text-ink">
                      {credential.label}
                    </dt>
                    <dd className="mt-1 text-xs text-muted">{credential.detail}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The brands she educates for */}
      <Section tone="cream">
        <SectionHead
          eyebrow="Educator"
          title="The names she teaches for."
          sub="Being an educator for a brand means training other stylists to use it properly — which is a rather different thing from stocking it."
          center
        />
        <ul className="mt-10 flex flex-wrap justify-center gap-3">
          {founder.brands.map((brandName, i) => (
            <Reveal as="li" key={brandName} delay={i * 0.05}>
              <span className="block rounded-full bg-card px-6 py-3 font-display text-lg text-ink shadow-[0_6px_20px_-14px_rgb(59_27_51_/_0.4)]">
                {brandName}
              </span>
            </Reveal>
          ))}
        </ul>
      </Section>

      <section className="px-6 py-20 text-center">
        <h2 className="text-2xl sm:text-3xl">Book with the Creative Director.</h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
          Total transformations, corrective colour, advanced hair science and
          luxury styling. Dechen&rsquo;s chair books ahead — send a message and
          we&rsquo;ll find you a slot.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            href={whatsappLink(serviceMessage("an appointment with Dechen"))}
            size="lg"
            external
          >
            Book with Dechen
            <Arrow />
          </Button>
          <Button href="/team" size="lg" variant="secondary">
            See all three tiers
          </Button>
        </div>
      </section>

      <JsonLd data={founderLd()} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: founder.name, path: "/founder" },
        ])}
      />
    </>
  );
}
