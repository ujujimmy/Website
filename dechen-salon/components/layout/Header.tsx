"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/content/nav";
import { brand, whatsappLink, bookingMessage } from "@/content/brand";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Only the shadow is scroll-dependent — see the note on the ground below.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile panel on navigation, and stop the page behind it scrolling
  // while it is open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    /*
      The ground is always painted, never transparent-then-solid on scroll.
      Ink-coloured nav links floating over the hero photograph were barely
      legible, and over the plum colour section they disappeared entirely — and
      because the scroll state comes from JavaScript, a visitor with JS disabled
      got the transparent version permanently. Only the shadow is stateful now.
    */
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-petal transition-shadow duration-500 ${
        scrolled || open ? "shadow-[0_1px_0_rgb(59_27_51_/_0.06)]" : ""
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6 sm:h-20">
        <Link
          href="/"
          className="font-display text-lg tracking-[0.14em] text-ink sm:text-xl"
          aria-label={`${brand.name} — home`}
        >
          DECHEN
          <span className="ml-1.5 text-[0.6em] tracking-[0.3em] text-gold-ink">
            SALON
          </span>
        </Link>

        {/* Desktop */}
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            // No nav item is "/", so a prefix match is safe here — it lights
            // "Services" up while you are on a service detail page.
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            if (!("children" in item)) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-3.5 py-2 text-sm transition-colors ${
                    active ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-sm transition-colors ${
                    active ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                  <svg
                    viewBox="0 0 12 12"
                    className="h-3 w-3 fill-none stroke-current stroke-[1.6] transition-transform group-hover:translate-y-0.5"
                    aria-hidden="true"
                  >
                    <path d="M2.5 4.5L6 8l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>

                {/*
                  Hover/focus-driven, and rendered in the DOM at all times so
                  keyboard users tab straight into it rather than having to
                  discover a toggle.
                */}
                <div className="invisible absolute left-0 top-full w-72 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <ul className="card-soft overflow-hidden p-2">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block rounded-2xl px-3.5 py-2.5 transition-colors hover:bg-petal"
                        >
                          <span className="block text-sm font-medium text-ink">
                            {child.label}
                          </span>
                          <span className="mt-0.5 block text-xs text-muted">
                            {child.blurb}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}

          <a
            href={whatsappLink(bookingMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 rounded-full bg-plum px-5 py-2.5 text-sm font-medium text-petal transition-colors hover:bg-plum-2"
          >
            Book
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-ink stroke-[1.6]" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 8h16M4 16h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile panel */}
      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-line bg-petal px-6 pb-10 pt-4 lg:hidden"
        >
          <ul className="flex flex-col">
            {nav.map((item) => (
              <li key={item.href} className="border-b border-line/70 py-1">
                <Link
                  href={item.href}
                  className="block py-3 font-display text-xl text-ink"
                >
                  {item.label}
                </Link>
                {"children" in item ? (
                  <ul className="mb-2 flex flex-col gap-1 pl-4">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link href={child.href} className="block py-1.5 text-sm text-muted">
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>

          <a
            href={whatsappLink(bookingMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 flex w-full items-center justify-center rounded-full bg-plum px-6 py-3.5 font-medium text-petal"
          >
            Book on WhatsApp
          </a>
        </nav>
      ) : null}
    </header>
  );
}
