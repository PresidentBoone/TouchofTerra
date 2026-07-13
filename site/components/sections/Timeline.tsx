import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { ourStory } from "@/content/our-story";

export const Timeline = () => (
  <Section tone="cream">
    <Container className="max-w-3xl">
      <RevealOnScroll className="text-center">
        <Eyebrow>{ourStory.journey.eyebrow}</Eyebrow>
        <DisplayHeading className="mt-5">
          {ourStory.journey.title}
        </DisplayHeading>
      </RevealOnScroll>

      <ol className="relative mt-16 border-l border-tot-stone/40 pl-8">
        {ourStory.journey.milestones.map((milestone, i) => (
          <li key={milestone.date} className="relative pb-12 last:pb-0">
            <span
              aria-hidden="true"
              className="absolute -left-[2.15rem] top-1 h-4 w-4 rounded-full bg-tot-blue ring-4 ring-tot-cream"
            />
            <RevealOnScroll delay={i * 0.05}>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-tot-blue">
                {milestone.date}
              </p>
              <h3 className="mt-1 font-display text-2xl text-tot-teal">
                {milestone.title}
              </h3>
              <p className="mt-2 leading-relaxed text-tot-teal/75">
                {milestone.body}
              </p>
            </RevealOnScroll>
          </li>
        ))}
      </ol>
    </Container>
  </Section>
);
