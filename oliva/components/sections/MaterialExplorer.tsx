"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { brand } from "@/data/brand";
import { materials, type Material } from "@/data/materials";
import { Eyebrow } from "@/components/ui/Button";
import { LineReveal, Reveal } from "@/components/ui/Reveal";

function Macro({ m, sizes }: { m: Material; sizes: string }) {
  return (
    <Image
      src={m.image}
      alt=""
      fill
      sizes={sizes}
      className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-arch)]"
      style={{ objectPosition: m.focus, transform: `scale(${m.zoom})`, transformOrigin: m.focus }}
    />
  );
}

export function MaterialExplorer() {
  const [active, setActive] = useState(0);

  return (
    <section id="materials" aria-labelledby="materials-title" className="section-y">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow className="text-terracotta">Materials · From palette to reality</Eyebrow>
          </div>
          <div className="lg:col-span-8">
            <h2 id="materials-title" className="text-display-lg text-espresso">
              <LineReveal lines={["Materials", <em key="i" className="italic">matter.</em>]} />
            </h2>
            <Reveal>
              <p className="text-lead mt-6 max-w-xl text-muted">“{brand.materialLine}”</p>
            </Reveal>
          </div>
        </div>

        {/* Desktop accordion */}
        <div className="mt-16 hidden h-[min(72vh,640px)] gap-2 lg:flex" role="tablist" aria-label="Materials">
          {materials.map((m, i) => {
            const isActive = i === active;
            return (
              <motion.button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`material-panel-${m.id}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className="group relative h-full overflow-hidden text-left"
                animate={{ flexGrow: isActive ? 6 : 1 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                style={{ flexBasis: 0 }}
              >
                <Macro m={m} sizes="60vw" />
                <div className={`absolute inset-0 transition-colors duration-700 ${isActive ? "bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" : "bg-ink/35"}`} />
                <span className="absolute left-1/2 top-6 -translate-x-1/2 text-[0.6rem] font-semibold tracking-[0.24em] text-ivory">
                  {m.code}
                </span>
                {!isActive && (
                  <span className="absolute bottom-8 left-1/2 origin-center -translate-x-1/2 whitespace-nowrap text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-ivory [writing-mode:vertical-rl] rotate-180">
                    {m.name}
                  </span>
                )}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      id={`material-panel-${m.id}`}
                      className="absolute inset-x-0 bottom-0 p-8 text-ivory"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: 0.35, duration: 0.7 } }}
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    >
                      <p className="text-eyebrow text-ivory/70">
                        {String(i + 1).padStart(2, "0")} / {String(materials.length).padStart(2, "0")} · {m.finish}
                      </p>
                      <h3 className="mt-3 font-display text-5xl font-light">{m.name}</h3>
                      <p className="mt-3 max-w-md text-sm leading-relaxed text-ivory/80">{m.description}</p>
                      <div className="mt-5 flex items-center gap-8 text-[0.66rem] uppercase tracking-[0.2em] text-ivory/70">
                        <span>{m.use}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-6 hidden items-center justify-between text-[0.66rem] uppercase tracking-[0.2em] text-muted lg:flex">
          <p>Close-ups from OLIVA kitchens. Names describe appearance; exact specifications are chosen with OLIVA’s engineers.</p>
          <Link href={`/projects/${materials[active].project}`} className="arrow-link font-semibold text-espresso">
            <span className="u-grow pb-1">Seen in project</span> <span className="arrow">→</span>
          </Link>
        </div>

        {/* Mobile horizontal scroll */}
        <div className="no-scrollbar scroll-px-[var(--gutter)] -mx-[var(--gutter)] mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--gutter)] pb-2 lg:hidden">
          {materials.map((m, i) => (
            <Link key={m.id} href={`/projects/${m.project}`} className="w-[70%] shrink-0 snap-start sm:w-[42%]">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Macro m={m} sizes="70vw" />
                <span className="absolute left-3 top-3 text-[0.6rem] font-semibold tracking-[0.24em] text-ivory">{m.code}</span>
              </div>
              <p className="text-eyebrow mt-4 text-muted">
                {String(i + 1).padStart(2, "0")} · {m.finish}
              </p>
              <h3 className="mt-1 font-display text-2xl text-espresso">{m.name}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{m.description}</p>
            </Link>
          ))}
        </div>
        <p className="mt-6 text-[0.62rem] uppercase leading-relaxed tracking-[0.18em] text-muted lg:hidden">
          Close-ups from OLIVA kitchens. Names describe appearance; exact specifications are chosen with OLIVA’s engineers.
        </p>
      </div>
    </section>
  );
}
