import type { Metadata } from "next";
import { pages } from "@/content/copy";
import { founder } from "@/content/founder";
import { images } from "@/content/images";
import { PageHead } from "@/components/layout/PageHead";
import { Frame } from "@/components/ui/Frame";
import { Reveal } from "@/components/ui/Reveal";
import { Button, Arrow } from "@/components/ui/Button";
import { whatsappLink, serviceMessage } from "@/content/brand";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, founderLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Dechen Dolkar",
  description:
    "Dechen Dolkar — founder and Creative Director. India's first Master Hair Extensions Trainer and All-India Educator for Olaplex, Balmain and BBCOS Italy.",
  alternates: { canonical: "/founder" },
};

export default function FounderPage() {
  return (
    <>
      <PageHead
        eyebrow={pages.founder.eyebrow}
        title={pages.founder.title}
        lead={pages.founder.lead}
      />

      <div className="gutter pb-20 md:pb-28">
        <div className="grid gap-12 lg:grid-cols-[26rem_minmax(0,1fr)] lg:gap-20">
          <Reveal variant="wipe">
            <Frame
              img={images.founder}
              ratio="figure"
              sizes="(max-width: 64rem) 100vw, 26rem"
              priority
            />
            <p className="micro mt-4 text-muted">
              {founder.name} &nbsp;&middot;&nbsp; {founder.alsoKnownAs}
            </p>
          </Reveal>

          <div>
            <Reveal>
              <blockquote className="t-quote max-w-2xl">
                &ldquo;{founder.quote}&rdquo;
              </blockquote>
            </Reveal>

            <div className="mt-10 flex flex-col gap-5">
              {founder.bio.map((paragraph, i) => (
                <Reveal key={paragraph.slice(0, 20)} delay={0.05 + i * 0.05}>
                  <p className="prose-measure">{paragraph}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.14}>
              <dl className="mt-12 grid gap-x-12 gap-y-6 sm:grid-cols-2">
                {founder.credentials.map((credential) => (
                  <div key={credential.label} className="border-t border-line pt-4">
                    <dt className="text-sm font-medium">{credential.label}</dt>
                    <dd className="mt-1.5 text-xs leading-relaxed text-muted">
                      {credential.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Brands. */}
      <section className="on-ink">
        <div className="gutter py-16 md:py-20">
          <p className="micro text-brass">Educator and trainer for</p>
          <ul className="mt-8 flex flex-wrap gap-x-12 gap-y-5">
            {founder.brands.map((label, i) => (
              <Reveal as="li" key={label} delay={i * 0.05}>
                <span className="display text-2xl tracking-[0.06em] text-cream sm:text-3xl">
                  {label}
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="gutter py-20 md:py-24">
        <h2 className="t-section max-w-xl">Book the Creative Director.</h2>
        <p className="prose-measure mt-6">
          Dechen takes a limited number of chairs each week — corrective colour,
          total transformations and advanced extension work. Message ahead.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button
            href={whatsappLink(serviceMessage("an appointment with Dechen"))}
            external
          >
            Ask for Dechen
            <Arrow />
          </Button>
          <Button href="/menu" variant="line">
            Creative Director prices
          </Button>
        </div>
      </section>

      <JsonLd data={founderLd()} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Dechen Dolkar", path: "/founder" },
        ])}
      />
    </>
  );
}
