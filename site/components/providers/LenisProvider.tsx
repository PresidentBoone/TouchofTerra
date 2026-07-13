"use client";

import { type ReactNode, useEffect } from "react";
import Lenis from "lenis";
import { registerGsap, ScrollTrigger } from "@/lib/motion/registerGsap";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

/**
 * Premium smooth scrolling wired to GSAP ScrollTrigger.
 * Under prefers-reduced-motion we leave native scrolling untouched.
 */
export const LenisProvider = ({ children }: { children: ReactNode }) => {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    registerGsap();

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });
    lenis.on("scroll", ScrollTrigger.update);

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [reduced]);

  return <>{children}</>;
};
