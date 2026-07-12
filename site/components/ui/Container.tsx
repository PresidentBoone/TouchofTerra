import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

export const Container = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn("mx-auto w-full max-w-[1280px] px-6 md:px-8", className)}>
    {children}
  </div>
);
