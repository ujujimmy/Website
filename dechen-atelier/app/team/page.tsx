import type { Metadata } from "next";
import { pages } from "@/content/copy";
import { tiers } from "@/content/tiers";
import { PageHead } from "@/components/layout/PageHead";
import { Reveal } from "@/components/ui/Reveal";
import { Button, Arrow } from "@/components/ui/Button";
import { whatsappLink, serviceMessage } from "@/content/brand";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "The team",
  description:
    "Top Artist, Creative Artist and Creative Director — the three levels at DECHEN Salon, what each one is best for, and how the pricing works.",
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  return (
    <>
      <PageHead
        eyebrow={pages.team.eyebrow}
        title={pages.team.title}
        lead={pages.team.lead}
      />

      <div className="gutter pb-20">
        {tiers.map((tier, i) => (
          <Reveal key={tier.id} delay={i * 0.06}>
            <article className="grid gap-x-12 gap-y-6 border-t border-line py-12 lg:grid-cols-[5rem_18rem_minmax(0,1fr)] lg:py-16">
              <p className="micro text-lacquer">
                {String(i + 1).padStart(2, "0")}
              </p>

              <div>
                <h2 className="t-sub">{tier.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {tier.strapline}
                </p>
              </div>

              <div>
                <p className="prose-measure">{tier.body}</p>

                <div className="mt-7 border-t border-line-soft pt-4">
                  <p className="micro text-muted">Perfect for</p>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed">
                    {tier.perfectFor}
                  </p>
                </div>

                <div className="mt-7">
                  <a
                    href={whatsappLink(
                      serviceMessage(`an appointment with a ${tier.name}`),
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="micro link-rule text-lacquer"
                  >
                    Book a {tier.name}
                  </a>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <section className="bg-paper-2">
        <div className="gutter py-20 md:py-24">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="t-section max-w-lg">
                Which level is right for you?
              </h2>
              <p className="prose-measure mt-6">
                If you are keeping something you already like, book a Top Artist.
                If you are changing your colour or your shape, book a Creative
                Artist. If you are correcting someone else&rsquo;s work, or you
                want the person who trains the trainers, book the Creative
                Director.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button href="/menu" variant="line">
                  Compare prices
                  <Arrow />
                </Button>
                <Button href="/founder" variant="line">
                  Meet Dechen
                </Button>
              </div>
            </div>

            {/* Kept as a note rather than invented names: the salon hasn't
                supplied them, and inventing a team is the fastest way to lose
                a client who walks in and asks for someone by name. */}
            <div className="border-t border-line pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
              <p className="micro text-muted">A note on names</p>
              <p className="prose-measure mt-4 text-sm">
                We list levels rather than individuals here. Ask for anyone by
                name when you message and we&rsquo;ll book you with them if they
                are free.
              </p>
            </div>
          </div>
        </div>
      </section>

      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "The team", path: "/team" },
        ])}
      />
    </>
  );
}
