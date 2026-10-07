"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { brand } from "@/data/brand";
import { projects } from "@/data/projects";
import { Button } from "@/components/ui/Button";

const ease = [0.22, 1, 0.36, 1] as const;
const slides = ["smoked-glass-green-stone", "graphite-oak", "walnut-blush", "greige-fluted-wood"].map(
  (slug) => projects.find((p) => p.slug === slug)!,
);

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6500);
    return () => clearInterval(t);
  }, [reduce, index]);

  const active = slides[index];

  return (
    <section ref={ref} aria-label="Introduction" className="relative h-[100svh] min-h-[640px] overflow-hidden lg:min-h-[760px]">
      {/* Image panel: full-bleed on mobile, right-hand architectural panel on desktop */}
      <motion.div
        className="absolute inset-x-0 bottom-0 top-16 overflow-hidden bg-ink lg:left-auto lg:top-[var(--nav-h)] lg:w-[56%]"
        initial={{ clipPath: "inset(0 0 100% 0)" }}
        animate={{ clipPath: "inset(0 0 0% 0)" }}
        transition={{ duration: 1.6, ease }}
      >
        <motion.div className="absolute inset-0" style={{ scale: imageScale }}>
          <AnimatePresence initial={false}>
            <motion.div
              key={active.slug}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
            >
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: 8, ease: "linear" }}
              >
                <Image
                  src={active.cover.src}
                  alt={active.cover.alt}
                  fill
                  preload={index === 0}
                  placeholder="blur"
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: active.cover.focus }}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* readability on mobile only */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-ink/10 lg:hidden" />

        {/* Slide meta */}
        <div className="absolute inset-x-0 bottom-0 hidden items-end justify-between gap-6 bg-gradient-to-t from-ink/60 to-transparent p-8 text-ivory lg:flex">
          <div>
            <p className="text-eyebrow text-ivory/70">OLIVA Project {active.number}</p>
            <p className="mt-2 font-display text-2xl font-light">{active.title}</p>
          </div>
          <div className="flex items-center gap-3" role="tablist" aria-label="Featured kitchens">
            {slides.map((s, i) => (
              <button
                key={s.slug}
                role="tab"
                aria-selected={i === index}
                aria-label={`Show ${s.title}`}
                onClick={() => setIndex(i)}
                className="group relative h-8 w-12"
              >
                <span className="absolute inset-x-0 top-1/2 h-px bg-ivory/30" />
                {i === index && (
                  <motion.span
                    className="absolute left-0 top-1/2 h-px bg-ivory"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: reduce ? 0 : 6.5, ease: "linear" }}
                  />
                )}
              </button>
            ))}
            <span className="ml-2 text-[0.68rem] tabular-nums tracking-[0.2em] text-ivory/70">
              0{index + 1} / 0{slides.length}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Copy */}
      <motion.div style={{ y: textY }} className="relative z-10 h-full">
        <div className="container-x flex h-full flex-col justify-end pb-24 pt-24 text-ivory lg:justify-center lg:pb-16 lg:pt-[var(--nav-h)] lg:text-espresso">
          <div className="lg:w-[42%] lg:pr-8">
            <motion.p
              className="text-eyebrow flex items-center gap-3 text-ivory/85 lg:text-terracotta"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease, delay: 0.5 }}
            >
              <span aria-hidden className="inline-block h-px w-8 bg-current" />
              OLIVA Kitchens · Made from scratch
            </motion.p>

            <h1 className="mt-6 font-display text-[clamp(3.1rem,5.4vw,6rem)] font-light leading-[0.96] tracking-[-0.02em] lg:mt-8">
              {["Designed", "around the way", "you live."].map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.06em]">
                  <motion.span
                    className="block"
                    initial={{ y: "105%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 1.3, ease, delay: 0.55 + i * 0.1 }}
                  >
                    {i === 2 ? (
                      <>
                        you <em className="font-normal italic lg:text-terracotta">live.</em>
                      </>
                    ) : (
                      line
                    )}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              className="text-lead mt-6 max-w-md text-ivory/85 lg:mt-8 lg:text-muted"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease, delay: 1 }}
            >
              {brand.intro}
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-10 lg:gap-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease, delay: 1.15 }}
            >
              <Button href="#collections" variant="light" className="lg:bg-espresso! lg:text-ivory! lg:hover:bg-terracotta!">
                Explore our kitchens
              </Button>
              <Button
                href="#consultation"
                variant="tertiary"
                className="justify-start text-ivory! lg:text-espresso!"
              >
                Book a consultation
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#vision"
        style={{ opacity: cueOpacity }}
        className="absolute bottom-8 left-[var(--gutter)] z-10 hidden items-center gap-4 text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-muted lg:flex"
      >
        <span className="relative block h-12 w-px overflow-hidden bg-espresso/15">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-terracotta"
            animate={reduce ? undefined : { y: ["-100%", "200%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
        Scroll to explore
      </motion.a>
    </section>
  );
}
