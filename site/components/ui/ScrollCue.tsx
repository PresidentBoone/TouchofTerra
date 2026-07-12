import { cn } from "@/lib/cn";

/** A quiet "scroll" affordance; the line pulses only when motion is allowed. */
export const ScrollCue = ({ className }: { className?: string }) => (
  <span
    aria-hidden="true"
    className={cn(
      "inline-flex flex-col items-center gap-2 text-[0.65rem] uppercase tracking-[0.25em]",
      className,
    )}
  >
    Scroll
    <span className="h-10 w-px bg-current opacity-40 motion-safe:animate-pulse" />
  </span>
);
