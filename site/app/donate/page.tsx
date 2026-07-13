import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { PageHero } from "@/components/sections/PageHero";
import { donate } from "@/content/donate";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Fund a Touch of Terra Blue backpack. 100% of your Zeffy gift reaches the mission.",
};

export default function DonatePage() {
  return (
    <>
      <PageHero {...donate.hero} />

      <Section tone="cream">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <RevealOnScroll>
                <Eyebrow>Your impact</Eyebrow>
                <DisplayHeading className="mt-5">Where it goes.</DisplayHeading>
                <ul className="mt-8 space-y-4">
                  {donate.tiers.map((tier) => (
                    <li
                      key={tier.amount}
                      className="flex items-baseline gap-4 rounded-xl bg-tot-white p-5 shadow-[var(--tot-shadow)]"
                    >
                      <span className="font-display text-2xl text-tot-blue">
                        {tier.amount}
                      </span>
                      <span className="text-tot-teal/80">{tier.label}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 rounded-xl bg-tot-sky p-5 text-sm leading-relaxed text-tot-teal/80">
                  <strong className="text-tot-teal">
                    100% reaches the mission.
                  </strong>{" "}
                  We use Zeffy, which charges Touch of Terra zero processing fees —
                  every dollar you give goes straight to the work. (Zeffy asks you
                  for an optional tip to them; it&rsquo;s never required.)
                </div>
              </RevealOnScroll>
            </div>

            <RevealOnScroll
              delay={0.1}
              className="rounded-2xl bg-tot-white p-2 shadow-[var(--tot-shadow-lg)]"
            >
              <iframe
                title="Donation form powered by Zeffy"
                src={donate.zeffyUrl}
                allow="payment"
                className="h-[720px] w-full rounded-xl"
              />
            </RevealOnScroll>
          </div>

          <p className="mx-auto mt-12 max-w-2xl text-center text-sm text-tot-teal/60">
            Prefer to pay by card or Apple Pay, or set up a monthly gift? Branded
            card checkout is coming soon.
          </p>
        </Container>
      </Section>
    </>
  );
}
