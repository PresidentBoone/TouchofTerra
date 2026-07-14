import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { ScrollCue } from "@/components/ui/ScrollCue";
import { Button } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { FadeCarousel } from "@/components/ui/FadeCarousel";
import { AnimatedUnderline } from "@/components/ui/AnimatedUnderline";
import { BuildABackpack } from "@/components/ui/BuildABackpack";
import { ImpactStats } from "@/components/sections/ImpactStats";
import { RealMoments } from "@/components/sections/RealMoments";
import { InstagramStrip } from "@/components/sections/InstagramStrip";
import { getImage } from "@/lib/media";
import { cn } from "@/lib/cn";
import { home } from "@/content/home";

const chapterImage: Record<string, { id: string; alt: string }> = {
  backpack: {
    id: "distribution-events/img-2444",
    alt: "A neighbor opens his blue Touch of Terra backpack at a shelter distribution.",
  },
  students: {
    id: "packing-events/img-9928",
    alt: "Four high-school students in Touch of Terra shirts packing supplies at a Pack-a-Thon.",
  },
};

const heroImages = [
  {
    id: "packing-events/img-8277",
    alt: "A Touch of Terra care pack and blue backpack laid out, with a high school beyond the window.",
  },
  {
    id: "packing-events/img-9928",
    alt: "Four high-school students in Touch of Terra shirts at a Pack-a-Thon.",
  },
  {
    id: "distribution-events/img-2447",
    alt: "Two neighbors smile in the sun, each holding a blue Touch of Terra backpack.",
  },
  {
    id: "distribution-events/img-2443",
    alt: "A man in a wheelchair beams while holding his blue Touch of Terra backpack.",
  },
  {
    id: "packing-events/img-1919",
    alt: "The Touch of Terra team with a mountain of blue backpacks after a Pack-a-Thon.",
  },
];

export default function Home() {
  const heroSlides = heroImages.map((slide) => {
    const img = getImage(slide.id);
    return { src: img.src, blurDataURL: img.blurDataURL, alt: slide.alt };
  });

  return (
    <>
      {/* Hero, cross-fading photography */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden text-tot-cream">
        <FadeCarousel slides={heroSlides} sizes="100vw" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-tot-ink/95 via-tot-ink/60 to-tot-ink/75" />
        <Container className="relative z-10 flex flex-col items-center text-center">
          <RevealOnScroll className="flex flex-col items-center">
            <span className="inline-flex items-center rounded-full bg-tot-ink/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-tot-cream ring-1 ring-tot-cream/25 backdrop-blur-sm">
              {home.hero.eyebrow}
            </span>
            <DisplayHeading
              as="h1"
              className="mt-6 max-w-4xl drop-shadow-[0_2px_12px_rgba(8,42,56,0.6)]"
            >
              A movement, carried
              <br />
              <AnimatedUnderline>one backpack at a time.</AnimatedUnderline>
            </DisplayHeading>
            <p className="mt-6 max-w-xl text-lg text-tot-cream/90 drop-shadow-[0_1px_8px_rgba(8,42,56,0.6)]">
              {home.hero.lede}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button href="/donate" size="lg">
                Fund a backpack
              </Button>
              <Button
                href="/get-involved"
                size="lg"
                variant="secondary"
                className="border-tot-cream/40 text-tot-cream hover:border-tot-cream hover:bg-tot-cream/10"
              >
                Get involved
              </Button>
            </div>
          </RevealOnScroll>
          <ScrollCue className="mt-16 text-tot-cream/70" />
        </Container>
      </section>

      {home.chapters.map((chapter) => {
        const onDark = chapter.tone === "teal" || chapter.tone === "ink";
        const image = chapterImage[chapter.id];
        const bodyColor = onDark ? "text-tot-cream/85" : "text-tot-teal/80";

        if (image) {
          return (
            <Section key={chapter.id} tone={chapter.tone}>
              <Container>
                <div
                  className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${
                    chapter.id === "students"
                      ? "md:[&>*:first-child]:order-2"
                      : ""
                  }`}
                >
                  <RevealOnScroll className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[var(--tot-shadow-lg)]">
                    <SmartImage
                      id={image.id}
                      alt={image.alt}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
                    />
                  </RevealOnScroll>
                  <RevealOnScroll delay={0.1}>
                    <Eyebrow className={onDark ? "text-tot-blue-mist" : undefined}>
                      {chapter.eyebrow}
                    </Eyebrow>
                    <DisplayHeading className="mt-5">
                      {chapter.title}
                    </DisplayHeading>
                    <p className={`mt-6 text-lg leading-relaxed ${bodyColor}`}>
                      {chapter.body}
                    </p>
                  </RevealOnScroll>
                </div>
              </Container>
            </Section>
          );
        }

        return (
          <Section key={chapter.id} tone={chapter.tone}>
            <Container className="max-w-3xl">
              <RevealOnScroll>
                <Eyebrow className={onDark ? "text-tot-blue-mist" : undefined}>
                  {chapter.eyebrow}
                </Eyebrow>
                <DisplayHeading className="mt-5">{chapter.title}</DisplayHeading>
                <p className={cn("mt-6 text-lg leading-relaxed", bodyColor)}>
                  {chapter.body}
                </p>
              </RevealOnScroll>
            </Container>
          </Section>
        );
      })}

      {/* A quiet moment for Terra */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden text-tot-cream">
        <SmartImage
          id="terra-photos/terra-002"
          alt="Terra Boone, whose kindness began it all."
          sizes="100vw"
          className="object-[center_28%]"
        />
        <div className="pointer-events-none absolute inset-0 bg-tot-ink/72" />
        <Container className="relative z-10 max-w-3xl text-center">
          <RevealOnScroll>
            <p className="font-display text-[clamp(1.75rem,3.6vw,2.9rem)] leading-snug">
              Every backpack carries a piece of her kindness back into the world.
            </p>
            <p className="mt-8 text-xs uppercase tracking-[0.3em] text-tot-blue-mist">
              In loving memory of Terra Boone
            </p>
          </RevealOnScroll>
        </Container>
      </section>

      <ImpactStats />

      {/* Interactive: build a backpack */}
      <Section tone="cream">
        <Container className="max-w-3xl">
          <div className="text-center">
            <RevealOnScroll>
              <Eyebrow>Build a backpack</Eyebrow>
              <DisplayHeading className="mt-5">
                See what your gift becomes.
              </DisplayHeading>
              <p className="mt-6 text-lg text-tot-teal/75">
                Tap the items to build a Touch of Terra Blue backpack, then fund
                one just like it.
              </p>
            </RevealOnScroll>
          </div>
          <RevealOnScroll
            delay={0.1}
            className="mt-10 rounded-3xl bg-tot-white p-8 shadow-[var(--tot-shadow-lg)] md:p-12"
          >
            <BuildABackpack />
          </RevealOnScroll>
        </Container>
      </Section>

      <RealMoments />
      <InstagramStrip />

      <Section tone="ink">
        <Container className="flex max-w-3xl flex-col items-center text-center">
          <RevealOnScroll className="flex flex-col items-center">
            <Eyebrow className="text-tot-blue-mist">{home.join.eyebrow}</Eyebrow>
            <DisplayHeading className="mt-5">{home.join.title}</DisplayHeading>
            <p className="mt-6 max-w-xl text-lg text-tot-cream/85">
              {home.join.body}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button href="/donate" size="lg">
                Fund a backpack
              </Button>
              <Button
                href="/get-involved"
                size="lg"
                variant="secondary"
                className="border-tot-cream/40 text-tot-cream hover:border-tot-cream hover:bg-tot-cream/10"
              >
                Get involved
              </Button>
            </div>
          </RevealOnScroll>
        </Container>
      </Section>
    </>
  );
}
