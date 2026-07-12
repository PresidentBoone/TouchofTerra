import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

export const Eyebrow = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <p
    className={cn(
      "text-xs font-semibold uppercase tracking-[0.2em] text-tot-blue",
      className,
    )}
  >
    {children}
  </p>
);
