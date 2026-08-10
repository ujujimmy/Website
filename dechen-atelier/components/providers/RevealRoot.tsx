"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * The one piece of JavaScript behind every scroll reveal on the site.
 *
 * Mounted once in the root layout. It finds every `[data-reveal]` element and
 * watches them with a single IntersectionObserver, so adding a reveal to a page
 * costs nothing but an attribute — see components/ui/Reveal.tsx.
 *
 * Reveals are one-way: once shown, an element is unobserved. Re-hiding on
 * scroll-up is distracting and costs a paint for nothing.
 */
export function RevealRoot() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-shown", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    // Re-scan per navigation: the App Router swaps the page tree without
    // remounting the layout, so a new page's elements need picking up.
    for (const node of document.querySelectorAll("[data-reveal]:not([data-shown])")) {
      observer.observe(node);
    }

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
