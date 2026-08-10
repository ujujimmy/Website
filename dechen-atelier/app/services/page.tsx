import type { Metadata } from "next";
import { pages } from "@/content/copy";
import { PageHead } from "@/components/layout/PageHead";
import { ServiceIndex } from "@/components/home/ServiceIndex";
import { Button, Arrow } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { tiers } from "@/content/tiers";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Cuts and styling, hair colour, hair extensions and treatments at DECHEN Salon, Majnu-ka-Tilla, New Delhi. Every price published.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHead
        eyebrow={pages.services.eyebrow}
        title={pages.services.title}
        lead={pages.services.lead}
      />

      <div className="gutter py-4 pb-20">
        <ServiceIndex />
      </div>

      <section className="on-ink">
        <div className="gutter py-20 md:py-24">
          <div className="index-grid">
            <Reveal className="micro flex items-baseline gap-3 pb-6 text-brass lg:flex-col lg:gap-2 lg:pb-0">
              <span>05</span>
              <span>Artist levels</span>
            </Reveal>

            <div>
              <h2 className="t-section max-w-2xl text-cream">
                Three levels, one standard.
              </h2>
              <p className="prose-measure mt-6">
                Cutting and colour are quoted three ways. The products, the care
                and the time are the same at every level — what changes is
                experience.
              </p>

              <ol className="mt-12 flex flex-col">
                {tiers.map((tier, i) => (
                  <Reveal as="li" key={tier.id} delay={i * 0.06}>
                    <div className="grid gap-4 border-t border-line-dark py-7 lg:grid-cols-[4rem_14rem_minmax(0,1fr)] lg:gap-10">
                      <span className="micro text-brass">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="t-sub text-cream">{tier.name}</h3>
                        <p className="mt-2 text-xs text-dim">{tier.strapline}</p>
                      </div>
                      <p className="max-w-xl text-sm leading-relaxed text-dim">
                        {tier.perfectFor}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ol>

              <div className="mt-12 flex flex-wrap gap-3">
                <Button href="/menu" variant="line">
                  Every price
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
          { name: "Services", path: "/services" },
        ])}
      />
    </>
  );
}
