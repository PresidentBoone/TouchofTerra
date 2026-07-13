"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { cn } from "@/lib/cn";

type Props = {
  src: string;
  blurDataURL: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  /** Max vertical drift in px. */
  strength?: number;
  className?: string;
};

/** A fill image that drifts vertically as it scrolls through the viewport. */
export const ParallaxImage = ({
  src,
  blurDataURL,
  alt,
  sizes = "100vw",
  priority = false,
  strength = 60,
  className,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);

  return (
    <div ref={ref} className={cn("absolute inset-0 overflow-hidden", className)}>
      <motion.div
        style={reduced ? undefined : { y }}
        className="absolute inset-[-8%]"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          placeholder="blur"
          blurDataURL={blurDataURL}
          priority={priority}
          className="object-cover"
        />
      </motion.div>
    </div>
  );
};
