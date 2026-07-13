import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "cream" | "white" | "teal" | "ink";

const toneClass: Record<Tone, string> = {
  cream: "bg-tot-cream text-tot-teal",
  white: "bg-tot-white text-tot-teal",
  teal: "bg-tot-teal text-tot-cream",
  ink: "bg-tot-ink text-tot-cream",
};

/** A documentary "chapter" wrapper. Alternate tones for pacing. */
export const Section = ({
  tone = "cream",
  className,
  id,
  children,
}: {
  tone?: Tone;
  className?: string;
  id?: string;
  children: ReactNode;
}) => (
  <section id={id} className={cn("py-24 md:py-32", toneClass[tone], className)}>
    {children}
  </section>
);
