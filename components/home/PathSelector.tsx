import Link from "next/link";
import { paths, type Path } from "@/content/paths";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * "Which one is you?" — four self-select cards.
 *
 * Each card deep-links into the audit form with its option pre-chosen, so the
 * visitor arrives at a form that already looks partly done. It also qualifies
 * them before they type anything, which is worth more than a single CTA that
 * has to speak to four different situations at once.
 *
 * Gold is deliberately absent: this site reserves it for review stars, so a
 * gold card here would dilute the one place it carries meaning.
 */

const accents: Record<
  Path["accent"],
  { card: string; glow: string; arrow: string }
> = {
  brand: {
    card: "from-brand/[0.16] ring-brand/25 hover:ring-brand/50",
    glow: "bg-brand/25",
    arrow: "text-brand-soft",
  },
  "brand-2": {
    card: "from-brand-2/[0.14] ring-brand-2/25 hover:ring-brand-2/50",
    glow: "bg-brand-2/20",
    arrow: "text-brand-2",
  },
  soft: {
    card: "from-brand-soft/[0.12] ring-brand-soft/20 hover:ring-brand-soft/45",
    glow: "bg-brand-soft/20",
    arrow: "text-brand-soft",
  },
  featured: {
    card: "from-brand/[0.2] to-brand-2/[0.08] ring-brand/40 hover:ring-brand/70",
    glow: "bg-brand/30",
    arrow: "text-brand-2",
  },
};

export function PathSelector() {
  return (
    <Section id="paths" className="border-t border-line">
      <div className="container-page">
        <SectionHeading
          eyebrow="Where are you now?"
          title="Pick the one that sounds like you."
          sub="Every business needs a different first move. Tell us which of these you are and the free audit focuses on that — no long form, no discovery call to sit through."
          align="center"
          className="mx-auto items-center"
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {paths.map((path, i) => {
            const accent = accents[path.accent];
            return (
              <Reveal key={path.need} delay={i * 0.07}>
                <Link
                  href={`/audit?need=${path.need}`}
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)]",
                    "bg-linear-to-br to-transparent p-8 ring-1 transition-all duration-300",
                    "hover:-translate-y-1 sm:p-9",
                    accent.card,
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-[60px] transition-opacity duration-500",
                      "opacity-50 group-hover:opacity-90",
                      accent.glow,
                    )}
                  />

                  <h3 className="relative text-2xl font-semibold leading-tight sm:text-[1.75rem]">
                    &ldquo;{path.title}&rdquo;
                  </h3>
                  <p className="relative mt-4 grow text-[0.975rem] leading-relaxed text-muted">
                    {path.body}
                  </p>

                  <span
                    className={cn(
                      "relative mt-8 inline-flex items-center gap-2 text-sm font-semibold",
                      accent.arrow,
                    )}
                  >
                    {path.cta}
                    <svg
                      viewBox="0 0 20 20"
                      className="h-4 w-4 fill-none stroke-current stroke-[2] transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 10h11M11 5.5L15.5 10 11 14.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
