import type { ReactNode } from "react";


/**
 * The opening of every page but the homepage: label, title, one paragraph, and
 * a hairline underneath. Identical on all ten routes, which is what makes them
 * read as chapters of one publication rather than ten separate pages.
 *
 * The title animates on a timer rather than on scroll, because it is always
 * above the fold — the observer would fire it before it could ever be seen not
 * to have fired.
 */
export function PageHead({
  eyebrow,
  title,
  lead,
  aside,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  /** Optional right-hand column: a picture, a set of links, a figure. */
  aside?: ReactNode;
}) {
  return (
    <header className="gutter pt-14 pb-12 md:pt-20 md:pb-16">
      <p className="micro anim-fade text-lacquer">{eyebrow}</p>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
        <div>
          <h1 className="t-page anim-line">
            <span>
              <span style={{ animationDelay: "0.08s" }}>{title}</span>
            </span>
          </h1>
          {lead ? (
            <p className="lead anim-fade mt-8" style={{ animationDelay: "0.3s" }}>
              {lead}
            </p>
          ) : null}
        </div>

        {aside ? <div className="lg:pb-2">{aside}</div> : null}
      </div>

      <div className="rule mt-12 md:mt-16" />
    </header>
  );
}
