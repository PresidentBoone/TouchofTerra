import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { ContactForm, type FormField } from "@/components/ui/ContactForm";
import { PageHero } from "@/components/sections/PageHero";
import { ORG } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Touch of Terra.",
};

const fields: FormField[] = [
  { name: "name", label: "Your name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "message", label: "Message", textarea: true, required: true },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Say hello."
        lede="Questions, partnerships, press, or just want to help, we'd love to hear from you."
      />
      <Section tone="cream">
        <Container>
          <div className="grid gap-12 md:grid-cols-[0.8fr_1fr] md:gap-16">
            <RevealOnScroll>
              <Eyebrow>Reach us</Eyebrow>
              <DisplayHeading className="mt-5">Let&rsquo;s talk.</DisplayHeading>
              <dl className="mt-8 space-y-6">
                <div>
                  <dt className="text-xs uppercase tracking-[0.15em] text-tot-blue">
                    Email
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${ORG.email}`}
                      className="text-tot-teal transition-colors hover:text-tot-blue"
                    >
                      {ORG.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.15em] text-tot-blue">
                    Instagram
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={ORG.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-tot-teal transition-colors hover:text-tot-blue"
                    >
                      @{ORG.instagramHandle}
                    </a>
                  </dd>
                </div>
              </dl>
            </RevealOnScroll>
            <RevealOnScroll
              delay={0.1}
              className="rounded-2xl bg-tot-white p-8 shadow-[var(--tot-shadow)]"
            >
              <ContactForm fields={fields} context="contact" />
            </RevealOnScroll>
          </div>
        </Container>
      </Section>
    </>
  );
}
