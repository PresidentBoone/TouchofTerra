"use client";

import { type ReactNode, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { cn } from "@/lib/cn";

/**
 * Wraps a word or phrase with a hand-drawn Terra-Blue underline that draws
 * itself as it scrolls into view. A signature storytelling accent, used
 * sparingly on pivotal words.
 */
export const AnimatedUnderline = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const reduced = useReducedMotion();
  const drawn = reduced || inView;

  return (
    <span ref={ref} className={cn("relative inline-block", className)}>
      {children}
      <svg
        aria-hidden="true"
        className="absolute -bottom-1 left-0 h-[0.35em] w-full text-tot-blue"
        viewBox="0 0 100 8"
        preserveAspectRatio="none"
        fill="none"
      >
        <motion.path
          d="M1 5 C 20 2, 40 7, 60 4 S 90 2, 99 5"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: drawn ? 1 : 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
    </span>
  );
};
