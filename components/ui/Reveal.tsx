"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Standard entrance animation. Everything on the site that animates in uses
 * this so the timing feel is consistent, and it collapses to a plain element
 * when the visitor asks for reduced motion.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "span";
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      // The `reveal` class lets the <noscript> rule in globals.css force these
      // visible when JS never runs — motion's server-rendered inline opacity:0
      // would otherwise leave most of the page blank.
      className={cn("reveal", className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Word-by-word reveal for a page's main heading.
 *
 * Deliberately CSS-only rather than motion-driven. This is the LCP element on
 * most pages, and the JS version shipped server HTML with every word
 * translated out of view — leaving the headline invisible until hydration,
 * delaying LCP, and blanking the page entirely if JS fails. A CSS animation
 * paints on the first frame, needs no hydration, and is already neutralised by
 * the global prefers-reduced-motion rule in globals.css.
 */
export function RevealWords({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");

  return (
    <span className={cn("inline", className)}>
      {words.map((word, i) => (
        <span
          key={i}
          // Clip vertically only, so descenders are masked but the gradient
          // text isn't clipped at the sides.
          className="inline-block overflow-hidden align-bottom [clip-path:inset(-0.3em_-0.3em_0_-0.3em)]"
        >
          <span
            className="inline-block animate-[word-up_0.9s_cubic-bezier(0.16,1,0.3,1)_both]"
            style={{ animationDelay: `${delay + i * 0.055}s` }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </span>
  );
}
