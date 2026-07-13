import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { PageHero } from "@/components/sections/PageHero";
import { events } from "@/content/events";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Student-led pack-a-thons and community distributions from Touch of Terra.",
};

export default function EventsPage() {
  return (
    <>
      <PageHero {...events.hero} />

      {/* Upcoming */}
      <Section tone="cream">
        <Container className="max-w-3xl text-center">
          <RevealOnScroll className="flex flex-col items-center rounded-3xl bg-tot-white p-10 shadow-[var(--tot-shadow)] md:p-14">
            <Eyebrow>{events.upcoming.eyebrow}</Eyebrow>
            <DisplayHeading className="mt-5">
              {events.upcoming.title}
            </DisplayHeading>
            <p className="mt-6 max-w-xl text-lg text-tot-teal/75">
              {events.upcoming.body}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/get-involved" size="lg">
                Host or join an event
              </Button>
            </div>
          </RevealOnScroll>
        </Container>
      </Section>

      {/* Past events */}
      <Section tone="white">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <RevealOnScroll>
              <Eyebrow>{events.past.eyebrow}</Eyebrow>
              <DisplayHeading className="mt-5">
                {events.past.title}
              </DisplayHeading>
            </RevealOnScroll>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {events.past.items.map((item, i) => (
              <RevealOnScroll key={item.title} delay={i * 0.1} className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[var(--tot-shadow)]">
                  <SmartImage
                    id={item.imageId}
                    alt={item.title}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-5 font-display text-xl text-tot-teal">
                  {item.title}
                </h3>
                <p className="mt-2 text-tot-teal/75">{item.body}</p>
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </Section>

      {/* Gallery */}
      <Section tone="cream">
        <Container>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {events.gallery.map((id, i) => (
              <RevealOnScroll
                key={id}
                delay={i * 0.05}
                className="group relative aspect-square overflow-hidden rounded-xl"
              >
                <SmartImage
                  id={id}
                  alt="A moment from a Touch of Terra event."
                  sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                  className="transition-transform duration-500 ease-out motion-safe:group-hover:scale-110"
                />
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
