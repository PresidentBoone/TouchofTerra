import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  as?: "h1" | "h2";
  children: ReactNode;
  className?: string;
};

/** Fraunces display heading with fluid sizing. */
export const DisplayHeading = ({ as = "h2", children, className }: Props) => {
  const Tag = as;
  return (
    <Tag
      className={cn(
        "font-display font-normal leading-[1.05] tracking-[-0.01em] text-balance",
        as === "h1"
          ? "text-[clamp(2.75rem,6vw,5rem)]"
          : "text-[clamp(2rem,4vw,3.25rem)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
};
