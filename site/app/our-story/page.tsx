import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { Timeline } from "@/components/sections/Timeline";
import { ORG } from "@/lib/site";
import { ourStory } from "@/content/our-story";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Touch of Terra began with Terra Boone's quiet kindness and continues through the students who carry it forward.",
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("");

export default function OurStoryPage() {
  return (
    <>
      {/* Reverent dark hero — keeps the nav legible and sets a memorial tone */}
      <section className="bg-tot-ink pb-20 pt-32 text-tot-cream md:pb-28 md:pt-40">
        <Container>
          <div className="grid items-center gap-12 md:grid-cols-[0.85fr_1fr] md:gap-16">
            <RevealOnScroll className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl shadow-[var(--tot-shadow-lg)]">
              <SmartImage
                id="terra-photos/img-1375"
                alt="A portrait of Terra Boone."
                sizes="(min-width: 768px) 40vw, 90vw"
                priority
              />
            </RevealOnScroll>
            <RevealOnScroll delay={0.1}>
              <Eyebrow className="text-tot-blue-mist">
                {ourStory.hero.eyebrow}
              </Eyebrow>
              <DisplayHeading as="h1" className="mt-6">
                {ourStory.hero.title}
              </DisplayHeading>
              <p className="mt-6 max-w-xl text-lg text-tot-cream/85">
                {ourStory.hero.lede}
              </p>
            </RevealOnScroll>
          </div>
        </Container>
      </section>

      {/* Legacy of Terra */}
      <Section tone="cream">
        <Container>
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
            <RevealOnScroll>
              <Eyebrow>{ourStory.legacy.eyebrow}</Eyebrow>
              <DisplayHeading className="mt-5">
                {ourStory.legacy.title}
              </DisplayHeading>
              {ourStory.legacy.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 24)}
                  className="mt-6 text-lg leading-relaxed text-tot-teal/80"
                >
                  {paragraph}
                </p>
              ))}
            </RevealOnScroll>
            <RevealOnScroll
              delay={0.1}
              className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl shadow-[var(--tot-shadow-lg)]"
            >
              <SmartImage
                id="terra-photos/terra-002"
                alt="Terra Boone smiling while mountaineering, wearing a red climbing helmet."
                sizes="(min-width: 768px) 40vw, 90vw"
              />
            </RevealOnScroll>
          </div>

          <figure className="mx-auto mt-20 max-w-3xl text-center">
            <blockquote className="font-display text-2xl leading-snug text-tot-teal md:text-[2rem]">
              &ldquo;{ourStory.legacy.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 text-xs uppercase tracking-[0.2em] text-tot-blue">
              {ourStory.legacy.attribution}
            </figcaption>
          </figure>
        </Container>
      </Section>

      {/* Founder */}
      <Section tone="teal">
        <Container>
          <div className="grid items-center gap-12 md:grid-cols-[1fr_0.85fr] md:gap-16">
            <RevealOnScroll>
              <Eyebrow className="text-tot-blue-mist">
                {ourStory.founder.eyebrow}
              </Eyebrow>
              <DisplayHeading className="mt-5">
                {ourStory.founder.name}
              </DisplayHeading>
              <p className="mt-2 text-sm uppercase tracking-[0.2em] text-tot-cream/60">
                {ourStory.founder.role}
              </p>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-tot-cream/85">
                {ourStory.founder.body}
              </p>
              <div className="mt-8">
                <Button
                  href={ORG.instagramUrl}
                  variant="secondary"
                  className="border-tot-cream/40 text-tot-cream hover:border-tot-cream hover:bg-tot-cream/10"
                >
                  Follow on Instagram
                </Button>
              </div>
            </RevealOnScroll>
            <RevealOnScroll
              delay={0.1}
              className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl shadow-[var(--tot-shadow-lg)]"
            >
              <SmartImage
                id="dylon-founder-photos/dylon-021"
                alt="DyLon Boone, founder of Touch of Terra."
                sizes="(min-width: 768px) 40vw, 90vw"
              />
            </RevealOnScroll>
          </div>
        </Container>
      </Section>

      <Timeline />

      {/* Board */}
      <Section tone="white">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <RevealOnScroll>
              <Eyebrow>{ourStory.board.eyebrow}</Eyebrow>
              <DisplayHeading className="mt-5">
                {ourStory.board.title}
              </DisplayHeading>
            </RevealOnScroll>
          </div>
          <div className="mx-auto mt-14 grid max-w-3xl gap-10 sm:grid-cols-3">
            {ourStory.board.members.map((member, i) => (
              <RevealOnScroll
                key={member.name}
                delay={i * 0.08}
                className="flex flex-col items-center text-center"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-tot-sky font-display text-2xl text-tot-teal">
                  {initials(member.name)}
                </div>
                <p className="mt-5 font-display text-xl text-tot-teal">
                  {member.name}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.15em] text-tot-blue">
                  {member.role}
                </p>
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section tone="ink">
        <Container className="flex max-w-3xl flex-col items-center text-center">
          <RevealOnScroll className="flex flex-col items-center">
            <DisplayHeading className="mt-2">
              Carry Terra&rsquo;s kindness forward.
            </DisplayHeading>
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
          </RevealOnScroll>
        </Container>
      </Section>
    </>
  );
}
