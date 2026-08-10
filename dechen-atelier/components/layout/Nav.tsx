"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { brand, whatsappLink, bookingMessage } from "@/content/brand";
import { nav } from "@/content/nav";
import { WordmarkLink } from "./Wordmark";

/**
 * A slim bar and a full-screen overlay.
 *
 * The bar carries three things and no more: the way in, the mark, and the way
 * to book. Everything else lives behind "Menu", which is the pattern a hotel or
 * a fashion house uses — it keeps the page edge quiet and lets the navigation
 * be typographically loud when it is actually wanted.
 *
 * The bar always paints its own ground. A header that only becomes visible once
 * scroll state has been read in JavaScript is invisible on first paint and
 * invisible forever if the bundle fails.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on navigation. The overlay is outside the routed tree, so nothing
  // else would.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);

    // Hold the page still behind the overlay.
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-80 border-b border-line bg-paper">
        <div className="gutter relative flex h-16 items-center justify-between md:h-20">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="micro -ml-1 flex items-center gap-3 p-1 text-ink"
          >
            <span aria-hidden="true" className="flex flex-col gap-[5px]">
              <span className="block h-px w-5 bg-ink" />
              <span className="block h-px w-5 bg-ink" />
            </span>
            Menu
          </button>

          <WordmarkLink className="absolute left-1/2 -translate-x-1/2" />

          <a
            href={whatsappLink(bookingMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="micro link-rule text-lacquer"
          >
            Book
          </a>
        </div>
      </header>

      <Overlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function Overlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Two columns: the five destinations at display size, and everything nested
  // under them listed in small type beside. A menu that needs a second
  // interaction to reveal its real destinations is a menu that hides them.
  const primary = nav.map((item) => ({ label: item.label, href: item.href }));

  const secondary = nav
    .filter(
      (item): item is Extract<typeof item, { children: readonly unknown[] }> =>
        "children" in item,
    )
    .map((item) => ({
      title: item.label,
      links: item.children.map((child) => ({
        label: child.label,
        href: child.href,
      })),
    }));

  return (
    <div
      id="site-menu"
      className="overlay on-ink"
      data-open={open}
      /* Nothing behind a closed panel should be reachable by tab or readable by
         a screen reader. `inert` is the only thing that guarantees both. */
      inert={!open}
    >
      <div className="gutter flex h-16 shrink-0 items-center justify-between md:h-20">
        <span className="micro text-brass">Menu</span>
        <button
          type="button"
          onClick={onClose}
          className="micro -mr-1 flex items-center gap-3 p-1 text-cream"
        >
          Close
          <span aria-hidden="true" className="relative block h-4 w-4">
            <span className="absolute top-1/2 left-0 block h-px w-4 rotate-45 bg-cream" />
            <span className="absolute top-1/2 left-0 block h-px w-4 -rotate-45 bg-cream" />
          </span>
        </button>
      </div>

      <nav
        aria-label="Site"
        className="gutter flex min-h-0 flex-1 flex-col justify-center overflow-y-auto py-8"
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:gap-16">
          <ul>
            {primary.map((link, i) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="overlay-link group block overflow-hidden py-1"
                  style={
                    { "--delay": `${0.07 * i + 0.15}s` } as React.CSSProperties
                  }
                >
                  <span className="display block text-[clamp(2.1rem,7vw,4.5rem)] leading-[1.1] transition-colors duration-500 group-hover:text-brass">
                    {link.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="grid gap-8 sm:grid-cols-2 lg:pb-3">
            {secondary.map((group) => (
              <div key={group.title}>
                <p className="micro mb-3 text-brass">{group.title}</p>
                <ul className="flex flex-col gap-2">
                  {group.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="link-rule text-sm text-dim transition-colors duration-500 hover:text-cream"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </nav>

      <div className="gutter shrink-0 border-t border-line-dark py-6">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <a
            href={brand.contact.phoneHref}
            className="link-rule text-sm text-cream"
          >
            {brand.contact.phone}
          </a>
          <a
            href={brand.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="micro link-rule text-brass"
          >
            Instagram
          </a>
          <p className="micro text-dim">
            {brand.address.street}, {brand.address.region}
          </p>
        </div>
      </div>
    </div>
  );
}
