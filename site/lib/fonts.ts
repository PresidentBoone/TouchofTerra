import { Fraunces, Inter } from "next/font/google";

/** Warm, optical display serif — headlines and emotional statements. */
export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

/** Clean humanist sans — body copy and UI. */
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
