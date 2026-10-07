"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { brand } from "@/data/brand";

/**
 * Mobile: sticky "Book a consultation" bar. Desktop: small "Message OLIVA" tab.
 * OLIVA has no public WhatsApp or phone, so the direct channel is an Instagram message.
 * Hidden at the top of the page and while the consultation form is on screen.
 */
export function ContactDock() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // hide over the consultation form and the footer
    const targets = [document.getElementById("consultation"), document.querySelector("footer")].filter(Boolean) as Element[];
    const visible = new Set<Element>();
    const update = () => setShow(window.scrollY > window.innerHeight * 0.8 && visible.size === 0);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      update();
    });
    targets.forEach((t) => io.observe(t));
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", update);
      io.disconnect();
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            key="mobile"
            className="fixed inset-x-0 bottom-0 z-40 flex gap-px border-t border-line bg-paper/90 p-3 backdrop-blur-xl lg:hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/#consultation"
              className="flex h-12 flex-1 items-center justify-center bg-espresso text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ivory"
            >
              Book a consultation →
            </Link>
            <a
              href={brand.social.instagramDm}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Message OLIVA on Instagram"
              className="ml-2 flex h-12 w-12 items-center justify-center border border-espresso/25"
            >
              <InstagramGlyph />
            </a>
          </motion.div>

          <motion.a
            key="desktop"
            href={brand.social.instagramDm}
            target="_blank"
            rel="noopener noreferrer"
            className="arrow-link fixed bottom-8 right-8 z-40 hidden items-center gap-3 bg-terracotta px-6 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-ivory shadow-[0_20px_40px_-20px_rgb(30_23_18/0.6)] transition-colors hover:bg-espresso lg:inline-flex"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <InstagramGlyph />
            Message OLIVA
            <span className="arrow" aria-hidden>
              →
            </span>
          </motion.a>
        </>
      )}
    </AnimatePresence>
  );
}

export function InstagramGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
