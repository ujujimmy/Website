import type { Metadata } from "next";
import { pages } from "@/content/copy";
import { philosophy, pillars, whyChoose } from "@/content/philosophy";
import { images } from "@/content/images";
import { PageHead } from "@/components/layout/PageHead";
import { Frame } from "@/components/ui/Frame";
import { Reveal } from "@/components/ui/Reveal";
import { Button, Arrow } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Our philosophy",
  description:
    "A women-led, Tibetan-owned salon rooted in Buddhist principles: vegan and cruelty-free products, careers for Tibetan youth, and hair care as a form of wellness.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHead
        eyebrow={pages.about.eyebrow}
        title={pages.about.title}
        lead={pages.about.lead}
      />

      {/* The philosophy, in the salon's own words. */}
      <section className="on-ink">
        <div className="gutter py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-20">
            <div>
              <h2 className="t-section max-w-xl text-cream">
                {philosophy.headline}
              </h2>
              <Reveal delay={0.06}>
                <p className="t-quote mt-8 max-w-2xl text-cream">
                  {philosophy.body}
                </p>
              </Reveal>
            </div>

            <Reveal variant="wipe" delay={0.1}>
              <Frame
                img={images.treatmentScalp}
                ratio="portrait"
                sizes="(max-width: 64rem) 100vw, 20rem"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* The eight pillars, as an index. */}
      <section className="gutter py-20 md:py-28">
        <div className="index-grid">
          <Reveal className="micro flex items-baseline gap-3 pb-8 text-muted lg:sticky lg:top-28 lg:h-fit lg:flex-col lg:gap-2 lg:pb-0">
            <span className="text-lacquer">02</span>
            <span>What we stand for</span>
          </Reveal>

          <ol className="flex flex-col">
            {pillars.map((pillar, i) => (
              <Reveal as="li" key={pillar.n} delay={Math.min(i, 4) * 0.04}>
                <div className="grid gap-x-8 gap-y-2 border-t border-line py-7 lg:grid-cols-[4rem_minmax(0,1fr)]">
                  <span className="micro pt-1.5 text-muted">{pillar.n}</span>
                  <div>
                    <h3 className="t-sub max-w-xl">{pillar.title}</h3>
                    <p className="prose-measure mt-3 text-sm">{pillar.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Why choose us. */}
      <section className="bg-paper-2">
        <div className="gutter py-20 md:py-24">
          <div className="index-grid">
            <Reveal className="micro flex items-baseline gap-3 pb-8 text-muted lg:flex-col lg:gap-2 lg:pb-0">
              <span className="text-lacquer">03</span>
              <span>Why us</span>
            </Reveal>

            <div>
              <h2 className="t-section max-w-xl">Five reasons, honestly.</h2>
              <ul className="mt-10">
                {whyChoose.map((reason, i) => (
                  <Reveal as="li" key={reason} delay={i * 0.05}>
                    <div className="flex items-baseline gap-6 border-t border-line py-5 last:border-b">
                      <span className="micro shrink-0 text-lacquer">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-base leading-relaxed sm:text-lg">
                        {reason}
                      </span>
                    </div>
                  </Reveal>
                ))}
              </ul>

              <div className="mt-12 flex flex-wrap gap-3">
                <Button href="/founder" variant="line">
                  Meet Dechen
                  <Arrow />
                </Button>
                <Button href="/team" variant="line">
                  The team
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Our philosophy", path: "/about" },
        ])}
      />
    </>
  );
}
