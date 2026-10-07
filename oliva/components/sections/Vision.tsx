"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

import { brand } from "@/data/brand";
import { Eyebrow } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.22em] inline-block">
      {word}
    </motion.span>
  );
}

/** OLIVA's own statement, revealed word by word on scroll */
export function Vision() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = brand.vision.split(" ");

  return (
    <section id="vision" aria-labelledby="vision-title" className="section-y relative">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <Eyebrow className="text-terracotta">The OLIVA vision</Eyebrow>
        </div>
        <div className="lg:col-span-9" ref={ref}>
          <h2 id="vision-title" className="text-display-lg max-w-5xl text-espresso">
            {words.map((w, i) => (
              <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
            ))}
          </h2>
          <div className="mt-14 grid gap-10 border-t border-line pt-10 md:grid-cols-2 lg:mt-20">
            <Reveal>
              <p className="text-lead max-w-md text-muted">{brand.visionBody}</p>
            </Reveal>
            <Reveal delay={0.1} className="flex items-start justify-between gap-8 md:justify-end md:gap-16">
              {["Inspired spaces", "Pure precision"].map((t, i) => (
                <div key={t}>
                  <span className="font-display text-sm italic text-terracotta">0{i + 1}</span>
                  <p className="text-eyebrow mt-2 text-espresso">{t}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
