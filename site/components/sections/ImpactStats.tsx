import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StatCounter } from "@/components/ui/StatCounter";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { home } from "@/content/home";

export const ImpactStats = () => (
  <Section tone="white" className="py-20 md:py-24">
    <Container>
      <RevealOnScroll className="text-center">
        <Eyebrow>By the numbers</Eyebrow>
      </RevealOnScroll>
      <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
        {home.stats.map((stat, i) => (
          <RevealOnScroll key={stat.label} delay={i * 0.08} className="text-center">
            <div className="font-display text-5xl leading-none text-tot-blue md:text-6xl">
              <StatCounter value={stat.value} suffix={stat.suffix} />
            </div>
            <p className="mx-auto mt-3 max-w-[16ch] text-sm text-tot-teal/70">
              {stat.label}
            </p>
          </RevealOnScroll>
        ))}
      </div>
    </Container>
  </Section>
);
