import { home } from "@/content/copy";
import { founder } from "@/content/founder";
import { images } from "@/content/images";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { Frame } from "@/components/ui/Frame";
import { Button, Arrow } from "@/components/ui/Button";

/**
 * The one dark section on the homepage, and the only place the founder's own
 * words appear at full size.
 *
 * The portrait is a real photograph of her in the salon — the single most
 * valuable image the catalog contained, and the reason this section is worth a
 * change of ground colour.
 */
export function FounderPanel() {
  return (
    <section className="on-ink">
      <div className="gutter py-20 md:py-28 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-20">
          <Reveal variant="wipe">
            <Frame
              img={images.founder}
              ratio="figure"
              sizes="(max-width: 64rem) 100vw, 22rem"
            />
          </Reveal>

          <div className="lg:pt-2">
            <Reveal>
              <p className="micro text-brass">
                05 &nbsp; {home.founder.eyebrow}
              </p>
            </Reveal>

            <h2 className="t-section mt-5 text-cream">
              <RevealLines lines={[home.founder.title]} />
            </h2>

            <Reveal delay={0.08}>
              <blockquote className="t-quote mt-8 max-w-2xl text-cream">
                &ldquo;{founder.quote}&rdquo;
              </blockquote>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="prose-measure mt-8">{home.founder.body}</p>
            </Reveal>

            <Reveal delay={0.16}>
              <ul className="mt-10 grid gap-x-10 gap-y-5 sm:grid-cols-2">
                {founder.credentials.map((credential) => (
                  <li
                    key={credential.label}
                    className="border-t border-line-dark pt-4"
                  >
                    <p className="text-sm text-cream">{credential.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-dim">
                      {credential.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.2} className="mt-10">
              <Button href="/founder" variant="line">
                Her story
                <Arrow />
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
