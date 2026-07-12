import { type ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[transform,background-color,color,box-shadow] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tot-blue focus-visible:ring-offset-2 focus-visible:ring-offset-tot-cream disabled:pointer-events-none disabled:opacity-50 motion-safe:hover:-translate-y-0.5";

const variants: Record<Variant, string> = {
  primary: "bg-tot-blue text-white shadow-[var(--tot-shadow)] hover:bg-tot-blue-deep",
  secondary:
    "border border-tot-teal/30 text-tot-teal hover:border-tot-teal hover:bg-tot-teal/5",
  ghost: "text-tot-teal hover:bg-tot-teal/5",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

type Props = {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  ariaLabel?: string;
  target?: string;
  rel?: string;
};

export const Button = ({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  onClick,
  type = "button",
  ariaLabel,
  target,
  rel,
}: Props) => {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    const external = /^https?:\/\//.test(href);
    return (
      <Link
        href={href}
        className={classes}
        aria-label={ariaLabel}
        onClick={onClick}
        target={target ?? (external ? "_blank" : undefined)}
        rel={rel ?? (external ? "noopener noreferrer" : undefined)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} aria-label={ariaLabel} onClick={onClick}>
      {children}
    </button>
  );
};
