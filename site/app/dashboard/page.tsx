import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { StatCounter } from "@/components/ui/StatCounter";
import { PageHero } from "@/components/sections/PageHero";
import { TrendBars } from "@/components/dashboard/TrendBars";
import { dashboard } from "@/content/dashboard";

export const metadata: Metadata = {
  title: "The Need",
  description:
    "Real Louisville homelessness data — why Touch of Terra's work matters, with sources.",
};

export default function DashboardPage() {
  return (
    <>
      <PageHero {...dashboard.hero} />

      {/* Key figures */}
      <Section tone="white">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dashboard.stats.map((stat, i) => (
              <RevealOnScroll
                key={stat.label}
                delay={i * 0.08}
                className="flex flex-col rounded-2xl bg-tot-cream p-8 text-center shadow-[var(--tot-shadow)]"
              >
                <div className="font-display text-4xl text-tot-blue md:text-5xl">
                  <StatCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="mt-3 flex-1 text-sm text-tot-teal/80">
                  {stat.label}
                </p>
                <p className="mt-4 text-[0.7rem] uppercase tracking-[0.12em] text-tot-teal/40">
                  {stat.note}
                </p>
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </Section>

      {/* Unsheltered trend */}
      <Section tone="cream">
        <Container className="max-w-3xl">
          <div className="text-center">
            <RevealOnScroll>
              <Eyebrow>{dashboard.unsheltered.eyebrow}</Eyebrow>
              <DisplayHeading className="mt-5">
                {dashboard.unsheltered.title}
              </DisplayHeading>
              <p className="mt-6 text-lg text-tot-teal/75">
                {dashboard.unsheltered.body}
              </p>
            </RevealOnScroll>
          </div>
          <div className="mt-16">
            <TrendBars
              points={dashboard.unsheltered.points}
              max={dashboard.unsheltered.max}
            />
          </div>
          <p className="mt-10 text-center text-[0.7rem] uppercase tracking-[0.12em] text-tot-teal/40">
            {dashboard.unsheltered.note}
          </p>
        </Container>
      </Section>

      {/* Tie-in */}
      <Section tone="teal">
        <Container className="flex max-w-3xl flex-col items-center text-center">
          <RevealOnScroll className="flex flex-col items-center">
            <DisplayHeading>{dashboard.context.title}</DisplayHeading>
            <p className="mt-6 text-lg leading-relaxed text-tot-cream/85">
              {dashboard.context.body}
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

      {/* Sources */}
      <Section tone="white" className="py-16 md:py-20">
        <Container className="max-w-3xl text-center">
          <Eyebrow>Sources</Eyebrow>
          <p className="mx-auto mt-4 max-w-xl text-sm text-tot-teal/70">
            {dashboard.updatedNote}
          </p>
          <ul className="mt-6 flex flex-col items-center gap-2 text-sm">
            {dashboard.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-tot-blue underline underline-offset-4 transition-colors hover:text-tot-blue-deep"
                >
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
