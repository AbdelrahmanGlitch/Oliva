"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { collections } from "@/data/collections";
import { openInStudio } from "@/lib/events";
import { Eyebrow } from "@/components/ui/Button";
import { LineReveal, Reveal } from "@/components/ui/Reveal";

export function CollectionShowcase() {
  const [active, setActive] = useState(0);
  const current = collections[active];

  return (
    <section id="collections" aria-labelledby="collections-title" className="section-y bg-surface">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <Eyebrow className="text-terracotta">Kitchens · Four moods</Eyebrow>
            <h2 id="collections-title" className="text-display-lg mt-6 text-espresso">
              <LineReveal lines={["One way of working.", <em key="i" className="italic">Four characters.</em>]} />
            </h2>
          </div>
          <Reveal className="max-w-sm">
            <p className="text-[0.95rem] leading-relaxed text-muted">
              Every OLIVA kitchen is designed from scratch. These moods group their delivered work by character, as a starting
              point for yours.
            </p>
          </Reveal>
        </div>

        {/* Desktop: index + large swapping image */}
        <div className="mt-16 hidden gap-10 lg:grid lg:grid-cols-12">
          <ul className="lg:col-span-5" role="list">
            {collections.map((c, i) => (
              <li key={c.id} className="border-t border-line last:border-b">
                <div
                  className="group relative py-7"
                  onMouseEnter={() => setActive(i)}
                  onFocusCapture={() => setActive(i)}
                >
                  <Link href={`/projects/${c.project}`} className="flex items-baseline gap-6 outline-none">
                    <span className={`text-[0.68rem] tabular-nums tracking-[0.2em] transition-colors ${i === active ? "text-terracotta" : "text-muted"}`}>
                      {c.number}
                    </span>
                    <span
                      className={`font-display text-[3.2rem] font-light leading-none transition-all duration-700 ease-[var(--ease-arch)] ${
                        i === active ? "translate-x-2 text-espresso" : "text-espresso/35"
                      }`}
                    >
                      {c.name}
                    </span>
                    <span
                      aria-hidden
                      className={`ml-auto text-xl transition-all duration-700 ${i === active ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"}`}
                    >
                      →
                    </span>
                  </Link>
                  <motion.div
                    initial={false}
                    animate={{ height: i === active ? "auto" : 0, opacity: i === active ? 1 : 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden pl-12"
                  >
                    <p className="pt-4 font-display text-xl italic text-terracotta">{c.line}</p>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{c.description}</p>
                    <div className="mt-5 flex items-center gap-6">
                      <Swatches colors={c.swatches} />
                      <button
                        type="button"
                        onClick={() => openInStudio(c.id)}
                        className="arrow-link text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-espresso"
                      >
                        <span className="u-grow pb-1">Try it in 3D</span> <span className="arrow">→</span>
                      </button>
                    </div>
                  </motion.div>
                </div>
              </li>
            ))}
          </ul>

          <div className="relative lg:col-span-7">
            <div className="sticky top-24 aspect-[5/4] w-full overflow-hidden bg-ink">
              <AnimatePresence initial={false}>
                <motion.div
                  key={current.id}
                  className="absolute inset-0"
                  initial={{ clipPath: "inset(0 0 0 100%)" }}
                  animate={{ clipPath: "inset(0 0 0 0%)" }}
                  exit={{ opacity: 0.6 }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div className="absolute inset-0" initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}>
                    <Image src={current.image} alt={current.alt} fill placeholder="blur" sizes="58vw" className="object-cover" />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
              <div className="absolute bottom-0 left-0 flex items-center gap-3 bg-paper px-5 py-3 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-espresso">
                {current.number} / 0{collections.length} · {current.name}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile / tablet: swipeable panels */}
        <div className="no-scrollbar scroll-px-[var(--gutter)] -mx-[var(--gutter)] mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-2 lg:hidden">
          {collections.map((c) => (
            <article key={c.id} className="w-[82%] shrink-0 snap-start sm:w-[55%]">
              <Link href={`/projects/${c.project}`} className="block">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image src={c.image} alt={c.alt} fill placeholder="blur" sizes="(min-width: 640px) 55vw, 82vw" className="object-cover" />
                  <span className="absolute left-0 top-0 bg-paper px-3 py-2 text-[0.6rem] font-semibold tracking-[0.22em] text-espresso">{c.number}</span>
                </div>
                <h3 className="mt-5 font-display text-3xl font-light text-espresso">{c.name}</h3>
                <p className="mt-1 font-display text-lg italic text-terracotta">{c.line}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{c.description}</p>
              </Link>
              <div className="mt-4 flex items-center gap-5">
                <Swatches colors={c.swatches} />
                <button type="button" onClick={() => openInStudio(c.id)} className="text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-espresso">
                  Try it in 3D →
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Swatches({ colors }: { colors: string[] }) {
  return (
    <span className="flex" aria-hidden>
      {colors.map((c) => (
        <span key={c} className="-ml-1 h-5 w-5 rounded-full border border-paper first:ml-0" style={{ background: c }} />
      ))}
    </span>
  );
}
