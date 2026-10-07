"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

import { brand } from "@/data/brand";
import { brandWords } from "@/data/content";
import { OlivaLogo } from "@/components/ui/OlivaLogo";

function Word({ word, i, progress }: { word: string; i: number; progress: MotionValue<number> }) {
  const n = brandWords.length;
  const start = 0.12 + (i / n) * 0.6;
  const opacity = useTransform(progress, [start, start + 0.08], [0, 1]);
  const y = useTransform(progress, [start, start + 0.1], [40, 0]);
  return (
    <motion.span style={{ opacity, y }} className="block">
      {word}
      <span className="text-ivory/40">.</span>
    </motion.span>
  );
}

/** Full-screen campaign moment on OLIVA's terracotta plaster */
export function BrandStory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const intro = useTransform(scrollYProgress, [0, 0.1, 0.8, 0.9], [1, 1, 1, 0]);
  const logo = useTransform(scrollYProgress, [0.8, 0.92], [0, 1]);
  const arch = useTransform(scrollYProgress, [0, 1], [1.1, 0.9]);

  return (
    <section ref={ref} aria-label="Every kitchen begins with a space" className="relative h-[260vh]">
      <div className="plaster on-dark sticky top-0 flex h-[100svh] items-center overflow-hidden text-ivory">
        {/* the curved shadow from OLIVA's logo backdrop */}
        <motion.div
          aria-hidden
          style={{ scale: arch }}
          className="absolute -right-[20vw] top-[18%] h-[130vh] w-[90vw] rounded-tl-[50vw] bg-terracotta-deep/35 shadow-[-30px_-10px_60px_rgb(30_10_4/0.35)]"
        />
        <div className="container-x relative grid items-center gap-10 lg:grid-cols-12">
          <motion.div style={{ opacity: intro }} className="lg:col-span-5">
            <p className="text-eyebrow text-ivory/70">OLIVA</p>
            <p className="mt-6 font-display text-[clamp(2rem,4vw,3.6rem)] font-light leading-[1.05]">
              Every kitchen
              <br />
              begins with <em className="italic">a space.</em>
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/70">{brand.bioLine2}</p>
          </motion.div>
          <div className="text-display-xl font-light lg:col-span-6 lg:col-start-7">
            {brandWords.map((w, i) => (
              <Word key={w} word={w} i={i} progress={scrollYProgress} />
            ))}
          </div>
        </div>
        <motion.div style={{ opacity: logo }} className="pointer-events-none absolute inset-0 flex items-center justify-center bg-terracotta/80 backdrop-blur-sm">
          <OlivaLogo descriptor className="h-20 text-ivory sm:h-28 lg:h-36" />
        </motion.div>
      </div>
    </section>
  );
}
