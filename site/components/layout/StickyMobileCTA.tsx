"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

/**
 * A persistent mobile-only action bar so "Fund a backpack" is always one tap
 * away. Appears once the visitor scrolls past the hero; hidden on the donate
 * page itself.
 */
export const StickyMobileCTA = () => {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hidden = pathname === "/donate";

  return (
    <AnimatePresence>
      {show && !hidden && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-x-0 bottom-0 z-40 flex gap-3 border-t border-tot-stone/20 bg-tot-cream/90 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:hidden"
        >
          <Link
            href="/get-involved"
            className="flex flex-1 items-center justify-center rounded-full border border-tot-teal/25 py-3 text-sm font-medium text-tot-teal"
          >
            Get involved
          </Link>
          <Link
            href="/donate"
            className="flex flex-[1.4] items-center justify-center rounded-full bg-tot-blue py-3 text-sm font-semibold text-white shadow-[var(--tot-shadow)]"
          >
            Fund a backpack
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
