"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ORG } from "@/lib/site";

const KEY = "tot-loaded";

/**
 * First-load-only branded intro: a Terra-Blue backpack draws on, the wordmark
 * reveals, then it fades. Skipped on repeat visits and under reduced motion.
 */
export const LoadScreen = () => {
  const [show, setShow] = useState(false);

  const dismiss = useCallback(() => {
    setShow(false);
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem(KEY);
    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (seen || reduced) return;

    const reveal = () => setShow(true);
    reveal();
    const timer = setTimeout(dismiss, 1600);
    return () => clearTimeout(timer);
  }, [dismiss]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loadscreen"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-tot-ink text-tot-cream"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          role="status"
        >
          <span className="sr-only">Loading Touch of Terra</span>
          <svg
            width="88"
            height="104"
            viewBox="0 0 100 120"
            fill="none"
            aria-hidden="true"
          >
            {[
              "M40,30 Q50,15 60,30",
              "M28,34 h44 a10,10 0 0 1 10,10 v52 a10,10 0 0 1 -10,10 h-44 a10,10 0 0 1 -10,-10 v-52 a10,10 0 0 1 10,-10 z",
              "M34,74 h32 v22 h-32 z",
              "M50,44 v22 M50,50 l-7,7 M50,50 l7,7",
            ].map((d, i) => (
              <motion.path
                key={d}
                d={d}
                stroke="var(--tot-blue)"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.15 * i, ease: "easeInOut" }}
              />
            ))}
          </svg>
          <motion.p
            className="font-display text-2xl tracking-tight"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            {ORG.name}
          </motion.p>
          <button
            type="button"
            onClick={dismiss}
            className="absolute bottom-6 right-6 text-xs uppercase tracking-[0.2em] text-tot-cream/60 transition-colors hover:text-tot-cream"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
