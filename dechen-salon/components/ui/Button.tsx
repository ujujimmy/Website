import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 disabled:opacity-60";

const variants: Record<Variant, string> = {
  // Plum on blush is the highest-contrast pairing the palette has, which is
  // what the one action we most want people to take deserves.
  primary:
    "bg-plum text-petal hover:bg-plum-2 shadow-[0_10px_30px_-12px_rgb(59_27_51_/_0.5)]",
  secondary:
    "bg-card text-ink hover:bg-cream shadow-[0_6px_20px_-10px_rgb(59_27_51_/_0.3)]",
  // Inherits its colour from whatever it sits on — ink on blush, petal on the
  // plum panels. Pinning a colour here made it invisible on half the site.
  ghost: "border border-current/30 hover:border-current/60",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

type Props = {
  children: React.ReactNode;
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** External links get the right rel and open in a new tab. */
  external?: boolean;
  "aria-label"?: string;
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  external,
  ...rest
}: Props) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (external || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={classes}
        {...(href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}

/** The arrow used on most calls to action. */
export function Arrow() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4 fill-none stroke-current stroke-[1.8]"
      aria-hidden="true"
    >
      <path d="M4 10h11M11 5.5L15.5 10 11 14.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
