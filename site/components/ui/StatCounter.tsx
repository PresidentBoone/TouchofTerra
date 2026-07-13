"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

type Props = {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
};

/** Counts up from 0 to `value` the first time it scrolls into view. */
export const StatCounter = ({
  value,
  prefix = "",
  suffix = "",
  duration = 1.6,
}: Props) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, value, duration]);

  const shown = reduced ? value : display;

  return (
    <span ref={ref}>
      {prefix}
      {shown.toLocaleString()}
      {suffix}
    </span>
  );
};
