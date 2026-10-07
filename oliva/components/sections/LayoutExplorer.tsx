"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { layouts } from "@/data/content";
import { getProject, type Layout } from "@/data/projects";
import { Button, Eyebrow } from "@/components/ui/Button";
import { LineReveal } from "@/components/ui/Reveal";

type R = [number, number, number, number];

// Plan view, 80px = 1m, cabinet depth 0.6m = 48px
const plans: Record<Layout, { units: R[]; tall?: R[]; island?: R; triangle: [number, number][] }> = {
  "l-shaped": {
    units: [
      [20, 20, 360, 48],
      [20, 68, 48, 200],
    ],
    tall: [[332, 20, 48, 48]],
    island: [120, 170, 190, 72],
    triangle: [
      [44, 180],
      [200, 44],
      [356, 44],
    ],
  },
  "u-shaped": {
    units: [
      [20, 20, 360, 48],
      [20, 68, 48, 212],
      [332, 68, 48, 212],
    ],
    triangle: [
      [44, 200],
      [200, 44],
      [356, 200],
    ],
  },
  island: {
    units: [[20, 20, 260, 48]],
    tall: [[280, 20, 100, 48]],
    island: [90, 160, 220, 80],
    triangle: [
      [140, 44],
      [200, 200],
      [330, 44],
    ],
  },
  parallel: {
    units: [
      [20, 20, 360, 48],
      [20, 232, 360, 48],
    ],
    island: [130, 122, 170, 60],
    triangle: [
      [100, 44],
      [215, 152],
      [300, 256],
    ],
  },
  wall: { units: [[20, 20, 360, 48]], triangle: [] },
};

const ease = [0.22, 1, 0.36, 1] as const;

export function Plan({ id }: { id: Layout }) {
  const p = plans[id];
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label={`Floor plan of a ${id} kitchen`}>
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="rgb(30 23 18 / 0.06)" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="400" height="300" fill="url(#grid)" />
      <motion.rect
        x="10" y="10" width="380" height="280" fill="none" stroke="#1e1712" strokeWidth="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease }}
      />
      {p.units.map((u, i) => (
        <motion.rect
          key={`u${i}`} x={u[0]} y={u[1]} width={u[2]} height={u[3]} fill="#b6ab9f" stroke="#1e1712" strokeWidth="0.8"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease, delay: 0.3 + i * 0.12 }} style={{ transformOrigin: "center", transformBox: "fill-box" }}
        />
      ))}
      {p.tall?.map((u, i) => (
        <motion.rect
          key={`t${i}`} x={u[0]} y={u[1]} width={u[2]} height={u[3]} fill="#6e4a2e" stroke="#1e1712" strokeWidth="0.8"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }}
        />
      ))}
      {p.island && (
        <motion.rect
          x={p.island[0]} y={p.island[1]} width={p.island[2]} height={p.island[3]} fill="#8b4a2f" stroke="#1e1712" strokeWidth="0.8"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.7 }}
        />
      )}
      {p.triangle.length === 3 && (
        <motion.polygon
          points={p.triangle.map((t) => t.join(",")).join(" ")} fill="none" stroke="#8b4a2f" strokeWidth="1.2" strokeDasharray="4 4"
          initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ duration: 0.8, delay: 1 }}
        />
      )}
      {p.triangle.map(([x, y], i) => (
        <motion.circle key={i} cx={x} cy={y} r="4" fill="#1e1712" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.1 + i * 0.1 }} />
      ))}
    </svg>
  );
}

export function LayoutExplorer() {
  const [active, setActive] = useState(0);
  const l = layouts[active];
  const project = getProject(l.project)!;

  return (
    <section aria-labelledby="layout-title" className="section-y">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow className="text-terracotta">Planning · Engineered for your space</Eyebrow>
          </div>
          <h2 id="layout-title" className="text-display-lg text-espresso lg:col-span-8">
            <LineReveal lines={["Find your", <em key="i" className="italic">kitchen layout.</em>]} />
          </h2>
        </div>

        <div role="tablist" aria-label="Kitchen layouts" className="no-scrollbar mt-14 flex gap-2 overflow-x-auto border-b border-line">
          {layouts.map((x, i) => (
            <button
              key={x.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-controls="layout-panel"
              onClick={() => setActive(i)}
              className={`relative shrink-0 px-4 pb-4 pt-2 font-display text-2xl transition-colors sm:text-3xl ${i === active ? "text-espresso" : "text-espresso/35 hover:text-espresso/70"}`}
            >
              {x.name}
              {i === active && <motion.span layoutId="layout-underline" className="absolute inset-x-0 -bottom-px h-px bg-terracotta" />}
            </button>
          ))}
        </div>

        <div id="layout-panel" role="tabpanel" className="mt-12 grid gap-10 lg:grid-cols-12">
          <div className="aspect-[4/3] bg-surface p-4 sm:p-8 lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div key={l.id} className="h-full w-full" exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <Plan id={l.id} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex flex-col lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div key={l.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.6, ease }}>
                <p className="font-display text-3xl font-light leading-snug text-espresso">{l.body}</p>
                <p className="text-eyebrow mt-8 text-muted">Works well for</p>
                <p className="mt-2 text-[0.95rem] text-espresso">{l.bestFor}</p>
                <div className="mt-6 flex flex-wrap gap-5 text-[0.62rem] uppercase tracking-[0.18em] text-muted">
                  <span className="flex items-center gap-2"><i className="h-3 w-3 bg-[#b6ab9f]" /> Units</span>
                  <span className="flex items-center gap-2"><i className="h-3 w-3 bg-walnut" /> Tall units</span>
                  <span className="flex items-center gap-2"><i className="h-3 w-3 bg-terracotta" /> Island</span>
                  <span className="flex items-center gap-2"><i className="h-px w-4 border-t border-dashed border-terracotta" /> Work triangle</span>
                </div>
                <Link href={`/projects/${project.slug}`} className="group mt-8 flex items-center gap-4 border-t border-line pt-6">
                  <span className="relative h-16 w-16 shrink-0 overflow-hidden">
                    <Image src={project.cover.src} alt="" fill sizes="64px" className="object-cover" />
                  </span>
                  <span>
                    <span className="text-eyebrow block text-muted">Seen in OLIVA Project {project.number}</span>
                    <span className="mt-1 block font-display text-xl text-espresso">{project.title} →</span>
                  </span>
                </Link>
              </motion.div>
            </AnimatePresence>
            <div className="mt-auto pt-10">
              <p className="mb-5 text-sm leading-relaxed text-muted">
                Not sure which fits? OLIVA’s engineers plan every kitchen around the location, size and space of your room.
              </p>
              <Button href="#consultation">Talk to a designer</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
