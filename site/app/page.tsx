import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { ScrollCue } from "@/components/ui/ScrollCue";
import { Button } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { ImpactStats } from "@/components/sections/ImpactStats";
import { RealMoments } from "@/components/sections/RealMoments";
import { InstagramStrip } from "@/components/sections/InstagramStrip";
import { getImage } from "@/lib/media";
import { cn } from "@/lib/cn";
import { home } from "@/content/home";

const chapterImage: Record<string, { id: string; alt: string }> = {
  backpack: {
    id: "packing-events/img-1865",
    alt: "A student and a volunteer packing blue Touch of Terra backpacks together.",
  },
  students: {
    id: "packing-events/img-9928",
    alt: "Four high-school students in Touch of Terra shirts packing supplies at a Pack-a-Thon.",
  },
};

export default function Home() {
  const hero = getImage("packing-events/img-8277");

  return (
    <>
      {/* Hero — photography-led with a slow parallax drift */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden text-tot-cream">
        <ParallaxImage
          src={hero.src}
          blurDataURL={hero.blurDataURL}
          alt="A Touch of Terra care pack — socks, hygiene items, water, and first aid — laid out beside a blue drawstring backpack, with a high school beyond the window."
          priority
          sizes="100vw"
          strength={80}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tot-ink/90 via-tot-ink/55 to-tot-ink/70" />
        <Container className="relative z-10 flex flex-col items-center text-center">
          <RevealOnScroll className="flex flex-col items-center">
            <Eyebrow className="text-tot-blue-mist">{home.hero.eyebrow}</Eyebrow>
            <DisplayHeading
              as="h1"
              className="mt-6 max-w-4xl whitespace-pre-line drop-shadow-sm"
            >
              {home.hero.title}
            </DisplayHeading>
            <p className="mt-6 max-w-xl text-lg text-tot-cream/85">
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

      <ImpactStats />
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
