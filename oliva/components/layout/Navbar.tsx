"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { brand, navigation } from "@/data/brand";
import { OlivaLogo } from "@/components/ui/OlivaLogo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,height,border-color,backdrop-filter] duration-700 ease-[var(--ease-arch)] ${
          scrolled
            ? "h-16 border-b border-line bg-paper/85 backdrop-blur-xl"
            : "h-16 border-b border-transparent bg-paper lg:h-[var(--nav-h)] lg:bg-transparent"
        }`}
      >
        <nav aria-label="Main" className="container-x flex h-full items-center justify-between gap-6">
          <Link href="/" aria-label="OLIVA — home" className="flex h-full items-center text-espresso">
            <OlivaLogo className={`transition-[height] duration-700 ${scrolled ? "h-5" : "h-5 lg:h-7"}`} />
          </Link>

          <ul className="hidden items-center gap-[clamp(1.25rem,2.4vw,2.6rem)] lg:flex">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="u-grow pb-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-espresso/80 transition-colors hover:text-espresso"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Link
              href="/#consultation"
              className="arrow-link hidden h-11 items-center gap-3 bg-espresso px-6 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors duration-500 hover:bg-terracotta sm:inline-flex"
            >
              Book a consultation <span aria-hidden className="arrow">→</span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="flex h-11 items-center gap-3 px-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] lg:hidden"
            >
              Menu
              <span aria-hidden className="flex w-6 flex-col gap-[5px]">
                <span className="h-px w-full bg-espresso" />
                <span className="h-px w-2/3 self-end bg-espresso" />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="plaster on-dark fixed inset-0 z-[60] flex flex-col text-ivory"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="container-x flex h-16 items-center justify-between">
              <OlivaLogo className="h-5" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-11 px-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em]"
                autoFocus
              >
                Close ✕
              </button>
            </div>
            <ul className="container-x mt-10 flex flex-col">
              {navigation.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-line-light"
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between py-4 font-display text-[2.4rem] font-light leading-none"
                  >
                    {item.label}
                    <span className="font-sans text-[0.65rem] tracking-[0.2em] opacity-60">0{i + 1}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="container-x mt-auto flex flex-col gap-3 pb-10">
              <Link
                href="/#consultation"
                onClick={() => setOpen(false)}
                className="flex h-14 items-center justify-center bg-ivory text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-espresso"
              >
                Book a consultation →
              </Link>
              <p className="text-center text-[0.7rem] uppercase tracking-[0.22em] opacity-70">
                {brand.location.name} · {brand.location.area}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
