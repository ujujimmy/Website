import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "transition-all duration-300 ease-[var(--ease-out-expo)] whitespace-nowrap " +
  "disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-linear-to-r from-brand to-brand-2 text-ink font-semibold " +
    "shadow-[0_0_0_0_rgba(109,92,246,0.5)] hover:shadow-[0_8px_36px_-6px_rgba(109,92,246,0.65)] " +
    "hover:brightness-110 hover:-translate-y-0.5",
  secondary:
    "glass text-fg hover:border-brand-soft/50 hover:-translate-y-0.5 " +
    "hover:bg-surface-2/80",
  ghost: "text-muted hover:text-fg",
};

const sizes: Record<Size, string> = {
  // 44px on mobile regardless of size — below that a button is a coin toss
  // for a thumb. `sm` shrinks back to 36px only once there's a pointer.
  sm: "h-11 px-4 text-sm sm:h-9",
  md: "h-11 px-6 text-[0.95rem]",
  lg: "h-12 px-6 text-base sm:h-14 sm:px-8",
};

type Props = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: Props & { href: string } & Omit<
    React.ComponentProps<typeof Link>,
    "href" | "className" | "children"
  >) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </Link>
  );
}

export function ButtonEl({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: Props & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </button>
  );
}
