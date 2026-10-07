"use client";

import { motion, useScroll } from "motion/react";
import { useRef } from "react";

import { processSteps } from "@/data/content";
import { Button, Eyebrow } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function ProcessTimeline() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });

  return (
    <section id="process" aria-labelledby="process-title" className="section-y">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Eyebrow className="text-terracotta">The OLIVA process · Full service</Eyebrow>
            <h2 id="process-title" className="text-display-lg mt-6 text-espresso">
              From idea to
              <br />
              <em className="italic">final delivery.</em>
            </h2>
            <p className="text-lead mt-6 max-w-md text-muted">
              One team from the first conversation to the finished kitchen: designed by OLIVA’s engineers, made in OLIVA’s own manufacturing.
            </p>
            <div className="mt-10">
              <Button href="#consultation">Start your kitchen</Button>
            </div>
          </div>
        </div>

        <ol ref={ref} className="relative lg:col-span-6 lg:col-start-7">
          <span aria-hidden className="absolute bottom-0 left-[1.1rem] top-0 w-px bg-line" />
          <motion.span aria-hidden className="absolute left-[1.1rem] top-0 w-px origin-top bg-terracotta" style={{ scaleY: scrollYProgress, height: "100%" }} />
          {processSteps.map((s) => (
            <li key={s.number} className="relative pb-14 pl-16 last:pb-0">
              <span className="absolute left-0 top-1 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper text-[0.62rem] font-semibold tabular-nums tracking-[0.1em] text-terracotta">
                {s.number}
              </span>
              <Reveal>
                <h3 className="font-display text-4xl font-light text-espresso">{s.title}</h3>
                <p className="mt-3 max-w-md leading-relaxed text-muted">{s.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
