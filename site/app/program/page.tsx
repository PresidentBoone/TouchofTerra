import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { PageHero } from "@/components/sections/PageHero";
import { program } from "@/content/program";

export const metadata: Metadata = {
  title: "The Program",
  description:
    "How Touch of Terra puts high schoolers in charge of real community service — choosing partners, designing care packs, and running events.",
};

export default function ProgramPage() {
  return (
    <>
      <PageHero {...program.hero} />

      {/* Three steps */}
      <Section tone="cream">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            {program.steps.map((step, i) => (
              <RevealOnScroll
                key={step.n}
                delay={i * 0.1}
                className="rounded-2xl bg-tot-white p-8 shadow-[var(--tot-shadow)]"
              >
                <p className="font-display text-5xl text-tot-blue/30">{step.n}</p>
                <h3 className="mt-4 font-display text-2xl text-tot-teal">
                  {step.title}
                </h3>
                <p className="mt-3 leading-relaxed text-tot-teal/75">
                  {step.body}
                </p>
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </Section>

      {/* What it builds */}
      <Section tone="white">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <RevealOnScroll>
              <Eyebrow>{program.teaches.eyebrow}</Eyebrow>
              <DisplayHeading className="mt-5">
                {program.teaches.title}
              </DisplayHeading>
            </RevealOnScroll>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {program.teaches.items.map((item, i) => (
              <RevealOnScroll key={item.title} delay={i * 0.08}>
                <div className="h-px w-10 bg-tot-blue" />
                <h3 className="mt-5 font-display text-xl text-tot-teal">
                  {item.title}
                </h3>
                <p className="mt-2 text-tot-teal/75">{item.body}</p>
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </Section>

      {/* Backpack anatomy */}
      <Section tone="teal">
        <Container>
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
            <RevealOnScroll className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[var(--tot-shadow-lg)]">
              <SmartImage
                id={program.backpack.imageId}
                alt="A Touch of Terra care pack laid out beside a blue drawstring backpack."
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </RevealOnScroll>
            <RevealOnScroll delay={0.1}>
              <Eyebrow className="text-tot-blue-mist">
                {program.backpack.eyebrow}
              </Eyebrow>
              <DisplayHeading className="mt-5">
                {program.backpack.title}
              </DisplayHeading>
              <p className="mt-6 text-lg leading-relaxed text-tot-cream/85">
                {program.backpack.body}
              </p>
              <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3">
                {program.backpack.items.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-tot-cream/90">
                    <span className="h-1.5 w-1.5 rounded-full bg-tot-blue-mist" />
                    {item}
                  </li>
                ))}
              </ul>
            </RevealOnScroll>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section tone="cream">
        <Container className="flex max-w-3xl flex-col items-center text-center">
          <RevealOnScroll className="flex flex-col items-center">
            <DisplayHeading>Bring Touch of Terra to your school.</DisplayHeading>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button href="/get-involved" size="lg">
                Start a chapter
              </Button>
              <Button href="/donate" size="lg" variant="secondary">
                Fund a backpack
              </Button>
            </div>
          </RevealOnScroll>
        </Container>
      </Section>
    </>
  );
}
