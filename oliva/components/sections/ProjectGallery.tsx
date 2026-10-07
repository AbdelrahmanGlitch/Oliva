"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useState } from "react";

import { projects } from "@/data/projects";
import { Eyebrow } from "@/components/ui/Button";
import { LineReveal, Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "./ProjectCard";

// Editorial placement on a 12-column grid (desktop)
const placement = [
  { cls: "lg:col-span-7", aspect: "aspect-[1080/1185]" },
  { cls: "lg:col-span-5 lg:mt-40", aspect: "aspect-[4/5]" },
  { cls: "lg:col-span-5 lg:col-start-1", aspect: "aspect-[4/5]" },
  { cls: "lg:col-span-6 lg:col-start-7 lg:mt-16", aspect: "aspect-[1080/930]" },
  { cls: "lg:col-span-4 lg:col-start-2", aspect: "aspect-square" },
  { cls: "lg:col-span-4 lg:mt-24", aspect: "aspect-square" },
  { cls: "lg:col-span-3 lg:mt-48", aspect: "aspect-[4/5]" },
];

export function ProjectGallery() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 300, damping: 30 });
  const sy = useSpring(y, { stiffness: 300, damping: 30 });
  const [hover, setHover] = useState(false);

  return (
    <section id="projects" aria-labelledby="projects-title" className="section-y relative">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow className="text-terracotta">Projects · {projects.length} kitchens</Eyebrow>
          </div>
          <div className="lg:col-span-8">
            <h2 id="projects-title" className="text-display-lg text-espresso">
              <LineReveal lines={["Spaces we’ve", <em key="i" className="italic">designed.</em>]} />
            </h2>
            <Reveal>
              <p className="text-lead mt-6 max-w-xl text-muted">
                Real OLIVA kitchens, recently completed and delivered. “Another OLIVA kitchen is complete and ready for its home.”
              </p>
            </Reveal>
          </div>
        </div>

        {/* Desktop editorial grid */}
        <div
          className="relative mt-20 hidden gap-x-10 gap-y-20 lg:grid lg:grid-cols-12"
          onPointerMove={(e) => {
            x.set(e.clientX);
            y.set(e.clientY);
            setHover(!!(e.target as HTMLElement).closest("[data-cursor]"));
          }}
          onPointerLeave={() => setHover(false)}
        >
          {projects.map((p, i) => (
            <Reveal key={p.slug} className={placement[i]?.cls} delay={(i % 2) * 0.1}>
              <ProjectCard project={p} total={projects.length} aspect={placement[i]?.aspect} sizes="(min-width: 1024px) 50vw, 85vw" />
            </Reveal>
          ))}
        </div>

        {/* Mobile swipeable cards */}
        <div className="no-scrollbar scroll-px-[var(--gutter)] -mx-[var(--gutter)] mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-2 lg:hidden">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} total={projects.length} className="w-[84%] shrink-0 snap-start sm:w-[48%]" />
          ))}
        </div>
      </div>

      {/* Custom "View" cursor (desktop, fine pointers only) */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-50 hidden h-24 w-24 items-center justify-center rounded-full bg-terracotta text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-ivory [@media(pointer:fine)]:lg:flex"
        style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: hover ? 1 : 0, opacity: hover ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        View
      </motion.div>
    </section>
  );
}
