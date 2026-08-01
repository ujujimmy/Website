"use client";

import { motion, useReducedMotion } from "motion/react";
import { brand } from "@/content/brand";
import { homeCopy } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Stars";
import { RevealPhrase, RevealWords } from "@/components/ui/Reveal";

export function Hero() {
  const reduced = useReducedMotion();
  const { hero } = homeCopy;

  return (
    <section
      data-beat={0}
      className="relative flex min-h-screen items-center justify-center py-32 text-center"
    >
      <div className="container-page flex flex-col items-center">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="reveal glass inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-muted"
        >
          <Stars size={13} />
          {hero.eyebrow}
        </motion.p>

        <h1 className="mt-8 max-w-4xl text-[clamp(2.5rem,7vw,4.75rem)] font-semibold leading-[1.04]">
          <RevealWords text="Get chosen before" delay={0.15} />{" "}
          {/* Gradient text must animate as one unit — see RevealPhrase. */}
          <RevealPhrase
            text="they ever call you."
            className="text-gradient"
            delay={0.38}
          />
        </h1>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="reveal mt-7 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl"
        >
          {hero.sub}
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="reveal mt-10 flex flex-col items-center gap-4 sm:flex-row"
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
        </motion.div>

        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="reveal mt-6 text-sm text-faint"
        >
          {hero.note}
        </motion.p>
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
