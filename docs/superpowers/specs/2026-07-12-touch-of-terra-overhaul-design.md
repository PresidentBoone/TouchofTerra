# Touch of Terra — Design Bible & Overhaul Spec

**Date:** 2026-07-12
**Owner:** DyLon Boone (Founder)
**Status:** Draft for approval
**Purpose:** The single source of truth for the complete overhaul of the Touch of Terra website. Every page, component, and animation should feel like it was designed by the same creative agency. When in doubt during implementation, this document decides.

> **Reference asset folder (source of truth for imagery):**
> `/Users/dylonboone/Desktop/New Touch of Terra Website Photos/`
> Subfolders: `Terra Photos`, `DyLon:Founder  Photos`, `Logo` (`Main logo.png`, `backpack logo.png`), `Distribution Events`, `Packing Events`.
> These are the real photos/videos to use. Many are `.HEIC/.HEIF/.MOV/.DNG` and must go through the media pipeline (§16) before use.

---

## 0. How to use this document (Claude development rules)

1. **Story first, effects second.** Every animation must communicate emotion or purpose. If an effect only shows off technique, cut it.
2. **This is not a "nonprofit website."** It is a cinematic, documentary-grade experience about honoring a mother's kindness by empowering the next generation. Aim for Apple + Brunello Cucinelli + charity: water, with the warmth of a memorial.
3. **Follow the user's global standards:** Next.js App Router, TypeScript (strict), functional components + hooks, named exports, `const` over `let`, early returns, one component per file, Tailwind, **npm only**.
4. **Never blindly apply a library.** GSAP, Framer, Lenis, Three.js are tools — use them only where they improve the story (§8).
5. **Accessibility and performance are non-negotiable** (§17, §18). A beautiful site that excludes people or loads slowly has failed.
6. **Respect the mission pivot.** The old site said "Carrying compassion, one backpack at a time" and centered homelessness data. The new story centers **youth-led service** with backpacks as the through-line. Do not resurrect the old homelessness-platform framing.
7. **Handle Terra's memory with care.** Terra Boone was DyLon's mother. This is a memorial as much as a nonprofit. Tone is reverent, hopeful, dignified — never maudlin.

---

## 1. Brand philosophy & positioning

**One-line identity:** *A mother's kindness, carried forward by the next generation — one backpack at a time.*

**Positioning:** Touch of Terra is a youth-led nonprofit that teaches high schoolers to organize and run real community-service events. Students partner with local organizations to design and assemble ready-to-go care packs — the iconic **Touch of Terra Blue backpack** — for community members experiencing hardship.

**Brand personality:** Warm · Dignified · Hopeful · Premium · Human · Youthful-but-serious.

**What we are NOT:** Not corporate, not a spreadsheet of statistics, not a pity narrative, not a generic template, not "look what our developer can do."

---

## 2. Mission & narrative

### 2.1 The founding story (the heart)
Terra Boone kept backpacks filled with supplies in her car for people she met on the street. When she saw someone in need, she gave one. Touch of Terra, founded in her honor by her son **DyLon Boone**, turns that single, personal act of kindness into a movement.

### 2.2 The mission today (the pivot)
Touch of Terra now exists to **get high schoolers involved in running and organizing nonprofit events and serving their community.** The model:
- Students choose **two partner organizations** per year.
- They run **two events per year** (one per partner, or as scoped with partners).
- Working *with* those organizations, they **design and assemble ready-to-go care packs** — Touch of Terra Blue backpacks — tailored to the people each organization serves.
- Along the way, students **learn what it takes to plan, fund, staff, and execute** a real service event.

So it is no longer "bags for the homeless." It is **backpacks for community members experiencing hardship, crafted by dedicated students learning to lead.** Homelessness was the origin (Terra's story); it is now one of many forms of hardship the students serve.

### 2.3 The three narrative threads (must always braid together)
1. **Terra's legacy** — the "why." The emotional heart, woven throughout (per user decision: *Heart throughout*).
2. **Youth leadership** — the "what/how." Students organizing and running events.
3. **The Touch of Terra Blue backpack** — the visible thread that connects every event, every year, every person served.

### 2.4 Narrative arc for the site (documentary structure)
Terra's kindness → the backpack as a symbol → students step up to lead → partner organizations + real events → the people served (impact & testimonials) → *you* join (donate / get involved).

---

## 3. Voice & tone

- **Reverent but not heavy.** Hope leads; grief is present but never wallowed in.
- **Plain and human.** Short sentences. Real words. No jargon, no "synergy," no NGO-speak.
- **Youth-forward.** The students are heroes of the story; center their agency and growth.
- **Dignity-preserving.** People served are neighbors, never "cases" or "the homeless." Never a pity narrative.
- **Concrete over abstract.** "A student handed a warm backpack to a man named ___" beats "we make an impact."

**Copy rules:** Sentence case for almost everything. One idea per section. Numbers animate but always carry a human unit ("312 backpacks — one for every neighbor we met this spring").

---

## 4. Visual identity — logo usage

- **Primary mark:** `Logo/Main logo.png` (badge with "TOUCH OF TERRA" + backpack + tree). Use in footer, load screen, and formal contexts. Note the current tagline in the badge is "Carrying Compassion, One Backpack at a Time" — flag for DyLon whether to keep or update to reflect the youth mission (see §21 open items).
- **Icon mark:** `Logo/backpack logo.png` (the blue backpack with tree) — use as favicon, nav mark, section motif, loading animation subject, and the "backpack" in interactive donation.
- **Clear space & restraint:** Treat the mark like Apple's — used sparingly so it becomes iconic. Never stretch, recolor arbitrarily, or add shadows beyond the defined elevation system.
- **Deliverable:** Recreate/trace the backpack mark as an **optimized SVG** during Phase 0 so it can animate crisply (draw-on, tree "grow") and lock exact brand hexes from it.

---

## 5. Color system — "Touch of Terra Blue"

Derived from the logo. Hexes below are provisional and will be **locked from the logo SVG in Phase 0**; ratios re-verified then.

| Token | Hex | Role |
|---|---|---|
| `--tot-blue` (Terra Blue) | `#4FA3C7` | The backpack. Primary brand accent, buttons, highlights, links-as-accent |
| `--tot-blue-deep` | `#2F82A6` | Hover/active states for Terra Blue |
| `--tot-sky` | `#DCEFF6` | Airy light background wash |
| `--tot-mist` | `#B9E0EE` | Secondary light background / cards on cream |
| `--tot-teal` (Deep Teal) | `#14556B` | **Primary text & headings** (AA on cream/white), dark section base |
| `--tot-ink` | `#0E3A49` | Darkest ink / high-emphasis text / dark hero overlays |
| `--tot-leaf` (Leaf) | `#86B23E` | The tree. "Growth/impact" accent — **graphics & large elements only** |
| `--tot-leaf-deep` | `#6E9531` | Leaf hover/active |
| `--tot-clay` (Warm Clay) | `#7C563A` | The trunk. Sparing warm grounding accent |
| `--tot-cream` | `#F7F3EA` | Primary light surface |
| `--tot-white` | `#FFFFFF` | Cards, elevated surfaces |

### Contrast & usage rules (WCAG AA)
- **Body & small text:** Deep Teal `#14556B` or Ink on cream/white only. (Both pass AA.)
- **Terra Blue and Leaf are accents** — do **not** use for small body text on light backgrounds (insufficient contrast). Allowed for large display numerals, icons, fills, and text on sufficiently dark backgrounds.
- **Dark cinematic sections:** background Deep Teal/Ink; text is Cream/White (passes AA). Terra Blue and Leaf pop as accents here.
- **Every pairing is verified** against AA (4.5:1 normal, 3:1 large) in Phase 0 and again per component.

### Gradients (subtle only)
Soft, low-contrast washes: `sky → white`, `teal → ink` (dark sections), occasional `blue → mist`. **No loud multi-stop gradients.** Inspiration: Stripe/Brunello restraint.

---

## 6. Typography system

**Decision:** **Fraunces** (display serif) + **Inter** (body/UI). Fraunces gives warmth, optical soul, and editorial gravity; Inter keeps UI crisp and highly legible. (Swappable if DyLon wants a change later.)

- **Display / H1–H2:** Fraunces, optical size high, weights 400–600, slight negative tracking on large sizes. Used for emotional statements and chapter titles.
- **H3–H4 / eyebrows / labels:** Inter 600–700, generous letter-spacing on small caps eyebrows.
- **Body:** Inter 400/500, line-height ~1.6, max line length ~66ch.
- **Numerals (stats):** Fraunces or Inter tabular for animated counters — large, confident.

**Type scale (fluid, `clamp()`):** display 3.5–6rem · h1 2.75–4rem · h2 2–3rem · h3 1.5–2rem · body 1–1.125rem · small 0.875rem. Exact tokens defined in Phase 0.

**Signature move:** animated underlines that *draw* beneath key words as they enter (Make Me Pulse inspiration) — used sparingly on pivotal statements.

---

## 7. Layout, grid & spacing

- **Grid:** 12-column, max content width ~1200–1280px, generous gutters. Full-bleed allowed for hero/photography/dark chapters.
- **Whitespace is a feature.** Big margins, room to breathe. "Interesting, not busy."
- **Spacing scale:** 4px base (4/8/12/16/24/32/48/64/96/128).
- **Rhythm:** alternate light (cream/white) and dark (teal/ink) chapters to create documentary pacing and section-to-section contrast.
- **Elevation:** soft, low, blue-tinted shadows (e.g., `0 8px 30px rgba(20,85,107,0.10)`). No harsh drop shadows.

---

## 8. Motion & animation system

**Principle:** motion guides attention, reveals emotion, reinforces narrative. Never decorative, never delays information, never "look what the dev can do."

### 8.1 Libraries & when to use each
- **Lenis** — smooth scrolling site-wide. Fast and natural, **never slow/laggy**. Tuned so it feels premium but responsive.
- **GSAP + ScrollTrigger** — chapter storytelling, pinned scenes, staggered text/image reveals, number counters, parallax, the "what's inside a backpack" assembly beat. This is the cinematic engine.
- **Framer Motion** — microinteractions, hover, nav state, button feedback, staggered card entrances, page transitions (App Router).
- **R3F / Three.js** — *optional, sparing.* Not in the hero (hero is photography-led). Candidate uses: a subtle 3D backpack motif in the Program section or an interactive "build-a-backpack" flourish — only if it stays fast and lazy-loads with a non-WebGL fallback. Default to SVG/Lottie/`<video>` first.

### 8.2 Load screen
- Branded intro on **first load only** (sessionStorage): the backpack mark **draws on**, the **tree grows**, wordmark reveals, then fades into the hero. Target **≤1.2s**, **skippable**, and **disabled under `prefers-reduced-motion`** (instant content instead).

### 8.3 Global motion rules
- Ease: custom cubic-beziers (no default linear). Durations 0.3–0.9s for reveals; page transitions ~0.4–0.6s.
- Reveal pattern: content fades **up** ~16–24px with slight stagger; images scale from ~1.03 → 1.0.
- **`prefers-reduced-motion: reduce`** disables parallax, autoplay motion, and large transforms everywhere; replaces with simple fades or instant states.
- Never block first meaningful paint behind an animation. Content is readable even if JS/anim fails.

### 8.4 Approved vs. avoid (from DyLon's references)
**Approved:** text slide/fade-ins, animated underlines, image reveals & parallax, number counters, SVG draw-on, smooth page transitions, subtle floating shapes, tasteful video backgrounds, morphing section transitions.
**Avoid:** full 3D worlds, constantly-moving backgrounds, long loads, hidden/experimental navigation, confusing scroll hijacking, animation that delays reading, gratuitous WebGL, loud gradients everywhere, clutter.

---

## 9. Navigation & page transitions

- **Desktop nav (Apple-inspired):** transparent over hero → on scroll gains blur + subtle background + slight shrink; logo left, links center, **Donate** button (Terra Blue) right.
- **Mobile:** clean, minimal full-screen menu (no experimental gimmicks). Large tap targets, Donate prominent.
- **Persistent & elegant.** Never hide primary nav behind obscure gestures.
- **Page transitions:** smooth fades/morphs between routes so the site feels like one continuous journey (Framer Motion + App Router; consider View Transitions API where supported). The nav persists across transitions.

---

## 10. Information architecture / sitemap

| Route | Page | Purpose |
|---|---|---|
| `/` | **Home** | Cinematic scroll: Terra → the backpack → youth-led mission → impact preview → join |
| `/our-story` | **Our Story** | Terra's legacy, how ToT began, the mission, founder DyLon + board (placeholders), Instagram, values timeline |
| `/program` | **The Program** | The student-led model: pick 2 partners, 2 events/yr, design & build care packs; "anatomy of a Touch of Terra backpack" |
| `/impact` | **Impact** | Animated stats, testimonial videos, partner orgs, map of where we've served — **the repurposed dashboard** |
| `/events` | **Events** | Upcoming & past pack-a-thons/distributions; photos & video; how a school/student joins an event |
| `/get-involved` | **Get Involved** | Students & schools apply; partner orgs apply; volunteer; the "how to bring ToT to your school" path |
| `/donate` | **Donate** | Zeffy (0%) + Stripe; build-a-backpack impact framing |
| `/contact` | **Contact** | Simple, warm, not over-designed |

Global: persistent nav + footer (logo, mission line, nav, Instagram, contact, donate, nonprofit/EIN + legal). Instagram feed appears as a section on Home and/or Our Story.

---

## 11. Page-by-page storyboards

> Each page is a chapter. Motion serves the beat. All imagery from the asset folder (§16 pipeline).

### 11.1 Home
1. **Hero (photography-led):** full-bleed real photo — a student handing a Touch of Terra Blue backpack to a neighbor (candidate source: `Distribution Events`). Dark teal-to-transparent gradient overlay for legibility. Overlaid Fraunces statement: *"In honor of Terra. A movement, carried one backpack at a time."* Subtle parallax on scroll; scroll cue. Nav transparent here.
2. **Chapter 1 — Terra's kindness:** a soft, reverent beat. A Terra photo reveals; short copy about the backpacks she kept in her car. Animated underline on a key phrase.
3. **Chapter 2 — The backpack (symbol):** "Anatomy of a Touch of Terra backpack" — the icon assembles / items reveal on scroll (SVG/Lottie; the assembly moment the Dogstudio ref inspired, relocated from hero). Ties color scheme to meaning.
4. **Chapter 3 — Students step up:** the pivot. Packing-event photography (`Packing Events`), youthful energy. Copy: students choose partners, plan, and run real events. Stat preview counters begin.
5. **Chapter 4 — Impact preview:** 3–4 animated stats + one testimonial video thumbnail → link to `/impact`.
6. **Chapter 5 — Join us:** dual CTA — Donate (Terra Blue) + Get Involved (outline). Instagram strip below.

### 11.2 Our Story
- **Hero:** Terra photo + "Our Story."
- **Terra's legacy:** longer-form, reverent; what she did and why it mattered (content from DyLon, §21).
- **How ToT began:** DyLon's founding, the decision to honor her by empowering youth.
- **Values timeline** (Richard Mille-style scroll chapters): Terra's kindness → founding → first event → youth-led model → future vision.
- **The team:** Founder **DyLon Boone** (real photos from `DyLon:Founder  Photos`, bio, Instagram link) + board **Ann Lechleiter (Secretary)** and **Johnna Cristofoli (Treasurer)** as elegant placeholders (photo + short bio to be supplied).
- **Instagram** section (§14).

### 11.3 The Program
- Explains the student-led model as a clear, visual **3-step / cyclical** process: **Choose partners → Design the care packs → Run the event & serve.**
- "What it teaches" — leadership, logistics, fundraising, empathy (student-growth framing).
- "Anatomy of a Touch of Terra Blue backpack" — interactive/annotated backpack (items, who it's for). Optional R3F flourish (§8.1) with SVG fallback.
- CTA: bring ToT to your school → `/get-involved`.

### 11.4 Impact (repurposed dashboard)
- **Hero stat band:** animated counters (backpacks assembled, events run, students involved, partner orgs, neighbors served, volunteer hours). Each number carries a human unit.
- **Testimonial videos:** people helped and students reflecting (consent-gated, §16). Poster + captioned player.
- **Partner organizations:** logos/cards + what each does.
- **Where we've served:** a light, elegant map or place-list (not the old homelessness heat-map platform). Keep it about *our* footprint.
- **Optional "the need" context:** a small, tasteful data moment (community hardship) — informative, not the centerpiece.
- Data comes from a simple structured content file (§15), easy for DyLon to update.

### 11.5 Events
- Upcoming events (date, partner, location, how to join) + past events gallery (photos/video from `Packing Events`, `Distribution Events`, e.g., "Spring Pack-a-Thon 2026").
- Each event card can expand to a mini-story.

### 11.6 Get Involved
- Three clear audiences: **Students / Schools** (bring ToT to your school), **Partner organizations** (apply to partner), **Volunteers/Donors**.
- Simple forms (name, email, school/org, message) → email/serverless handler; success microinteraction. Keep friction low.

### 11.7 Donate
- See §13. Build-a-backpack impact framing + Zeffy/Stripe rails.

### 11.8 Contact
- Warm, minimal: short form + email + Instagram. Do not over-design.

---

## 12. Component library

Foundational, reusable (one component per file, named exports, typed props):
- **Layout:** `SiteHeader` (scroll-aware nav), `SiteFooter`, `PageTransition`, `Section`, `Container`, `Chapter` (light/dark variant).
- **Typography:** `DisplayHeading`, `Eyebrow`, `AnimatedUnderline`, `Prose`.
- **Media:** `SmartImage` (next/image wrapper w/ responsive + blur placeholder), `VideoPlayer` (poster, captions, lazy), `ParallaxImage`, `Gallery`.
- **Story:** `RevealOnScroll`, `StatCounter`, `Timeline`, `ProcessSteps`, `BackpackAnatomy`.
- **People:** `TeamCard` (real + placeholder states), `TestimonialCard`.
- **Interactive:** `InstagramFeed`, `PartnerGrid`, `ImpactMap`, `BuildABackpack`.
- **Forms:** `Field`, `Form`, `Button` (primary/secondary/ghost), `SuccessState`.
- **Feedback:** `LoadScreen`, `ScrollCue`, `Toast`.

All components: keyboard-accessible, focus-visible states, reduced-motion aware, and driven by the design tokens (no hard-coded colors).

---

## 13. Donation experience (Zeffy + Stripe)

**User decision:** offer **both**. Present honestly.

- **Zeffy rail (primary for cost):** 0% platform fees — "100% of your gift reaches Touch of Terra." Keep the existing embed/link (form slug: `touch-of-terra-an-impactful-project-in-honor-of-terra-boone`) but wrapped in the new design. Zeffy asks donors for an optional tip *to Zeffy* — copy explains this plainly.
- **Stripe rail (branded/convenience):** fully-branded **Stripe Checkout** (cards, Apple/Google Pay, one-time **and monthly recurring**) via a Next.js **Route Handler** creating a Checkout Session + a webhook for confirmation. Honest note that card processing carries ~2.2% + 30¢ (nonprofit rate), unlike Zeffy's 0%.
- **Build-a-backpack framing:** interactive selector — pick items (socks, hygiene, water, snacks, warmth…) → live "your backpack = $X" → choose Zeffy or Stripe. Ties the donation to the tangible backpack and Terra's story.
- **Impact tiers** with human units ("$25 packs one backpack," etc. — real numbers from DyLon).
- **Trust:** SSL/secure copy, nonprofit status/EIN, where money goes.
- **Backend:** minimal — Stripe secret key in env, Checkout Session route, webhook route, no PII stored beyond what Stripe handles.

---

## 14. Instagram integration

**User decision:** must be **free**; live auto-update preferred, interactive link acceptable if free auto-update is unreliable.
- **Primary:** free auto-updating widget (e.g., **Behold** free tier, **SnapWidget**, or **LightWidget** free tier) embedded as a styled grid matching the design system. Requires ToT's IG to be a **Business/Creator** account (confirm, §21).
- **Fallback:** if the free tier rate-limits or degrades, a **curated grid** (hand-selected recent posts as static, styled cards) + a prominent **"Follow @touchofterra"** CTA. No ongoing cost.
- **Founder:** DyLon's personal Instagram linked in the Our Story team card (§11.2).
- Lazy-load the embed; never let it block page load or harm CLS.

---

## 15. Impact data model (repurposed dashboard)

Replace the homelessness-platform data with **our** impact, stored in a simple typed content file (e.g., `content/impact.ts` or JSON) so DyLon can update without touching components:
```
impact = {
  backpacksAssembled, eventsRun, studentsInvolved,
  partnerOrgs: [{ name, blurb, logo }],
  neighborsServed, volunteerHours,
  places: [{ name, lat?, lng? }],
  testimonials: [{ name?, role, videoSrc, poster, quote, consent: true }],
  updatedAt
}
```
Visualization: lightweight (animated counters + simple charts). Only pull in a charting lib if a chart genuinely adds meaning; prefer bespoke SVG/counters for premium feel. The old `dashboard/` app is a reference for data wiring only — not carried over wholesale.

---

## 16. Photography, video direction & media pipeline

### 16.1 Direction
- Documentary, authentic, human. Real hands, real backpacks, real students, real moments. No stock.
- Favor: the Touch of Terra Blue backpack in frame, students in action, genuine connection, warm natural light.
- Terra photos: reverent, softly lit, treated as precious.

### 16.2 Pipeline (Phase 0)
- Convert `.HEIC/.HEIF → WebP` (and AVIF where worthwhile); `.MOV/.DNG → MP4 (H.264) + WebM` with **poster** stills.
- Generate responsive sizes; compress aggressively but preserve quality on hero/portrait shots.
- Store optimized assets in `public/media/...`; originals stay in the desktop folder (untouched).
- Serve via `next/image` (images) and `<video>` with `preload="none"`, poster, and captions (video).

### 16.3 Consent & dignity (ETHICS — required)
- For any **identifiable person served**, confirm we have **permission** to publish before using their face. Where consent is unclear or absent, use hands/backpacks/wide/back-of-frame shots, or blur — never compromise dignity for a photo.
- Testimonial videos are only published with clear consent; provide captions/transcripts.
- DyLon to identify which `Distribution Events` / `Packing Events` clips are cleared testimonials (§21).

---

## 17. Accessibility (WCAG 2.1 AA)

- Semantic HTML, logical heading order, landmark regions.
- Color contrast AA on every text pairing (§5); never rely on color alone.
- Full keyboard operability; visible focus states; skip-to-content link.
- `prefers-reduced-motion` fully honored (§8.3).
- Alt text on all meaningful images; captions + transcripts on videos; labeled forms with clear errors.
- Respect prefers-color-scheme where relevant; test with a screen reader before launch.

---

## 18. Performance budget

- **Targets:** LCP < 2.5s (mobile, mid-tier), CLS < 0.1, INP < 200ms; Lighthouse ≥ 90 across the board.
- Ship minimal JS: code-split per route; lazy-load Lenis/GSAP/heavy media/WebGL; defer the Instagram embed and video.
- Images via `next/image` (responsive, AVIF/WebP, blur placeholders). No layout shift from media (reserved dimensions).
- Fonts: `next/font` (Fraunces + Inter), subset, `font-display: swap`, preconnect.
- Do not let the load screen or any animation delay content readiness. Budget total hero payload tightly.

---

## 19. Responsive rules

- **Mobile-first.** Every chapter must work as a single-column, touch-friendly experience.
- Reduce/replace parallax and heavy motion on small screens; keep the emotional beats, lighten the mechanics.
- Breakpoints roughly: `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`.
- Tap targets ≥ 44px; Donate always reachable.

---

## 20. Technical stack & architecture

- **Framework:** Next.js (App Router) + TypeScript (strict).
- **Styling:** Tailwind CSS + CSS variables for design tokens (single source in `globals.css` / a tokens file).
- **Animation:** Lenis, GSAP + ScrollTrigger, Framer Motion; R3F/Three.js optional & lazy.
- **Fonts:** `next/font` (Fraunces, Inter).
- **Payments:** Stripe (Checkout via Route Handlers + webhook); Zeffy embed/link.
- **Media:** `next/image`, `<video>`; build-time/prep conversion scripts.
- **Deployment:** Vercel. Env vars for Stripe keys, Instagram widget IDs, form handler.
- **Package manager:** npm.

### Proposed structure
```
app/
  (marketing)/ page.tsx, our-story/, program/, impact/, events/, get-involved/, donate/, contact/
  api/ stripe/checkout/route.ts, stripe/webhook/route.ts, contact/route.ts
components/  (per §12, one component per file)
lib/         (motion presets, stripe, utils, seo)
content/     (copy, impact.ts, events, team, partners — editable data)
public/media/(optimized images/video)
styles/      (globals.css, tokens)
```
The overhaul is built **fresh** (per DyLon: complete overhaul, do not modify the old site). The existing HTML/`dashboard/` stays as read-only reference until the new site is ready to replace it.

---

## 21. Content inventory — needed from DyLon (not blocking; placeholders until then)

Send whenever — I'll build with tasteful placeholders and swap in:
1. **Instagram:** ToT handle + whether it's a **Business/Creator** account; DyLon's personal handle.
2. **Testimonial videos:** which `Distribution Events` / `Packing Events` clips are **consent-cleared** testimonials; who's speaking.
3. **Impact numbers:** backpacks assembled, events run, students involved, partner orgs (names + blurbs), neighbors served, volunteer hours, $ raised, donation impact tiers.
4. **Partner organizations:** the two current/most-recent partners (names, logos, one-liners).
5. **Terra's story:** the details DyLon wants told (only what he's comfortable sharing) + any dates.
6. **Founder bio:** DyLon short bio; confirm which `DyLon:Founder  Photos` to feature.
7. **Board:** Ann Lechleiter (Secretary) & Johnna Cristofoli (Treasurer) — photos + short bios (later).
8. **Tagline decision:** keep "Carrying Compassion, One Backpack at a Time" or update to reflect the youth mission?
9. **Ops:** domain name + current host (Vercel?); Stripe account + EIN/nonprofit status for discounted rate; confirm the live Zeffy form URL.

---

## 22. Inspiration library (steal / avoid)

**Storytelling & pacing:** Richard Mille (chapters), Lando Norris (cinematic full-screen beats), Don't Board Me (day-in-the-life), charity: water (emotional pacing, real photography), DB Longbow (sliding typography, alternating light/dark).
**Loading & reveal:** Dogstudio (cinematic load, the backpack-assembly idea — used as a chapter beat, not the hero).
**Navigation:** Apple (transparent → blur/shrink on scroll).
**Typography motion:** Make Me Pulse (animated underlines, text choreography).
**Polish & restraint:** Apple, Brunello Cucinelli (flow + tasteful color), Stripe (micro-animations, clean data viz).
**Youthful warmth:** Kode With Klossy (bright, friendly, human).

**Steal:** cinematic pacing, purposeful motion, huge photography, emotional copy, smooth transitions, animated underlines/counters, premium restraint.
**Avoid:** gimmicky/heavy WebGL, constant moving backgrounds, long loads, hidden nav, scroll hijacking, animation that delays reading, loud gradients, clutter.

---

## 23. Phasing & roadmap (no deadline → do it right)

Each phase gets its own implementation plan and review. Acceptance = works, accessible, performant, on-brand.

- **Phase 0 — Foundation:** Next.js scaffold, design tokens, Tailwind config, fonts, component primitives, motion setup (Lenis/GSAP/Framer), load screen, scroll-aware nav + footer, media pipeline + optimized assets, logo → SVG, lock palette. *Acceptance: a themed shell with a working home skeleton.*
- **Phase 1 — Story:** Home (all chapters, photography-led hero) + Our Story (Terra, DyLon, board placeholders, values timeline, Instagram section). *Acceptance: the emotional core is live and moving.*
- **Phase 2 — Program + Donate + Instagram:** The Program page (student model, backpack anatomy), Donate (Zeffy + Stripe + build-a-backpack), Instagram widget + fallback. *Acceptance: someone can understand the model and give money.*
- **Phase 3 — Impact + Events:** repurposed Impact (stats, testimonials, partners, footprint) + Events (upcoming/past galleries). *Acceptance: proof and momentum are visible.*
- **Phase 4 — Get Involved + Contact + Launch:** forms, SEO/meta/OG, sitemap/robots, analytics, full a11y + performance pass, cross-device QA, deploy + domain cutover. *Acceptance: launch-ready.*

---

## 24. Open questions & assumptions

- **Assumptions:** single Next.js app on Vercel; Fraunces+Inter; photography-led hero; repurpose (not preserve) the homelessness dashboard; build fresh alongside the old site.
- **Open (see §21):** Instagram account type + handles; consent-cleared testimonial clips; real impact numbers; partner names; Terra story details; board bios/photos; tagline decision; domain/host; Stripe/EIN status.
- **Deferred ideas (post-launch candidates):** interactive impact map with rich per-place stories, memory wall, live weather-reactive donation prompt, deeper "day-in-the-life" volunteer scroll — only if they serve the story and stay performant.

---

*End of Design Bible v1 (2026-07-12). This document governs the overhaul. Update it as decisions evolve.*
