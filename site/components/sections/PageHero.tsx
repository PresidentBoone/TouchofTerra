import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

type Props = {
  eyebrow: string;
  title: string;
  lede?: string;
};

/** A consistent dark hero band for inner pages (keeps the fixed nav legible). */
export const PageHero = ({ eyebrow, title, lede }: Props) => (
  <section className="bg-tot-ink pb-16 pt-32 text-tot-cream md:pb-20 md:pt-40">
    <Container className="max-w-3xl">
      <RevealOnScroll>
        <Eyebrow className="text-tot-blue-mist">{eyebrow}</Eyebrow>
        <DisplayHeading as="h1" className="mt-5">
          {title}
        </DisplayHeading>
        {lede ? (
          <p className="mt-6 max-w-2xl text-lg text-tot-cream/85">{lede}</p>
        ) : null}
      </RevealOnScroll>
    </Container>
  </section>
);
