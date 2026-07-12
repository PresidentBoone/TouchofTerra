# Phase 0 — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline, chosen) or superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> **Calibration note:** This plan is written for **inline self-execution** in the same session. Critical/subtle/testable units include complete code; routine components include exact contracts (props, behavior, files) and representative code. No vague placeholders — every task states exactly what to build, where, and how to verify.

**Goal:** Stand up the new Next.js foundation for Touch of Terra — a themed, animated, accessible shell with the locked "Touch of Terra Blue" design system, motion infrastructure, core primitives, scroll-aware nav + load screen, a media pipeline, and a proving home skeleton.

**Architecture:** A fresh Next.js (App Router, TypeScript strict) app in `site/`, styled with Tailwind + CSS-variable design tokens locked from the logo. Lenis for smooth scroll wired to GSAP ScrollTrigger; Framer Motion for microinteractions; all motion gated behind `prefers-reduced-motion`. The legacy root HTML + `dashboard/` stay untouched as reference until the new site replaces them.

**Tech Stack:** Next.js, TypeScript, Tailwind, Framer Motion, GSAP + ScrollTrigger, Lenis, sharp (image pipeline + palette extraction), Vitest + Testing Library (tests), sips/ffmpeg (media conversion).

**Governed by:** `docs/superpowers/specs/2026-07-12-touch-of-terra-overhaul-design.md` (the Design Bible). When this plan and the Bible disagree, the Bible wins; update this plan.

---

## File structure (created in Phase 0)

```
site/
  app/
    layout.tsx                # fonts + providers + header/footer + skip link
    page.tsx                  # home skeleton (hero + chapter stubs)
    globals.css               # Tailwind + design tokens (CSS vars) + base
  components/
    providers/LenisProvider.tsx
    layout/SiteHeader.tsx     # scroll-aware nav
    layout/SiteFooter.tsx
    layout/LoadScreen.tsx     # first-load branded intro
    ui/Container.tsx
    ui/Section.tsx            # light/dark chapter wrapper
    ui/Button.tsx
    ui/Eyebrow.tsx
    ui/DisplayHeading.tsx
    ui/RevealOnScroll.tsx
    ui/ScrollCue.tsx
  lib/
    cn.ts                     # class merge util
    fonts.ts                  # next/font (Fraunces + Inter)
    motion/registerGsap.ts    # GSAP + ScrollTrigger + Lenis bridge
    motion/useReducedMotion.ts
    site.ts                   # nav items, org constants
  content/
    home.ts                   # placeholder home copy
  scripts/
    extract-logo-palette.mjs  # sharp: sample logo -> hexes
    prepare-media.mjs         # HEIC/MOV -> web assets
  public/media/               # optimized output (gitignored except samples)
  test/setup.ts               # vitest + jest-dom
  vitest.config.ts
  tailwind + tsconfig (from scaffold)
```

Root of repo gets a `.gitignore` addition to avoid committing `site/node_modules`, `.next`, and heavy `public/media` (keep a small sample set).

---

## Task 1: Scaffold the Next.js app in `site/`

**Files:** creates `site/**` (Next.js default tree).

- [ ] **Step 1: Run create-next-app (non-interactive)**

Run from repo root:
```bash
CI=1 npx --yes create-next-app@latest site \
  --ts --tailwind --eslint --app --no-src-dir \
  --import-alias "@/*" --use-npm --turbopack
```
Expected: scaffold completes, `npm install` runs, `site/` created. If any flag is rejected by the installed version, re-run accepting defaults: **No** `src/` dir, **Yes** Turbopack, alias `@/*`.

- [ ] **Step 2: Verify it runs**

Run:
```bash
cd site && npm run build
```
Expected: production build succeeds (default template).

- [ ] **Step 3: Add root .gitignore entries**

Append to repo-root `.gitignore` (create if missing):
```
# new Next.js app
site/node_modules
site/.next
site/out
site/.turbo
site/public/media/**
!site/public/media/.gitkeep
```

- [ ] **Step 4: Commit**
```bash
git add site .gitignore && git commit -m "feat(site): scaffold Next.js app in site/"
```

---

## Task 2: Install Phase-0 dependencies

**Files:** modifies `site/package.json`.

- [ ] **Step 1: Install runtime + dev deps**
```bash
cd site
npm install framer-motion gsap lenis clsx tailwind-merge
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom sharp
```
Expected: installs succeed (registry reachable).

- [ ] **Step 2: Add scripts to `site/package.json`**

Add to `"scripts"`:
```json
"typecheck": "tsc --noEmit",
"test": "vitest run",
"test:watch": "vitest",
"palette": "node scripts/extract-logo-palette.mjs",
"media": "node scripts/prepare-media.mjs"
```

- [ ] **Step 3: Enable TS strict** — verify `site/tsconfig.json` has `"strict": true` (create-next-app default). If not, set it.

- [ ] **Step 4: Commit**
```bash
git add site/package.json site/package-lock.json && git commit -m "chore(site): add animation, test, and media deps"
```

---

## Task 3: Vitest configuration + first TDD util (`cn`)

**Files:** Create `site/vitest.config.ts`, `site/test/setup.ts`, `site/lib/cn.ts`, `site/lib/cn.test.ts`.

- [ ] **Step 1: Write the failing test** — `site/lib/cn.test.ts`
```ts
import { describe, it, expect } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });
  it("drops falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });
  it("merges conflicting tailwind classes (last wins)", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
```

- [ ] **Step 2: Add config + setup so the test can run**

`site/vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
  },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
});
```
`site/test/setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Run test to verify it fails**
Run: `cd site && npm test`
Expected: FAIL — `cn` is not defined (module missing).

- [ ] **Step 4: Implement `site/lib/cn.ts`**
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
```

- [ ] **Step 5: Run test to verify it passes**
Run: `cd site && npm test`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**
```bash
git add site/vitest.config.ts site/test/setup.ts site/lib/cn.ts site/lib/cn.test.ts && git commit -m "test(site): add vitest + cn class-merge util"
```

---

## Task 4: Lock the palette from the logo (sharp)

**Files:** Create `site/scripts/extract-logo-palette.mjs`.

- [ ] **Step 1: Write the extraction script**
```js
// Usage: node scripts/extract-logo-palette.mjs "/abs/path/backpack logo.png"
import sharp from "sharp";

const src = process.argv[2] ??
  "/Users/dylonboone/Desktop/New Touch of Terra Website Photos/Logo/backpack logo.png";

const { data, info } = await sharp(src)
  .resize(160, 160, { fit: "inside" })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const ch = info.channels; // 4 (RGBA)
const buckets = new Map();
const q = (v) => Math.round(v / 16) * 16;
for (let i = 0; i < data.length; i += ch) {
  const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
  if (a < 200) continue;                    // skip transparent
  if (r > 235 && g > 235 && b > 235) continue; // skip near-white
  const key = `${q(r)},${q(g)},${q(b)}`;
  buckets.set(key, (buckets.get(key) ?? 0) + 1);
}
const total = [...buckets.values()].reduce((a, c) => a + c, 0);
const hex = (n) => n.toString(16).padStart(2, "0");
const top = [...buckets.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 12)
  .map(([k, n]) => {
    const [r, g, b] = k.split(",").map(Number);
    return `#${hex(r)}${hex(g)}${hex(b)}  ${((100 * n) / total).toFixed(1)}%`;
  });
console.log("Top logo colors (hex : share):\n" + top.map((t) => "  " + t).join("\n"));
```

- [ ] **Step 2: Run it**
Run: `cd site && npm run palette`
Expected: prints ~12 hex swatches with percentages (deep teal, steel/sky blues, olive greens, brown).

- [ ] **Step 3: Record results** — paste the output as a comment block at the top of `app/globals.css` (Task 5) and pick final brand hexes from the real values (adjust the Bible §5 provisional hexes to match).

- [ ] **Step 4: Commit**
```bash
git add site/scripts/extract-logo-palette.mjs && git commit -m "feat(site): logo palette extraction script"
```

---

## Task 5: Design tokens + globals.css + base styles

**Files:** Modify `site/app/globals.css`. (Tailwind v4 from scaffold expected; if v3, mirror tokens into `tailwind.config.ts` `theme.extend.colors`.)

- [ ] **Step 1: Write tokens + theme mapping.** Define CSS variables for the locked palette (from Task 4), spacing/elevation, and expose them to Tailwind. For Tailwind v4 use `@theme`:
```css
@import "tailwindcss";

/* Touch of Terra Blue palette — locked from logo (see palette script output) */
:root {
  --tot-blue: #4FA3C7;         /* backpack — primary accent */
  --tot-blue-deep: #2F82A6;    /* hover/active */
  --tot-sky: #DCEFF6;          /* airy bg */
  --tot-mist: #B9E0EE;         /* secondary bg / cards */
  --tot-teal: #14556B;         /* primary text/headings */
  --tot-ink: #0E3A49;          /* darkest ink / dark hero */
  --tot-leaf: #86B23E;         /* tree accent — graphics only */
  --tot-leaf-deep: #6E9531;
  --tot-clay: #7C563A;         /* trunk warm accent */
  --tot-cream: #F7F3EA;        /* primary light surface */
  --tot-white: #FFFFFF;
  --tot-shadow: 0 8px 30px rgba(20, 85, 107, 0.10);
  --tot-shadow-lg: 0 20px 60px rgba(20, 85, 107, 0.14);
}

@theme inline {
  --color-tot-blue: var(--tot-blue);
  --color-tot-blue-deep: var(--tot-blue-deep);
  --color-tot-sky: var(--tot-sky);
  --color-tot-mist: var(--tot-mist);
  --color-tot-teal: var(--tot-teal);
  --color-tot-ink: var(--tot-ink);
  --color-tot-leaf: var(--tot-leaf);
  --color-tot-clay: var(--tot-clay);
  --color-tot-cream: var(--tot-cream);
  --font-display: var(--font-fraunces);
  --font-sans: var(--font-inter);
}

html { scroll-behavior: auto; } /* Lenis owns scrolling */
body {
  background: var(--tot-cream);
  color: var(--tot-teal);
  font-family: var(--font-sans), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
h1,h2,h3 { font-family: var(--font-display), Georgia, serif; }

@media (prefers-reduced-motion: reduce) {
  *,*::before,*::after { animation-duration:.001ms !important; transition-duration:.001ms !important; scroll-behavior:auto !important; }
}
```

- [ ] **Step 2: Verify** — `cd site && npm run build` (expected: succeeds). Temporarily add a swatch block to `page.tsx` if you want a visual check (remove after).

- [ ] **Step 3: Commit**
```bash
git add site/app/globals.css && git commit -m "feat(site): Touch of Terra Blue design tokens"
```

---

## Task 6: Fonts (Fraunces + Inter)

**Files:** Create `site/lib/fonts.ts`; modify `site/app/layout.tsx`.

- [ ] **Step 1: `site/lib/fonts.ts`**
```ts
import { Fraunces, Inter } from "next/font/google";

export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
```

- [ ] **Step 2: Wire into `layout.tsx`** — add `className={\`${fraunces.variable} ${inter.variable}\`}` to `<html>`. Set `<html lang="en">`.

- [ ] **Step 3: Verify build** — `cd site && npm run build`. If the Google fetch fails offline, fall back to `next/font/local` with downloaded Fraunces/Inter `.woff2` in `app/fonts/` (note for executor).

- [ ] **Step 4: Commit**
```bash
git add site/lib/fonts.ts site/app/layout.tsx && git commit -m "feat(site): Fraunces + Inter via next/font"
```

---

## Task 7: Reduced-motion hook + GSAP/Lenis bridge

**Files:** Create `site/lib/motion/useReducedMotion.ts`, `site/lib/motion/registerGsap.ts`.

- [ ] **Step 1: `useReducedMotion.ts`** — SSR-safe hook returning boolean.
```ts
"use client";
import { useEffect, useState } from "react";

export const useReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
};
```

- [ ] **Step 2: `registerGsap.ts`** — register ScrollTrigger + defaults (guarded for browser).
```ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;
export const registerGsap = (): typeof gsap => {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: "power3.out", duration: 0.7 });
    registered = true;
  }
  return gsap;
};
export { ScrollTrigger };
```

- [ ] **Step 3: Commit**
```bash
git add site/lib/motion && git commit -m "feat(site): reduced-motion hook + gsap registration"
```

---

## Task 8: LenisProvider (smooth scroll, reduced-motion aware, ScrollTrigger synced)

**Files:** Create `site/components/providers/LenisProvider.tsx`.

- [ ] **Step 1: Implement**
```tsx
"use client";
import { type ReactNode, useEffect } from "react";
import Lenis from "lenis";
import { registerGsap, ScrollTrigger } from "@/lib/motion/registerGsap";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

export const LenisProvider = ({ children }: { children: ReactNode }) => {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return; // native scrolling under reduced motion
    registerGsap();
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [reduced]);

  return <>{children}</>;
};
```
(Keep Lenis snappy per Bible §8.1 — `duration ~1.05`, never sluggish.)

- [ ] **Step 2: Verify typecheck** — `cd site && npm run typecheck`.

- [ ] **Step 3: Commit**
```bash
git add site/components/providers/LenisProvider.tsx && git commit -m "feat(site): Lenis smooth-scroll provider synced to ScrollTrigger"
```

---

## Task 9: Core UI primitives

**Files:** Create `Container.tsx`, `Section.tsx`, `Eyebrow.tsx`, `DisplayHeading.tsx`, `ScrollCue.tsx`, `RevealOnScroll.tsx` under `site/components/ui/`.

Contracts (implement each as a focused file, named export, typed props, token-driven classes via `cn`):
- **Container**: `max-w-[1280px] mx-auto px-6 md:px-8`, optional `className`.
- **Section**: props `{ tone?: "cream" | "white" | "teal" | "ink"; children; className }`. Maps tone → bg/text tokens (teal/ink → cream text). Vertical padding `py-24 md:py-32`.
- **Eyebrow**: small uppercase Inter 600, letter-spaced, `text-tot-blue`.
- **DisplayHeading**: `as?: "h1"|"h2"`, Fraunces, fluid `clamp` sizes, balanced text.
- **ScrollCue**: accessible “scroll” affordance with a subtle bounce (disabled under reduced motion).
- **RevealOnScroll**: client component using Framer Motion `whileInView` (fade up 20px, once, viewport margin) — **no motion when reduced**; render children statically.

- [ ] **Step 1: Write a render test for RevealOnScroll + Button (Task 10 also)** — `site/components/ui/RevealOnScroll.test.tsx`
```tsx
import { render, screen } from "@testing-library/react";
import { RevealOnScroll } from "./RevealOnScroll";

it("renders its children (content is never hidden by motion)", () => {
  render(<RevealOnScroll><p>hello terra</p></RevealOnScroll>);
  expect(screen.getByText("hello terra")).toBeInTheDocument();
});
```
- [ ] **Step 2: Run to fail** — `cd site && npm test` → FAIL (module missing).
- [ ] **Step 3: Implement all six primitives** (RevealOnScroll last, satisfying the test).
- [ ] **Step 4: Run to pass** — `cd site && npm test`.
- [ ] **Step 5: Commit** — `git add site/components/ui && git commit -m "feat(site): core UI primitives"`.

---

## Task 10: Button primitive (TDD)

**Files:** Create `site/components/ui/Button.tsx`, `site/components/ui/Button.test.tsx`.

- [ ] **Step 1: Failing test**
```tsx
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

it("renders a button with label", () => {
  render(<Button>Donate</Button>);
  expect(screen.getByRole("button", { name: "Donate" })).toBeInTheDocument();
});
it("renders as a link when href is provided", () => {
  render(<Button href="/donate">Donate</Button>);
  expect(screen.getByRole("link", { name: "Donate" })).toHaveAttribute("href", "/donate");
});
```
- [ ] **Step 2: Run to fail** — `cd site && npm test`.
- [ ] **Step 3: Implement** — variants `primary` (Terra Blue bg, cream text), `secondary` (teal outline), `ghost`; sizes; renders `<a>`(next/link) when `href`, else `<button>`; focus-visible ring; reduced-motion-safe hover. Keyboard accessible.
- [ ] **Step 4: Run to pass** — `cd site && npm test`.
- [ ] **Step 5: Commit** — `git add site/components/ui/Button.tsx site/components/ui/Button.test.tsx && git commit -m "feat(site): Button primitive"`.

---

## Task 11: SiteHeader (scroll-aware) + SiteFooter + site constants

**Files:** Create `site/lib/site.ts`, `site/components/layout/SiteHeader.tsx`, `site/components/layout/SiteFooter.tsx`.

- [ ] **Step 1: `lib/site.ts`** — nav + org constants.
```ts
export const NAV_ITEMS = [
  { href: "/our-story", label: "Our Story" },
  { href: "/program", label: "The Program" },
  { href: "/impact", label: "Impact" },
  { href: "/events", label: "Events" },
  { href: "/get-involved", label: "Get Involved" },
] as const;

export const ORG = {
  name: "Touch of Terra",
  tagline: "Carrying compassion, one backpack at a time", // §21 open: confirm/update
  instagram: "https://instagram.com/", // TODO handle from DyLon
  donateHref: "/donate",
} as const;
```
- [ ] **Step 2: `SiteHeader.tsx`** (client) — transparent over hero; on scroll (>16px) adds `backdrop-blur` + cream/80 bg + subtle shadow + slight height shrink (Framer). Logo (icon mark) left, `NAV_ITEMS` center (animated underline on hover/active via `usePathname`), Donate `Button` right. Mobile: hamburger → full-screen menu (Framer `AnimatePresence`), large tap targets, Donate prominent, `Esc`/overlay-click closes, focus trapped, `aria-expanded`.
- [ ] **Step 3: `SiteFooter.tsx`** — logo + mission line + nav + Instagram + contact + donate CTA + nonprofit/EIN + legal line. Dark teal tone, cream text.
- [ ] **Step 4: Verify** — `cd site && npm run typecheck && npm run build`.
- [ ] **Step 5: Commit** — `git add site/lib/site.ts site/components/layout && git commit -m "feat(site): scroll-aware header + footer"`.

---

## Task 12: LoadScreen (first-load branded intro)

**Files:** Create `site/components/layout/LoadScreen.tsx`.

- [ ] **Step 1: Implement** (client) — on mount, check `sessionStorage.getItem("tot-loaded")`. If present OR `prefers-reduced-motion`, render nothing (instant content). Else render a fixed overlay (Ink bg) with the backpack mark drawing on + tree "grow" (SVG stroke-dashoffset or Framer), wordmark reveal; after ≤1.2s (or skip button / first interaction) fade out, set `sessionStorage.setItem("tot-loaded","1")`. Never block content beneath (content renders; overlay sits atop and removes itself). Overlay is `aria-hidden` with a visually-hidden “Loading” status; Skip button is focusable.
- [ ] **Step 2: Verify** — dev server: first load shows intro; reload in same tab skips it; reduced-motion skips it.
- [ ] **Step 3: Commit** — `git add site/components/layout/LoadScreen.tsx && git commit -m "feat(site): first-load branded intro screen"`.

---

## Task 13: Root layout wiring + home skeleton

**Files:** Modify `site/app/layout.tsx`, `site/app/page.tsx`; create `site/content/home.ts`.

- [ ] **Step 1: `layout.tsx`** — set `metadata` (title/description reflecting the youth mission), `lang="en"`, font variables on `<html>`, and body order: skip-link (`<a href="#main" class="sr-only focus:not-sr-only">Skip to content</a>`), `LoadScreen`, `LenisProvider` wrapping `SiteHeader` + `<main id="main">{children}</main>` + `SiteFooter`.
- [ ] **Step 2: `content/home.ts`** — placeholder copy object (hero statement, chapter titles/subtitles) so text lives in data, per Bible.
- [ ] **Step 3: `page.tsx`** — home skeleton proving the shell: photography-led hero (use a converted hero image from Task 14 if ready, else a Terra-Blue gradient placeholder with the hero statement + `ScrollCue`), then 3–4 `Section`s alternating tone with `Eyebrow` + `DisplayHeading` + `RevealOnScroll` stubs for Chapters 1–4 and a Join CTA (`Button` ×2). No real content yet — this is the frame.
- [ ] **Step 4: Verify** — `cd site && npm run typecheck && npm run lint && npm test && npm run build`, then run dev and visually confirm: load screen → nav transparent→blur on scroll → smooth Lenis scroll → reveals fire → reduced-motion path clean.
- [ ] **Step 5: Commit** — `git add site/app site/content && git commit -m "feat(site): root layout + home skeleton shell"`.

---

## Task 14: Media pipeline (images now, video guarded)

**Files:** Create `site/scripts/prepare-media.mjs`, `site/public/media/.gitkeep`.

- [ ] **Step 1: Implement the script.** Source root = the desktop asset folder (constant, overridable via arg). For each subfolder, output to `site/public/media/<slug>/`:
  - **Images** (`.heic/.heif/.jpg/.jpeg/.png`): if HEIC/HEIF, first `sips -s format png "<in>" --out "<tmp.png>"` (macOS), then `sharp(tmp).resize({width, withoutEnlargement}).webp({quality:80})` at widths `[640,1024,1600,2400]`; also emit a tiny blurDataURL (base64) manifest `public/media/manifest.json`.
  - **Video** (`.mov/.mp4`): if `ffmpeg` on PATH → transcode to `.mp4` (H.264, faststart) + `.webm` + poster (`-frames:v 1`); else log a clear warning listing skipped files and `brew install ffmpeg` and continue (do NOT fail the run).
  - Skip `.dng` (raw) with a note.
- [ ] **Step 2: Convert a starter subset** — run for `Distribution Events` + `Terra Photos` + `DyLon:Founder  Photos` to get the hero candidate, a Terra portrait, and founder shots.
Run: `cd site && npm run media`
Expected: WebP variants + manifest written under `public/media/`; video either transcoded (if ffmpeg) or clearly listed as skipped.
- [ ] **Step 3: Pick the hero image** — choose the best "student hands a Terra-Blue backpack" frame from `distribution-events`; wire it into `page.tsx` hero via `next/image` (fill, priority, blur placeholder from manifest).
- [ ] **Step 4: Commit** (small sample assets only; heavy media gitignored)
```bash
git add site/scripts/prepare-media.mjs site/public/media/.gitkeep site/public/media/manifest.json && git commit -m "feat(site): media pipeline (HEIC/MOV -> web) + hero image"
```

---

## Task 15: Phase-0 verification & acceptance

- [ ] **Step 1: Full gate** — `cd site && npm run typecheck && npm run lint && npm test && npm run build`. All pass.
- [ ] **Step 2: Manual UX pass (dev server)** — load screen (first load only), scroll-aware nav, smooth Lenis scroll, section reveals, keyboard nav + visible focus, skip link, `prefers-reduced-motion` clean (no transforms/parallax), mobile menu works.
- [ ] **Step 3: Acceptance (Bible §23 Phase 0):** a themed, animated, accessible shell with locked tokens, motion infra, primitives, nav/footer/load screen, media pipeline, and a working home skeleton. ✅ → ready for Phase 1 (Home + Our Story content).
- [ ] **Step 4: Final commit / branch state** — ensure everything committed on `overhaul`.

---

## Self-Review (author checklist)

**Spec coverage (Bible → task):** tech stack/architecture §20 → T1–T2, T13; color system §5 → T4–T5; typography §6 → T6; motion system §8 (Lenis/GSAP/Framer/reduced-motion/load screen) → T7,T8,T9,T12; nav & transitions §9 → T11; primitives/components §12 → T9,T10,T11,T12; media pipeline + consent §16 → T14 (consent enforced at content-use time in Phase 1/3, not here — noted); a11y §17 → T9–T13,T15; performance §18 → next/font, next/image, code-split providers (T6,T14,T8), verified T15; responsive §19 → header/menu + Section (T11,T9). Phases beyond 0 intentionally out of scope.

**Placeholder scan:** No vague "add error handling"/"TBD" in code steps. `ORG.instagram`/tagline are flagged **content** placeholders (Bible §21), not logic gaps. RevealOnScroll/Button/cn have real tests.

**Type consistency:** `cn` signature stable; `registerGsap()`/`ScrollTrigger` names consistent across T7/T8; `Section` `tone` union reused; `NAV_ITEMS`/`ORG` shapes consistent T11/T13.

**Gaps intentionally deferred:** real page content, Stripe/Zeffy donate, Instagram widget, Impact/Events, three.js — all later phases per Bible §23.
