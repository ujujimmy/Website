"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { images, lookbook } from "@/content/images";

/**
 * The lookbook strip.
 *
 * A horizontal rail of work that drifts sideways as the page scrolls past it,
 * like flipping through a portfolio on the counter. The transform is written
 * directly to the element from a rAF loop rather than through React state —
 * this runs while scrolling and must not re-render the tree.
 *
 * It is also a real horizontally-scrollable region, so it works by touch, by
 * keyboard, and with JavaScript switched off.
 */
export function Lookbook() {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const rail = railRef.current;
    if (!section || !rail) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let running = false;
    let visible = false;
    let idleFrames = 0;
    let lastY = window.scrollY;

    // Measured on resize rather than per frame — reading layout inside a rAF
    // loop forces a synchronous reflow on every frame. See StoryStage for the
    // same fix and what it was costing.
    let sectionTop = 0;
    let sectionHeight = 0;
    let travel = 0;

    const measure = () => {
      sectionTop = section.getBoundingClientRect().top + window.scrollY;
      sectionHeight = section.offsetHeight;
      const slack = Math.max(0, rail.scrollWidth - rail.clientWidth);
      travel = Math.min(slack, window.innerWidth * 0.45);
    };

    const frame = () => {
      const y = window.scrollY;
      // -1 when the section sits below the viewport, +1 when above it.
      const centre =
        (sectionTop + sectionHeight / 2 - y - window.innerHeight / 2) /
        window.innerHeight;

      rail.style.transform = `translate3d(${(-centre * travel).toFixed(1)}px, 0, 0)`;

      idleFrames = y === lastY ? idleFrames + 1 : 0;
      lastY = y;

      if (!visible || idleFrames > 20) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || !visible) return;
      running = true;
      idleFrames = 0;
      raf = requestAnimationFrame(frame);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          measure();
          start();
        }
      },
      { rootMargin: "15% 0px" },
    );
    observer.observe(section);

    const onResize = () => {
      measure();
      start();
    };

    window.addEventListener("scroll", start, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", start);
      window.removeEventListener("resize", onResize);
      running = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="lookbook-heading"
      className="overflow-hidden py-20 sm:py-28"
    >
      <div className="mx-auto mb-10 w-full max-w-6xl px-6">
        <p className="eyebrow">The lookbook</p>
        <h2 id="lookbook-heading" className="mt-4 text-3xl sm:text-4xl">
          Colour, cut and length — our work.
        </h2>
      </div>

      {/*
        The overflow container stays scrollable; the transform is decoration.
        It needs to be focusable and labelled: a scrollable region that can only
        be reached with a mouse is unusable by keyboard.
      */}
      <div
        tabIndex={0}
        role="region"
        aria-label="Lookbook, scroll horizontally"
        className="overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <ul
          ref={railRef}
          className="flex w-max gap-4 px-6 will-change-transform"
        >
          {lookbook.map((key, i) => {
            const image = images[key];
            return (
              <li
                key={key}
                className="w-[52vw] shrink-0 sm:w-[30vw] lg:w-[19vw]"
                // A gentle alternating rise, so the rail isn't a flat line.
                style={{ transform: `translateY(${i % 2 ? "1.5rem" : "0"})` }}
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-petal">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 52vw, (max-width: 1024px) 30vw, 19vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mx-auto mt-10 w-full max-w-6xl px-6">
        <a
          href="/gallery"
          className="inline-flex items-center gap-2 border-b border-gold-ink/40 pb-1 text-sm font-medium text-gold-ink transition-colors hover:border-gold-ink"
        >
          See the full gallery
          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current stroke-[1.8]" aria-hidden="true">
            <path d="M4 10h11M11 5.5L15.5 10 11 14.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}
