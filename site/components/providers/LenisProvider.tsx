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

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
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
