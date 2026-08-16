import Link from "next/link";
import { Eyebrow } from "@/components/ui/Section";

/**
 * Shared hero for every non-homepage route. Keeps the inner pages visually
 * part of the same site as the scroll narrative without re-running the whole
 * 3D story on each one.
 */
export function PageHero({
  eyebrow,
  title,
  sub,
  breadcrumb,
  children,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  breadcrumb?: { name: string; href: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative pb-16 pt-36 sm:pb-20 sm:pt-44">
      <div className="container-page">
        {breadcrumb && (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-faint">
              {breadcrumb.map((crumb, i) => (
                <li key={crumb.href} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {i === breadcrumb.length - 1 ? (
                    <span aria-current="page">{crumb.name}</span>
                  ) : (
                    <Link
                      href={crumb.href}
                      // Breadcrumbs are standalone navigation, not inline prose, so
                      // they need a real tap target. The text stays the same
                      // size; the hit area grows around it.
                      className="inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-fg"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="mt-5 max-w-3xl text-[clamp(2.25rem,5.5vw,3.75rem)] font-semibold leading-[1.06]">
          {title}
        </h1>
        {sub && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {sub}
          </p>
        )}
        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  );
}
