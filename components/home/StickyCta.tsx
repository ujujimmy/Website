"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { brand } from "@/content/brand";

/**
 * Mobile-only sticky CTA bar.
 *
 * On a phone the primary action scrolls out of reach a screen in and doesn't
 * come back until the closing band, which is a long way to hold someone's
 * intent. This keeps it one thumb-tap away for the whole middle of the page.
 *
 * It deliberately disappears again at the bottom. Two rules:
 *
 * 1. Not over the hero — the hero's own buttons are right there, and a
 *    floating bar on the opening screen reads as an ad.
 * 2. Not over the closing CTA or the footer — covering the real CTA with a
 *    shortcut to the same page is worse than showing nothing, and the footer
 *    holds the contact links.
 *
 * Both are driven by IntersectionObserver on elements that already exist, so
 * there's no scroll handler and nothing to measure on resize.
 */
export function StickyCta() {
  const [pastHero, setPastHero] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("[data-beat='0']");
    const stop = document.querySelector("[data-sticky-stop]");

    const observers: IntersectionObserver[] = [];

    if (hero) {
      const io = new IntersectionObserver(
        ([entry]) => setPastHero(!entry.isIntersecting),
        // Fire once the hero is genuinely behind us, not on its last pixel.
        { rootMargin: "-40% 0px 0px 0px" },
      );
      io.observe(hero);
      observers.push(io);
    }

    if (stop) {
      const io = new IntersectionObserver(
        ([entry]) => setAtEnd(entry.isIntersecting),
        // Start hiding before the closing CTA reaches the bar's own height.
        { rootMargin: "0px 0px -10% 0px" },
      );
      io.observe(stop);
      observers.push(io);
    }

    return () => observers.forEach((io) => io.disconnect());
  }, []);

  const visible = pastHero && !atEnd;

  return (
    <div
      aria-hidden={!visible}
      className={[
        "fixed inset-x-0 bottom-0 z-40 md:hidden",
        // pb keeps the bar clear of the iOS home indicator.
        "border-t border-line bg-ink-2/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3",
        "backdrop-blur-md transition-transform duration-300 ease-[var(--ease-out-expo)]",
        visible ? "translate-y-0" : "translate-y-full",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <p className="min-w-0 grow text-xs leading-snug text-muted">
          Free written audit.
          <br />
          <span className="text-faint">No call required.</span>
        </p>
        <Link
          href={brand.primaryCta.href}
          tabIndex={visible ? undefined : -1}
          className="inline-flex h-11 shrink-0 items-center rounded-full bg-linear-to-r from-brand to-brand-2 px-5 text-sm font-semibold text-ink"
        >
          {brand.primaryCta.label}
        </Link>
      </div>
    </div>
  );
}
