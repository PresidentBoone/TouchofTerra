"use client";

import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { cn } from "@/lib/cn";

const ITEMS = [
  { id: "socks", label: "Warm socks", cost: 8 },
  { id: "hygiene", label: "Hygiene kit", cost: 13 },
  { id: "firstaid", label: "First-aid basics", cost: 10 },
  { id: "water", label: "Water bottle", cost: 7 },
  { id: "snacks", label: "Snacks", cost: 12 },
  { id: "note", label: "A handwritten note", cost: 0 },
] as const;

const FULL = ITEMS.reduce((sum, i) => sum + i.cost, 0); // $50

/** Playful, interactive pack builder that tallies a suggested gift. */
export const BuildABackpack = () => {
  const [selected, setSelected] = useState<string[]>(ITEMS.map((i) => i.id));
  const reduced = useReducedMotion();

  const toggle = (id: string) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );

  const total = ITEMS.filter((i) => selected.includes(i.id)).reduce(
    (sum, i) => sum + i.cost,
    0,
  );
  const suggested = Math.max(total, 5);

  const count = useMotionValue(suggested);
  const display = useTransform(count, (v) => `$${Math.round(v)}`);

  useEffect(() => {
    if (reduced) {
      count.set(suggested);
      return;
    }
    const controls = animate(count, suggested, {
      duration: 0.5,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [suggested, count, reduced]);

  const fillPct = Math.min(100, (total / FULL) * 100);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
        {ITEMS.map((item) => {
          const on = selected.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggle(item.id)}
              aria-pressed={on}
              className={cn(
                "rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 motion-safe:active:scale-95",
                on
                  ? "border-tot-blue bg-tot-blue text-white shadow-[var(--tot-shadow)]"
                  : "border-tot-stone/40 text-tot-teal hover:border-tot-blue hover:bg-tot-blue/5",
              )}
            >
              {on ? "✓ " : "+ "}
              {item.label}
              {item.cost > 0 ? ` · $${item.cost}` : ""}
            </button>
          );
        })}
      </div>

      {/* Backpack "fills" as you add items */}
      <div className="mt-8">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-tot-sky">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-tot-blue-deep to-tot-blue"
            initial={false}
            animate={{ width: `${fillPct}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <p className="mt-2 text-center text-xs text-tot-teal/50">
          A complete Touch of Terra Blue backpack is ${FULL}.
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
        <p className="font-display text-3xl text-tot-teal">
          Your backpack:{" "}
          <motion.span className="text-tot-blue">{display}</motion.span>
        </p>
        <Button href="/donate" size="lg" className="w-full sm:w-auto">
          Fund this backpack
        </Button>
      </div>
    </div>
  );
};
