"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const ITEMS = [
  { id: "socks", label: "Warm socks", cost: 8 },
  { id: "hygiene", label: "Hygiene kit", cost: 13 },
  { id: "firstaid", label: "First-aid basics", cost: 10 },
  { id: "water", label: "Water bottle", cost: 7 },
  { id: "snacks", label: "Snacks", cost: 12 },
  { id: "note", label: "A handwritten note", cost: 0 },
] as const;

/** Playful, interactive pack builder that tallies a suggested gift. */
export const BuildABackpack = () => {
  const [selected, setSelected] = useState<string[]>(ITEMS.map((i) => i.id));

  const toggle = (id: string) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );

  const total = ITEMS.filter((i) => selected.includes(i.id)).reduce(
    (sum, i) => sum + i.cost,
    0,
  );
  const suggested = Math.max(total, 5);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-3">
        {ITEMS.map((item) => {
          const on = selected.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggle(item.id)}
              aria-pressed={on}
              className={cn(
                "rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200 motion-safe:active:scale-95",
                on
                  ? "border-tot-blue bg-tot-blue text-white shadow-[var(--tot-shadow)]"
                  : "border-tot-stone/40 text-tot-teal hover:border-tot-blue",
              )}
            >
              {on ? "✓ " : "+ "}
              {item.label}
              {item.cost > 0 ? ` · $${item.cost}` : ""}
            </button>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
        <p className="font-display text-3xl text-tot-teal">
          Your backpack:{" "}
          <span className="text-tot-blue">${suggested}</span>
        </p>
        <Button href="/donate" size="lg">
          Fund this backpack
        </Button>
      </div>
    </div>
  );
};
