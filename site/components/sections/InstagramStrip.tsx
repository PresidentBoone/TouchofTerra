import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { Button } from "@/components/ui/Button";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SmartImage } from "@/components/ui/SmartImage";
import { ORG } from "@/lib/site";
import { home } from "@/content/home";

export const InstagramStrip = () => (
  <Section tone="white">
    <Container>
      <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <RevealOnScroll>
          <Eyebrow>{home.instagram.eyebrow}</Eyebrow>
          <DisplayHeading className="mt-3">
            {home.instagram.title}
          </DisplayHeading>
        </RevealOnScroll>
        <RevealOnScroll>
          <Button href={ORG.instagramUrl} variant="secondary">
            Follow @{ORG.instagramHandle}
          </Button>
        </RevealOnScroll>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {home.instagram.tiles.map((id, i) => (
          <RevealOnScroll key={id} delay={i * 0.05}>
            <a
              href={ORG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden rounded-xl"
            >
              <SmartImage
                id={id}
                alt="Touch of Terra on Instagram"
                sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                className="transition-transform duration-500 ease-out motion-safe:group-hover:scale-110"
              />
              <span className="absolute inset-0 bg-tot-ink/0 transition-colors duration-300 group-hover:bg-tot-ink/15" />
            </a>
          </RevealOnScroll>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-tot-teal/50">
        Live auto-updating feed coming once the Instagram widget is connected.
      </p>
    </Container>
  </Section>
);
