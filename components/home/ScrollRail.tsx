"use client";

import { useEffect, useState } from "react";
import { beats } from "@/content/site";
import { useActiveBeat } from "@/lib/scroll";
import { cn } from "@/lib/utils";

/**
 * Progress rail for the scroll narrative. Subscribes to beat changes only, so
 * it re-renders about seven times per full scroll rather than every frame.
 *
 * Decorative and desktop-only — the sections themselves are the real
 * navigation, and this would crowd a phone screen.
 */
export function ScrollRail() {
  const active = useActiveBeat();
  const [visible, setVisible] = useState(false);

  // Hide once the narrative is behind us and the supporting content starts.
  useEffect(() => {
    const onScroll = () => {
      const narrativeEnd = window.innerHeight * beats.length;
      setVisible(window.scrollY > window.innerHeight * 0.6 && window.scrollY < narrativeEnd);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "fixed right-8 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3.5 transition-opacity duration-500 2xl:flex",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      {beats.map((beat) => {
        const isActive = beat.id === active;
        return (
          <div key={beat.key} className="flex items-center gap-3">
            <span
              className={cn(
                "text-[0.7rem] tracking-wide transition-all duration-300",
                isActive
                  ? "translate-x-0 text-fg opacity-100"
                  : "translate-x-2 text-faint opacity-0",
              )}
            >
              {beat.label}
            </span>
            <span
              className={cn(
                "h-px transition-all duration-300",
                isActive
                  ? "w-7 bg-linear-to-r from-brand to-brand-2"
                  : "w-3.5 bg-line",
              )}
            />
          </div>
        );
      })}
    </div>
  );
}
