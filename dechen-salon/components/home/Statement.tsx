import Link from "next/link";
import { philosophy, whyChoose } from "@/content/philosophy";
import { Reveal } from "@/components/ui/Reveal";
import { Blossom } from "@/components/ui/Section";

/**
 * The salon's own words, given room to breathe.
 *
 * Sits directly under the hero because it is the thing that separates this
 * salon from the one down the street — and because a visitor who reads one
 * paragraph should read this one.
 */
export function Statement() {
  return (
    <section className="px-6 py-20 text-center sm:py-28">
      <div className="mx-auto w-full max-w-3xl">
        <Reveal>
          <p className="eyebrow">Our philosophy</p>
        </Reveal>

        <Reveal delay={0.06}>
          <h2 className="mt-5 text-3xl leading-[1.15] sm:text-4xl">
            {philosophy.headline}
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
            {philosophy.body}
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <ul className="mt-10 flex flex-wrap justify-center gap-x-7 gap-y-3">
            {whyChoose.slice(0, 3).map((point) => (
              <li key={point} className="flex items-center gap-2 text-sm text-muted">
                <svg
                  viewBox="0 0 20 20"
                  className="h-4 w-4 shrink-0 fill-none stroke-gold stroke-[2]"
                  aria-hidden="true"
                >
                  <path d="M4.5 10.5l3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {point}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.24}>
          <Link
            href="/about"
            className="mt-9 link-underline inline-flex items-center gap-2 pb-1 text-sm font-medium text-gold-ink"
          >
            All eight things we stand for
          </Link>
        </Reveal>

        <Blossom className="mt-14" />
      </div>
    </section>
  );
}
