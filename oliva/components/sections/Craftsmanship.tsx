"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { brand } from "@/data/brand";
import { projects } from "@/data/projects";
import { Eyebrow } from "@/components/ui/Button";

const details = projects.flatMap((p) => p.details.map((d) => ({ ...d, project: p })));

function DetailCard({ d, index }: { d: (typeof details)[number]; index: number }) {
  return (
    <figure className="w-[78vw] shrink-0 sm:w-[46vw] lg:w-[30vw]">
      <div className="relative aspect-[4/5] overflow-hidden bg-ink">
        <Image
          src={d.src}
          alt={`${d.label} — close-up from OLIVA Project ${d.project.number}`}
          fill
          sizes="(min-width: 1024px) 30vw, 78vw"
          className="object-cover"
          style={{ objectPosition: d.focus, transform: `scale(${d.zoom})`, transformOrigin: d.focus }}
        />
      </div>
      <figcaption className="mt-5 flex items-baseline justify-between gap-4 border-t border-line-light pt-4">
        <span className="font-display text-2xl font-light text-ivory">{d.label}</span>
        <span className="shrink-0 text-[0.6rem] tabular-nums tracking-[0.22em] text-ivory/50">
          {String(index + 1).padStart(2, "0")} · P{d.project.number}
        </span>
      </figcaption>
    </figure>
  );
}

export function Craftsmanship() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -distance]);
  const progress = useTransform(scrollYProgress, [0.05, 0.95], ["0%", "100%"]);

  const intro = (withId: boolean) => (
    <div className="w-[78vw] shrink-0 pr-6 sm:w-[46vw] lg:w-[34vw] lg:pr-16">
      <Eyebrow className="text-ivory/60">Craftsmanship</Eyebrow>
      <h2 id={withId ? "craft-title" : undefined} className="text-display-lg mt-6 text-ivory">
        Details make
        <br />
        <em className="italic">the difference.</em>
      </h2>
      <p className="text-lead mt-6 max-w-sm text-ivory/60">“{brand.detailsLine}”</p>
      <div className="led-line mt-10 w-40" aria-hidden />
    </div>
  );

  return (
    <section ref={ref} aria-labelledby="craft-title" className="on-dark relative bg-ink text-ivory lg:h-[320vh]">
      {/* Desktop: vertical scroll drives a horizontal track */}
      <div className="sticky top-0 hidden h-screen items-center overflow-hidden lg:flex">
        <motion.div ref={track} style={{ x }} className="flex items-center gap-10 pl-[var(--gutter)] pr-[var(--gutter)]">
          {intro(true)}
          {details.map((d, i) => (
            <DetailCard key={`${d.project.slug}-${d.label}`} d={d} index={i} />
          ))}
        </motion.div>
        <div className="absolute inset-x-[var(--gutter)] bottom-10 h-px bg-line-light">
          <motion.div className="h-px bg-ivory" style={{ width: progress }} />
        </div>
      </div>

      {/* Mobile / tablet: native horizontal scroll */}
      <div className="section-y lg:hidden">
        <div className="container-x">{intro(false)}</div>
        <div className="no-scrollbar mt-12 flex scroll-px-[var(--gutter)] snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-2">
          {details.map((d, i) => (
            <div key={`${d.project.slug}-${d.label}`} className="snap-start">
              <DetailCard d={d} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
