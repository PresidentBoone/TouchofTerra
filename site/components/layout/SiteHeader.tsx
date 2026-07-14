"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_ITEMS, ORG } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export const SiteHeader = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const onDark = !scrolled && !open;
  const barBg = open
    ? "bg-transparent"
    : scrolled
      ? "bg-tot-cream/80 backdrop-blur-md shadow-[var(--tot-shadow)]"
      : "bg-gradient-to-b from-black/25 to-transparent";
  const textColor = onDark ? "text-tot-cream" : "text-tot-teal";
  const lineColor = onDark ? "bg-tot-cream" : "bg-tot-teal";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        barBg,
      )}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-6 py-4 md:px-8">
        <Link href="/" aria-label="Touch of Terra, home" className="flex items-center gap-2.5">
          <Image
            src="/brand/backpack-logo.webp"
            alt=""
            width={288}
            height={303}
            priority
            className="h-12 w-auto drop-shadow-md"
          />
          <span
            className={cn(
              "font-display text-lg font-semibold uppercase leading-[0.92] tracking-tight transition-colors",
              textColor,
            )}
          >
            <span className="block">Touch</span>
            <span className="block">Of Terra</span>
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className={cn("hidden items-center gap-6 lg:flex", textColor)}
        >
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative text-sm font-medium text-current/80 transition-colors hover:text-current"
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-px bg-tot-blue transition-all duration-300",
                    active ? "w-full" : "w-0 group-hover:w-full",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Button href={ORG.donateHref}>Donate</Button>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative h-6 w-6 lg:hidden"
        >
          <span
            className={cn(
              "absolute left-0 top-1/2 h-[2px] w-6 transition-all duration-300",
              lineColor,
              open ? "rotate-45" : "-translate-y-[6px]",
            )}
          />
          <span
            className={cn(
              "absolute left-0 top-1/2 h-[2px] w-6 transition-opacity duration-300",
              lineColor,
              open ? "opacity-0" : "opacity-100",
            )}
          />
          <span
            className={cn(
              "absolute left-0 top-1/2 h-[2px] w-6 transition-all duration-300",
              lineColor,
              open ? "-rotate-45" : "translate-y-[6px]",
            )}
          />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 -z-10 flex flex-col justify-center gap-1 bg-tot-cream px-8 pb-[env(safe-area-inset-bottom)] pt-24 lg:hidden"
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 + i * 0.05, duration: 0.3 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block py-2 font-display text-3xl transition-colors",
                    pathname === item.href ? "text-tot-blue" : "text-tot-teal",
                  )}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 + NAV_ITEMS.length * 0.05, duration: 0.3 }}
              className="mt-8"
            >
              <Button
                href={ORG.donateHref}
                size="lg"
                onClick={() => setOpen(false)}
              >
                Donate
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
