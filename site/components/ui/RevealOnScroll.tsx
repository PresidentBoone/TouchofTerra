"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Adds a subtle lift on hover (for cards). */
  hoverLift?: boolean;
};

/** Fades content up as it enters the viewport. Static under reduced motion. */
export const RevealOnScroll = ({
  children,
  className,
  delay = 0,
  hoverLift = false,
}: Props) => {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      whileHover={hoverLift ? { y: -6 } : undefined}
    >
      {children}
    </motion.div>
  );
};
