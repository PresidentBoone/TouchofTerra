import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { ContactForm, type FormField } from "@/components/ui/ContactForm";
import { PageHero } from "@/components/sections/PageHero";
import { getInvolved } from "@/content/get-involved";

export const metadata: Metadata = {
  title: "Get Involved",
  description:
    "Students, schools, partner organizations, and volunteers — find your way to serve with Touch of Terra.",
};

const fields: FormField[] = [
  { name: "name", label: "Your name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "role", label: "I'm reaching out as (student, school, partner, volunteer)" },
  { name: "message", label: "How would you like to help?", textarea: true, required: true },
];

export default function GetInvolvedPage() {
  return (
    <>
      <PageHero {...getInvolved.hero} />

      <Section tone="cream">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            {getInvolved.paths.map((path, i) => (
              <RevealOnScroll
                key={path.title}
                delay={i * 0.1}
                className="flex flex-col rounded-2xl bg-tot-white p-8 shadow-[var(--tot-shadow)]"
              >
                <h3 className="font-display text-2xl text-tot-teal">
                  {path.title}
                </h3>
                <p className="mt-3 flex-1 leading-relaxed text-tot-teal/75">
                  {path.body}
                </p>
                <div className="mt-6">
                  <Button href={path.href} variant="secondary">
                    {path.cta}
                  </Button>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="white" className="scroll-mt-24" id="connect">
        <Container className="max-w-2xl">
          <RevealOnScroll>
            <Eyebrow>{getInvolved.form.eyebrow}</Eyebrow>
            <DisplayHeading className="mt-5">
              {getInvolved.form.title}
            </DisplayHeading>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1} className="mt-10">
            <ContactForm fields={fields} context="get-involved" />
          </RevealOnScroll>
        </Container>
      </Section>
    </>
  );
}
