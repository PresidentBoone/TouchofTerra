"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { StatCounter } from "@/components/ui/StatCounter";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

type Point = { year: string; value: number };

/** Two (or more) bars that grow to scale when scrolled into view. */
export const TrendBars = ({
  points,
  max,
}: {
  points: readonly Point[];
  max: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotion();
  const barPx = (value: number) => Math.max(12, (value / max) * 240);

  return (
    <div
      ref={ref}
      className="mx-auto flex max-w-md items-end justify-center gap-16"
    >
      {points.map((point, i) => (
        <div key={point.year} className="flex flex-1 flex-col items-center">
          <span className="mb-3 font-display text-3xl text-tot-blue">
            <StatCounter value={point.value} />
          </span>
          <motion.div
            className="w-full max-w-[90px] rounded-t-xl bg-gradient-to-t from-tot-blue-deep to-tot-blue-mist"
            initial={reduced ? false : { height: 0 }}
            animate={{ height: inView || reduced ? barPx(point.value) : 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: i * 0.15 }}
          />
          <span className="mt-3 text-sm font-medium text-tot-teal/70">
            {point.year}
          </span>
        </div>
      ))}
    </div>
  );
};
