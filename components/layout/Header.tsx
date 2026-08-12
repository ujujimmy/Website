"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { brand } from "@/content/brand";
import { nav } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

function Logo() {
  return (
    <Link
      href="/"
      className="group flex min-h-11 items-center gap-2.5 text-[1.05rem] font-semibold tracking-tight"
      aria-label={`${brand.name} home`}
    >
      <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-linear-to-br from-brand to-brand-2">
        <span className="absolute inset-px rounded-[7px] bg-ink" />
        <svg
          viewBox="0 0 24 24"
          className="relative h-4 w-4 fill-none stroke-brand-2 stroke-[2.5]"
          aria-hidden="true"
        >
          <path d="M5 19V7l7 6 7-6v12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {brand.name}
    </Link>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation.
  useEffect(() => setMenuOpen(false), [pathname]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-line/70 bg-ink/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const hasChildren = "children" in item && item.children;

              return (
                <li key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-colors",
                      active ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                    {hasChildren && (
                      <svg
                        viewBox="0 0 12 12"
                        className="h-2.5 w-2.5 fill-none stroke-current stroke-[1.8] transition-transform duration-300 group-hover:rotate-180"
                        aria-hidden="true"
                      >
                        <path d="M2.5 4.5L6 8l3.5-3.5" strokeLinecap="round" />
                      </svg>
                    )}
                  </Link>

                  {hasChildren && (
                    <div className="invisible absolute left-1/2 top-full w-80 -translate-x-1/2 pt-2 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                      <ul className="glass overflow-hidden rounded-2xl p-2">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="block rounded-xl px-4 py-3 transition-colors hover:bg-surface-2"
                            >
                              <span className="block text-sm font-medium">
                                {child.label}
                              </span>
                              <span className="mt-0.5 block text-xs leading-relaxed text-faint">
                                {child.blurb}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {/*
            The `hidden` has to live on a wrapper, not on the Button.
            `cn` is a plain string joiner rather than tailwind-merge, so
            passing "hidden" as className left Button's own `inline-flex` in
            the class list too — same specificity, both unlayered, and
            `inline-flex` won on stylesheet order. The result was this CTA
            showing on every phone next to the menu button, which is what
            pushed the header past 320px. A wrapper has no competing display
            utility, so it simply works.
          */}
          <span className="hidden sm:contents">
            <Button href={brand.primaryCta.href} size="sm">
              {brand.primaryCta.label}
            </Button>
          </span>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="grid h-11 w-11 place-items-center rounded-lg border border-line text-fg lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-current stroke-[1.8]" aria-hidden="true">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 8h16M4 16h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="border-t border-line bg-ink/95 backdrop-blur-xl lg:hidden"
      >
        <nav aria-label="Mobile" className="container-page py-6">
          <ul className="flex flex-col gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-xl px-3 py-3 text-lg font-medium text-fg"
                >
                  {item.label}
                </Link>
                {"children" in item && item.children && (
                  <ul className="ml-3 border-l border-line pl-4">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="flex min-h-11 items-center text-base text-muted"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <Button href={brand.primaryCta.href} size="lg" className="mt-6 w-full">
            {brand.primaryCta.label}
          </Button>
        </nav>
      </div>
    </header>
  );
}
