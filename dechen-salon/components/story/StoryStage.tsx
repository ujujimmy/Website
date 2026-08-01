"use client";

import { useEffect, useRef, useState } from "react";
import { acts } from "@/content/story";
import { scrollState, clamp } from "@/lib/scroll";
import { groundAt, darknessAt } from "@/lib/ground";
import { StrandScene } from "@/components/three/StrandScene";

/**
 * The scroll stage.
 *
 * Children are the seven act panels, each one viewport tall and server-rendered
 * — the copy is real HTML in the document, not something the canvas draws.
 * Behind them sit two fixed layers: the floor, whose colour eases from blush to
 * plum and back, and the strand.
 *
 * The whole thing is driven by one rAF loop that runs only while the stage is
 * on screen.
 */
export function StoryStage({ children }: { children: React.ReactNode }) {
  const stageRef = useRef<HTMLElement>(null);
  const floorRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [activeAct, setActiveAct] = useState(0);

  useEffect(() => {
    const stage = stageRef.current;
    const floor = floorRef.current;
    const sticky = stickyRef.current;
    if (!stage || !floor || !sticky) return;

    let raf = 0;
    let running = false;
    let lastY = window.scrollY;
    let lastAct = -1;
    let lastDarkness = -1;
    let idleFrames = 0;

    /**
     * Stage geometry, measured once instead of every frame.
     *
     * `getBoundingClientRect()` inside a rAF loop forces a synchronous layout
     * on every single frame, which on a mid-range phone is most of a frame
     * budget spent measuring something that only changes on resize. Caching it
     * took total blocking time from 3.5s to well under a second.
     */
    let stageTop = 0;
    let scrollable = 1;

    const measure = () => {
      stageTop = stage.getBoundingClientRect().top + window.scrollY;
      scrollable = Math.max(1, stage.offsetHeight - window.innerHeight);
    };

    const frame = () => {
      const y = window.scrollY;
      const progress = clamp((y - stageTop) / scrollable, 0, 1);
      const act = progress * (acts.length - 1);

      scrollState.progress = progress;
      scrollState.act = act;
      // Normalised against viewport height so the smear is the same on a phone
      // as on a 4K monitor.
      scrollState.velocity = (y - lastY) / window.innerHeight;

      // Only touch the DOM when the value actually moves. Writing the same
      // colour string sixty times a second is free to compute and not free to
      // apply.
      if (Math.abs(act - lastAct) > 0.002) {
        floor.style.backgroundColor = groundAt(act);
        lastAct = act;
      }

      const darkness = darknessAt(act);
      if (Math.abs(darkness - lastDarkness) > 0.01) {
        sticky.style.setProperty("--darkness", darkness.toFixed(3));
        stage.style.setProperty("--darkness", darkness.toFixed(3));
        lastDarkness = darkness;
      }

      const nearest = Math.round(act);
      setActiveAct((current) => (current === nearest ? current : nearest));

      // Park the loop once the page has been still for a moment. A parked page
      // has nothing to recompute, and the canvas runs its own idle animation.
      idleFrames = y === lastY ? idleFrames + 1 : 0;
      lastY = y;

      if (idleFrames > 30) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      idleFrames = 0;
      raf = requestAnimationFrame(frame);
    };

    const onResize = () => {
      measure();
      start();
    };

    measure();
    // One pass so the floor and rail are correct for a mid-page entry (a
    // refresh, or a link straight to an act anchor).
    start();

    window.addEventListener("scroll", start, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", start);
      window.removeEventListener("resize", onResize);
      running = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={stageRef} className="story-stage relative">
      {/*
        Pinned for the length of the stage. The negative margin means it takes
        up no layout height of its own, so the act panels below stack directly
        against the top of the stage.
      */}
      <div
        ref={stickyRef}
        className="sticky top-0 -mb-[100svh] h-[100svh] overflow-hidden"
      >
        <div ref={floorRef} className="absolute inset-0 bg-blush" />
        <StrandScene />
      </div>

      <div className="relative">{children}</div>

      <StoryRail active={activeAct} />
    </section>
  );
}

/**
 * The chapter markers down the side. Real links to each act's anchor, so this
 * is navigation rather than decoration, and it works without JavaScript.
 */
function StoryRail({ active }: { active: number }) {
  return (
    <nav
      aria-label="Story chapters"
      className="pointer-events-none sticky bottom-0 -mt-[100svh] hidden h-[100svh] lg:block"
    >
      <ul className="pointer-events-auto absolute right-6 top-1/2 flex -translate-y-1/2 flex-col gap-3">
        {acts.map((act) => {
          const current = act.id === active;
          return (
            <li key={act.key}>
              <a
                href={`#act-${act.key}`}
                className="group flex items-center justify-end gap-2.5"
                aria-current={current ? "true" : undefined}
              >
                <span
                  className="text-[0.7rem] font-medium tracking-wide opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                  style={{ color: "var(--act-fg)" }}
                >
                  {act.label}
                </span>
                <span
                  aria-hidden="true"
                  className="block h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: current ? "1.5rem" : "0.375rem",
                    background: "var(--act-fg)",
                    opacity: current ? 0.9 : 0.35,
                  }}
                />
                <span className="sr-only">{act.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
