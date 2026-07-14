import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { NAV_ITEMS, ORG } from "@/lib/site";

export const SiteFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-tot-ink text-tot-cream">
      <Container className="pb-28 pt-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl">{ORG.name}</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-tot-cream/70">
              {ORG.mission}
            </p>
            <div className="mt-6">
              <Button href={ORG.donateHref}>Donate</Button>
            </div>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3 text-sm">
            <p className="mb-1 text-xs uppercase tracking-[0.2em] text-tot-cream/50">
              Explore
            </p>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-tot-cream/80 transition-colors hover:text-tot-cream"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3 text-sm">
            <p className="mb-1 text-xs uppercase tracking-[0.2em] text-tot-cream/50">
              Connect
            </p>
            <a
              href={ORG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-tot-cream/80 transition-colors hover:text-tot-cream"
            >
              Instagram
            </a>
            <a
              href={`mailto:${ORG.email}`}
              className="text-tot-cream/80 transition-colors hover:text-tot-cream"
            >
              {ORG.email}
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-1 border-t border-tot-cream/10 pt-6 text-xs text-tot-cream/50 md:flex-row md:justify-between">
          <p>
            © {year} {ORG.name}, Inc.
          </p>
          <p>In loving memory of Terra Boone.</p>
        </div>
      </Container>
    </footer>
  );
};
