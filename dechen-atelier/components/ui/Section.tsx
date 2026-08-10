import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/**
 * The site's structural idea, in one component.
 *
 * A section is a numbered chapter: a narrow index column on the left carrying
 * the number and the label, everything else on the right. On a phone the index
 * simply sits above the content. Nothing on this site is centred, and nothing
 * sits in a box — the hierarchy comes from the grid.
 */
export function Chapter({
  n,
  label,
  children,
  className = "",
  tone = "paper",
  id,
}: {
  /** Two digits, in order down the page. */
  n: string;
  label: string;
  children: ReactNode;
  className?: string;
  tone?: "paper" | "ink" | "paper-2";
  id?: string;
}) {
  const ground =
    tone === "ink" ? "on-ink" : tone === "paper-2" ? "bg-paper-2" : "";

  return (
    <section id={id} className={`${ground} ${className}`}>
      <div className="gutter py-18 md:py-24 lg:py-28">
        <div className="index-grid">
          <Reveal
            as="div"
            className="micro flex items-baseline gap-3 pb-6 text-muted lg:sticky lg:top-28 lg:h-fit lg:flex-col lg:gap-2 lg:pb-0"
          >
            <span className={tone === "ink" ? "text-brass" : "text-lacquer"}>
              {n}
            </span>
            <span>{label}</span>
          </Reveal>

          <div>{children}</div>
        </div>
      </div>
    </section>
  );
}

/**
 * A full-bleed hairline. Used between sections instead of a change of
 * background colour, which is the cheap way to do the same job.
 */
export function Rule({ className = "" }: { className?: string }) {
  return (
    <div className={`gutter ${className}`}>
      <Reveal as="div" variant="draw" className="rule" />
    </div>
  );
}
