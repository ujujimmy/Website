import { brand } from "@/content/brand";
import { homeCopy } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Stars";
import { RevealPhrase, RevealWords } from "@/components/ui/Reveal";

/**
 * Everything here animates via CSS rather than motion, which also lets this
 * stay a server component with no client JS of its own.
 *
 * That's a performance requirement, not a preference: the hero paragraph is
 * this page's LCP element, and while its entrance was motion-driven its
 * server-rendered opacity:0 kept it invisible until hydration — measuring
 * ~1.9s LCP on a throttled mobile profile. CSS animations paint on the first
 * frame instead, and the global prefers-reduced-motion rule already
 * neutralises them.
 */

const ENTER = "animate-[fade-up_0.7s_cubic-bezier(0.16,1,0.3,1)_both]";

export function Hero() {
  const { hero } = homeCopy;

  return (
    <section
      data-beat={0}
      className="relative flex min-h-screen items-center justify-center py-32 text-center"
    >
      <div className="container-page flex flex-col items-center">
        <p
          className={`glass inline-flex ${ENTER} items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-muted`}
          style={{ animationDelay: "0.02s" }}
        >
          <Stars size={13} />
          {hero.eyebrow}
        </p>

        <h1 className="mt-8 max-w-4xl text-[clamp(2.5rem,7vw,4.75rem)] font-semibold leading-[1.04]">
          <RevealWords text="Get chosen before" delay={0.06} />{" "}
          {/* Gradient text must animate as one unit — see RevealPhrase. */}
          <RevealPhrase
            text="they ever call you."
            className="text-gradient"
            delay={0.16}
          />
        </h1>

        <p
          className={`mt-7 max-w-2xl ${ENTER} text-lg leading-relaxed text-muted sm:text-xl`}
          style={{ animationDelay: "0.3s" }}
        >
          {hero.sub}
        </p>

        <div
          className={`mt-10 flex ${ENTER} flex-col items-center gap-4 sm:flex-row`}
          style={{ animationDelay: "0.4s" }}
        >
          <Button href={brand.primaryCta.href} size="lg">
            {brand.primaryCta.label}
            <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current stroke-[2]" aria-hidden="true">
              <path d="M4 10h11M11 5.5L15.5 10 11 14.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
          <Button href={brand.secondaryCta.href} size="lg" variant="secondary">
            {brand.secondaryCta.label}
          </Button>
        </div>

        <p
          className={`mt-6 ${ENTER} text-sm text-faint`}
          style={{ animationDelay: "0.48s" }}
        >
          {hero.note}
        </p>
      </div>

      <ScrollHint />
    </section>
  );
}

function ScrollHint() {
  return (
    <div
      aria-hidden="true"
      className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-faint"
    >
      <span className="text-[0.65rem] uppercase tracking-[0.22em]">Scroll</span>
      <span className="relative h-10 w-px overflow-hidden bg-line">
        <span className="absolute inset-x-0 top-0 h-4 animate-[float_2.4s_ease-in-out_infinite] bg-linear-to-b from-brand-2 to-transparent" />
      </span>
    </div>
  );
}
