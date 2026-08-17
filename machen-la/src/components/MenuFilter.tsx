"use client";

import { useEffect, useRef, useState } from "react";

type Tab = { id: string; name: string };
type Filter = "all" | "veg" | "not-hot";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "veg", label: "Vegetarian" },
  { id: "not-hot", label: "Not hot" },
];

/**
 * Category tabs and filters for /menu.
 *
 * The menu itself is passed in as `children` and stays entirely server-rendered
 * — this component never re-renders a single dish. Filtering is done by setting
 * one data attribute on the wrapper and letting CSS hide rows, which keeps the
 * whole interactive layer at a few hundred bytes and keeps every dish name in
 * the HTML a crawler receives, whatever filter is active.
 */
export function MenuFilter({
  tabs,
  children,
}: {
  tabs: Tab[];
  children: React.ReactNode;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState<string>(tabs[0]?.id ?? "");
  const stripRef = useRef<HTMLDivElement>(null);

  // Scroll-spy. Rootmargin biases towards the section occupying the upper
  // portion of the viewport, under the sticky strip.
  useEffect(() => {
    const sections = tabs
      .map((t) => document.getElementById(t.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [tabs]);

  // Keep the active tab in view on a phone, where the strip scrolls.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const el = strip.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    if (!el) return;
    const left = el.offsetLeft - strip.clientWidth / 2 + el.clientWidth / 2;
    strip.scrollTo({
      left,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [active]);

  return (
    <>
      <div className="hairline sticky top-0 z-40 border-y bg-ink">
        <div
          ref={stripRef}
          className="no-scrollbar mx-auto max-w-[76rem] overflow-x-auto px-5 sm:px-8"
        >
          <ul className="flex w-max items-center gap-6 sm:gap-8">
            {tabs.map((tab) => {
              const isActive = tab.id === active;
              return (
                <li key={tab.id}>
                  <a
                    href={`#${tab.id}`}
                    data-tab={tab.id}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative flex min-h-13 items-center whitespace-nowrap font-mono text-meta uppercase transition-colors ${
                      isActive ? "text-butter" : "text-wall-dim hover:text-wall"
                    }`}
                  >
                    {tab.name}
                    {/* Motion moment 2 of 2 in the entire site. */}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 bottom-0 h-px origin-left bg-butter transition-transform duration-300 ease-out ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-[76rem] px-5 pt-8 sm:px-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="font-mono text-meta uppercase text-wall-faint">Show</span>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`hairline flex min-h-11 items-center border px-4 font-mono text-meta uppercase transition-colors ${
                filter === f.id
                  ? "border-butter text-butter"
                  : "text-wall-dim hover:text-wall"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filter === "veg" && (
          <p className="mt-4 max-w-[54ch] text-body text-wall-dim">
            Only dishes we have confirmed as vegetarian. Several others can be
            made vegetarian — ask the server rather than trusting this list.
          </p>
        )}
        {filter === "not-hot" && (
          <p className="mt-4 max-w-[54ch] text-body text-wall-dim">
            Hides the dishes we know are hot. Anything marked ASK is unconfirmed,
            so it is still shown — say the word when you order.
          </p>
        )}
      </div>

      <div data-filter={filter}>{children}</div>
    </>
  );
}
