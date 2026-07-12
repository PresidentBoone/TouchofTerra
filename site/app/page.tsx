import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { ScrollCue } from "@/components/ui/ScrollCue";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { home } from "@/content/home";

export default function Home() {
  return (
    <>
      {/* Hero — photography-led (gradient placeholder until the media pipeline lands) */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-tot-ink text-tot-cream">
        <div
          className="absolute inset-0 bg-gradient-to-b from-tot-teal via-tot-ink to-tot-ink"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, var(--tot-blue), transparent)",
          }}
          aria-hidden="true"
        />
        <Container className="relative z-10 flex flex-col items-center text-center">
          <Eyebrow className="text-tot-blue-mist">{home.hero.eyebrow}</Eyebrow>
          <DisplayHeading
            as="h1"
            className="mt-6 max-w-4xl whitespace-pre-line"
          >
            {home.hero.title}
          </DisplayHeading>
          <p className="mt-6 max-w-xl text-lg text-tot-cream/80">
            {home.hero.lede}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/donate" size="lg">
              Give a backpack
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
          <ScrollCue className="mt-16 text-tot-cream/70" />
        </Container>
      </section>

      {home.chapters.map((chapter) => {
        const onDark = chapter.tone === "teal" || chapter.tone === "ink";
        return (
          <Section key={chapter.id} tone={chapter.tone}>
            <Container className="max-w-3xl">
              <RevealOnScroll>
                <Eyebrow className={onDark ? "text-tot-blue-mist" : undefined}>
                  {chapter.eyebrow}
                </Eyebrow>
                <DisplayHeading className="mt-5">{chapter.title}</DisplayHeading>
                <p
                  className={cn(
                    "mt-6 text-lg leading-relaxed",
                    onDark ? "text-tot-cream/80" : "text-tot-teal/80",
                  )}
                >
                  {chapter.body}
                </p>
              </RevealOnScroll>
            </Container>
          </Section>
        );
      })}

      <Section tone="ink">
        <Container className="flex max-w-3xl flex-col items-center text-center">
          <RevealOnScroll className="flex flex-col items-center">
            <Eyebrow className="text-tot-blue-mist">{home.join.eyebrow}</Eyebrow>
            <DisplayHeading className="mt-5">{home.join.title}</DisplayHeading>
            <p className="mt-6 max-w-xl text-lg text-tot-cream/80">
              {home.join.body}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button href="/donate" size="lg">
                Donate
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
