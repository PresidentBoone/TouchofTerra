import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SmartImage } from "@/components/ui/SmartImage";
import { home } from "@/content/home";

export const RealMoments = () => (
  <Section tone="cream">
    <Container>
      <div className="mx-auto max-w-2xl text-center">
        <RevealOnScroll>
          <Eyebrow>{home.moments.eyebrow}</Eyebrow>
          <DisplayHeading className="mt-5">{home.moments.title}</DisplayHeading>
          <p className="mt-6 text-lg leading-relaxed text-tot-teal/80">
            {home.moments.body}
          </p>
        </RevealOnScroll>
      </div>
      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {home.moments.photos.map((photo, i) => (
          <RevealOnScroll
            key={photo.id}
            delay={i * 0.1}
            className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[var(--tot-shadow-lg)] sm:aspect-[4/3]"
          >
            <SmartImage
              id={photo.id}
              alt={photo.alt}
              sizes="(min-width: 640px) 50vw, 100vw"
              className="transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
            />
          </RevealOnScroll>
        ))}
      </div>
    </Container>
  </Section>
);
