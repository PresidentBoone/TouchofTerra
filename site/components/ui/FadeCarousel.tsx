"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { cn } from "@/lib/cn";

export type Slide = { src: string; blurDataURL: string; alt: string };

type Props = {
  slides: Slide[];
  interval?: number;
  sizes?: string;
  className?: string;
};

/** Full-bleed images that cross-fade (with a slow zoom) on a timer. */
export const FadeCarousel = ({
  slides,
  interval = 4800,
  sizes = "100vw",
  className,
}: Props) => {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || slides.length <= 1) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      interval,
    );
    return () => window.clearInterval(id);
  }, [reduced, slides.length, interval]);

  if (reduced) {
    return (
      <div className={cn("absolute inset-0 overflow-hidden", className)}>
        <Image
          src={slides[0].src}
          alt={slides[0].alt}
          fill
          sizes={sizes}
          priority
          placeholder="blur"
          blurDataURL={slides[0].blurDataURL}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <AnimatePresence>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.4, ease: "easeInOut" },
            scale: { duration: 7, ease: "linear" },
          }}
        >
          <Image
            src={slides[index].src}
            alt={slides[index].alt}
            fill
            sizes={sizes}
            priority={index === 0}
            placeholder="blur"
            blurDataURL={slides[index].blurDataURL}
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 ? (
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Show image ${i + 1} of ${slides.length}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === index
                  ? "w-6 bg-tot-cream"
                  : "w-2 bg-tot-cream/50 hover:bg-tot-cream/80",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};
