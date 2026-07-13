import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { StatCounter } from "@/components/ui/StatCounter";
import { VideoTestimonial } from "@/components/ui/VideoTestimonial";
import { PageHero } from "@/components/sections/PageHero";
import { getVideo, hasVideo } from "@/lib/media";
import { impact } from "@/content/impact";

export const metadata: Metadata = {
  title: "Impact",
  description:
    "The numbers and the neighbors behind Touch of Terra — backpacks given, partners served, and testimonials from the people we've met.",
};

export default function ImpactPage() {
  const videos = impact.testimonial.videos.filter(hasVideo).map(getVideo);

  return (
    <>
      <PageHero {...impact.hero} />

      {/* Stats */}
      <Section tone="white" className="py-20 md:py-24">
        <Container>
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
            {impact.stats.map((stat, i) => (
              <RevealOnScroll
                key={stat.label}
                delay={i * 0.08}
                className="text-center"
              >
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

      {/* Testimonial videos */}
      {videos.length > 0 ? (
        <Section tone="ink">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <RevealOnScroll>
                <Eyebrow className="text-tot-blue-mist">
                  {impact.testimonial.eyebrow}
                </Eyebrow>
                <DisplayHeading className="mt-5">
                  {impact.testimonial.title}
                </DisplayHeading>
                <p className="mt-6 text-lg text-tot-cream/80">
                  {impact.testimonial.body}
                </p>
              </RevealOnScroll>
            </div>
            <div className="mx-auto mt-14 grid max-w-3xl gap-8 sm:grid-cols-2">
              {videos.map((video) => (
                <RevealOnScroll key={video.name}>
                  <VideoTestimonial
                    mp4={video.video.mp4}
                    poster={video.video.poster}
                    className="mx-auto max-w-xs"
                  />
                </RevealOnScroll>
              ))}
            </div>
            <p className="mt-8 text-center text-xs text-tot-cream/50">
              Muted while you watch — hover or tap to hear their story. Shared
              with permission.
            </p>
          </Container>
        </Section>
      ) : null}

      {/* Partners */}
      <Section tone="cream">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <RevealOnScroll>
              <Eyebrow>{impact.partners.eyebrow}</Eyebrow>
              <DisplayHeading className="mt-5">
                {impact.partners.title}
              </DisplayHeading>
              <p className="mt-6 text-lg text-tot-teal/75">
                {impact.partners.body}
              </p>
            </RevealOnScroll>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-3">
            {impact.partners.items.map((partner, i) => (
              <RevealOnScroll
                key={partner.name}
                delay={i * 0.1}
                className="rounded-2xl bg-tot-white p-8 shadow-[var(--tot-shadow)]"
              >
                <h3 className="font-display text-xl text-tot-teal">
                  {partner.name}
                </h3>
                <p className="mt-2 text-tot-teal/75">{partner.blurb}</p>
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section tone="ink">
        <Container className="flex max-w-3xl flex-col items-center text-center">
          <RevealOnScroll className="flex flex-col items-center">
            <DisplayHeading>Be part of the next number.</DisplayHeading>
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
