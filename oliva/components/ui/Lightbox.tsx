"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";

export type LightboxItem = { src: StaticImageData; alt: string; caption: string; focus?: string };

export function Lightbox({
  items,
  index,
  onClose,
  onIndex,
  linkFor,
}: {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
  linkFor?: (i: number) => string;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);
  const open = index !== null;

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    closeRef.current?.focus();
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % items.length);
      if (e.key === "ArrowLeft") onIndex((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, items.length, onClose, onIndex]);

  const item = index !== null ? items[index] : null;

  return (
    <AnimatePresence>
      {item && index !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          className="on-dark fixed inset-0 z-[70] flex flex-col bg-ink/97 text-ivory"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex h-16 items-center justify-between px-[var(--gutter)]">
            <span className="text-[0.66rem] tabular-nums tracking-[0.22em] text-ivory/60">
              {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>
            <button ref={closeRef} type="button" onClick={onClose} className="h-11 px-2 text-[0.66rem] font-semibold uppercase tracking-[0.22em]">
              Close ✕
            </button>
          </div>

          <div className="relative flex-1" onClick={onClose}>
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                className="absolute inset-x-4 inset-y-0 sm:inset-x-24"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image src={item.src} alt={item.alt} fill sizes="100vw" className="object-contain" onClick={(e) => e.stopPropagation()} />
              </motion.div>
            </AnimatePresence>
            {items.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={(e) => {
                    e.stopPropagation();
                    onIndex((index - 1 + items.length) % items.length);
                  }}
                  className="absolute left-2 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center text-2xl text-ivory/80 hover:text-ivory sm:left-6"
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={(e) => {
                    e.stopPropagation();
                    onIndex((index + 1) % items.length);
                  }}
                  className="absolute right-2 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center text-2xl text-ivory/80 hover:text-ivory sm:right-6"
                >
                  →
                </button>
              </>
            )}
          </div>

          <div className="flex min-h-20 flex-col items-start justify-between gap-2 px-[var(--gutter)] py-5 sm:flex-row sm:items-center">
            <p className="font-display text-xl font-light text-ivory/90">{item.caption}</p>
            {linkFor && (
              <Link href={linkFor(index)} onClick={onClose} className="arrow-link text-[0.66rem] font-semibold uppercase tracking-[0.22em]">
                View project <span className="arrow">→</span>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
