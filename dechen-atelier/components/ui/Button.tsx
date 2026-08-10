import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Two buttons exist on this site: a filled block and an outlined one. Both are
 * rectangles with letterspaced capitals. There is no third, and there are no
 * rounded corners — the moment a pill appears, the register drops.
 */
export function Button({
  href,
  children,
  variant = "solid",
  external = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "line";
  external?: boolean;
  className?: string;
}) {
  const cls = `btn btn-${variant} ${className}`;

  if (external || href.startsWith("http") || href.startsWith("tel:")) {
    return (
      <a
        className={cls}
        href={href}
        target={href.startsWith("tel:") ? undefined : "_blank"}
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link className={cls} href={href}>
      {children}
    </Link>
  );
}

/** The arrow that trails a button label and slides on hover. */
export function Arrow() {
  return (
    <svg
      width="20"
      height="8"
      viewBox="0 0 20 8"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M0 4h18M14.5 1 18 4l-3.5 3"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}
