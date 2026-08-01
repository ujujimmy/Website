import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-brand-soft",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="h-px w-6 bg-linear-to-r from-brand to-brand-2"
      />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "left",
  as: Tag = "h2",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  sub?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Tag
        className={cn(
          "font-semibold leading-[1.08]",
          Tag === "h1"
            ? "text-4xl sm:text-5xl lg:text-6xl"
            : "text-3xl sm:text-4xl lg:text-5xl",
        )}
      >
        {title}
      </Tag>
      {sub && (
        <p
          className={cn(
            "text-lg leading-relaxed text-muted",
            align === "center" ? "max-w-2xl" : "max-w-xl",
          )}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

/** Standard vertical rhythm for every non-hero section. */
export function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("relative py-24 sm:py-32", className)}>
      {children}
    </section>
  );
}
