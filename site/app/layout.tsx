import type { Metadata } from "next";
import { type ReactNode } from "react";
import { fraunces, inter } from "@/lib/fonts";
import { LoadScreen } from "@/components/layout/LoadScreen";
import { ServiceWorkerCleanup } from "@/components/layout/ServiceWorkerCleanup";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { ORG } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${ORG.name} — ${ORG.tagline}`,
    template: `%s · ${ORG.name}`,
  },
  description: ORG.mission,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-tot-blue focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <LoadScreen />
        <ServiceWorkerCleanup />
        <LenisProvider>
          <SiteHeader />
          <ScrollProgress />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </LenisProvider>
      </body>
    </html>
  );
}
