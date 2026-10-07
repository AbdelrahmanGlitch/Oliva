"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";

import { getProject } from "@/data/projects";
import { Button, Eyebrow } from "@/components/ui/Button";
import { ImageReveal, LineReveal, Reveal } from "@/components/ui/Reveal";

const project = getProject("smoked-glass-green-stone")!;

// Points placed on the photo (percent of the image frame); labels describe what is visible.
const spots = [
  { x: 30, y: 22, title: "Smoked-glass vitrines", body: "Black-framed glass, lit from within along every shelf." },
  { x: 84, y: 34, title: "Deep green tall units", body: "High-gloss lacquer that reflects the room's light." },
  { x: 40, y: 84, title: "Walnut base units", body: "Handleless walnut beneath a light stone worktop." },
  { x: 13, y: 74, title: "Waterfall edge", body: "The worktop folds down to the floor in one continuous surface." },
  { x: 90, y: 86, title: "Green-veined island", body: "Statement stone wrapping the island, with bar seating." },
];

export function FeaturedKitchen() {
  const [active, setActive] = useState(0);

  return (
    <section aria-labelledby="featured-title" className="on-dark section-y bg-ink text-ivory">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <ImageReveal className="relative aspect-[1080/1185] w-full overflow-hidden">
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
            {spots.map((s, i) => (
              <button
                key={s.title}
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                aria-label={`${i + 1}. ${s.title}`}
                aria-pressed={active === i}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
              >
                <span className="relative flex h-10 w-10 items-center justify-center">
                  <span
                    className={`absolute inset-0 rounded-full border border-ivory/70 transition-transform duration-700 ${
                      active === i ? "scale-100" : "scale-50 opacity-0 group-hover:scale-90 group-hover:opacity-100"
                    }`}
                  />
                  {active === i && (
                    <motion.span
                      className="absolute inset-0 rounded-full border border-ivory/40"
                      animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[0.6rem] font-semibold tabular-nums transition-colors duration-500 ${
                      active === i ? "bg-ivory text-ink" : "bg-ink/60 text-ivory backdrop-blur"
                    }`}
                  >
                    {i + 1}
                  </span>
                </span>
              </button>
            ))}
          </ImageReveal>
        </div>

        <div className="lg:col-span-5 lg:pl-10">
          <Eyebrow className="text-ivory/60">Featured · OLIVA Project {project.number}</Eyebrow>
          <h2 id="featured-title" className="text-display-lg mt-6">
            <LineReveal lines={["Smoked glass,", <em key="e" className="italic">green stone.</em>]} />
          </h2>
          <Reveal>
            <p className="text-lead mt-6 max-w-md text-ivory/65">{project.summary}</p>
          </Reveal>

          <ol className="mt-10 border-t border-line-light">
            {spots.map((s, i) => (
              <li key={s.title} className="border-b border-line-light">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className="flex w-full items-start gap-5 py-4 text-left"
                  aria-expanded={active === i}
                >
                  <span className={`pt-1 text-[0.65rem] tabular-nums tracking-[0.2em] transition-colors ${active === i ? "text-ivory" : "text-ivory/40"}`}>
                    0{i + 1}
                  </span>
                  <span className="flex-1">
                    <span className={`block font-display text-xl transition-colors duration-500 ${active === i ? "text-ivory" : "text-ivory/55"}`}>
                      {s.title}
                    </span>
                    <motion.span
                      initial={false}
                      animate={{ height: active === i ? "auto" : 0, opacity: active === i ? 1 : 0 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="block overflow-hidden text-sm leading-relaxed text-ivory/60"
                    >
                      <span className="block pt-2">{s.body}</span>
                    </motion.span>
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="mt-10">
            <Button href={`/projects/${project.slug}`} variant="outline-light">
              View project
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
