"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Standard entrance animation. Everything on the site that animates in uses
 * this so the timing feel is consistent, and it collapses to a plain div when
 * the visitor asks for reduced motion.
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
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}

/** Word-by-word headline reveal, used once per page on the main heading. */
export function RevealWords({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <span className={className}>{text}</span>;

  return (
    <span className={cn("inline", className)}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.9,
              delay: delay + i * 0.055,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
            {i < text.split(" ").length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
