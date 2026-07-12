import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** Register GSAP plugins once, in the browser only. */
export const registerGsap = (): typeof gsap => {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: "power3.out", duration: 0.7 });
    registered = true;
  }
  return gsap;
};

export { gsap, ScrollTrigger };
