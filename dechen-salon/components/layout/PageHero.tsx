import { Blossom } from "@/components/ui/Section";

/**
 * The header every page except the homepage opens with.
 *
 * Sits below the fixed site header, so the top padding accounts for it. The h1
 * is plain text on a plain ground — it is the largest contentful paint on these
 * pages and must not wait on an image or on hydration.
 */
export function PageHero({
  eyebrow,
  title,
  sub,
  children,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="px-6 pb-6 pt-28 text-center sm:pt-36">
      <div className="mx-auto w-full max-w-3xl">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="mt-4 text-[2.2rem] leading-[1.08] sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {sub ? (
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            {sub}
          </p>
        ) : null}
        {children}
        <Blossom className="mt-10" />
      </div>
    </header>
  );
}
