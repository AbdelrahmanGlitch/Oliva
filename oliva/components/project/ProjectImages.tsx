"use client";

import Image from "next/image";
import { useState } from "react";

import type { Project } from "@/data/projects";
import { Lightbox } from "@/components/ui/Lightbox";
import { ImageReveal } from "@/components/ui/Reveal";

/** Gallery + close-ups for a project page; every image opens the lightbox */
export function ProjectImages({ project }: { project: Project }) {
  const [open, setOpen] = useState<number | null>(null);
  const items = [
    ...project.gallery.map((g, i) => ({ src: g.src, alt: g.alt, caption: `${project.title} — view ${i + 1}`, focus: g.focus })),
    ...project.details.map((d) => ({ src: d.src, alt: `${d.label}, ${project.title}`, caption: `${project.title} — ${d.label}` })),
  ];

  return (
    <>
      {project.gallery.length > 1 && (
        <div className="grid gap-4 md:grid-cols-2">
          {project.gallery.map((g, i) => (
            <button key={i} type="button" onClick={() => setOpen(i)} className="group relative block aspect-[4/5] overflow-hidden" aria-label={`Enlarge: ${g.alt}`}>
              <ImageReveal className="absolute inset-0" delay={i * 0.1}>
                <Image src={g.src} alt={g.alt} fill placeholder="blur" sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
              </ImageReveal>
            </button>
          ))}
        </div>
      )}

      {project.details.length > 0 && (
        <div className="mt-24">
          <p className="text-eyebrow text-terracotta">Close-up craftsmanship</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {project.details.map((d, i) => (
              <button
                key={d.label}
                type="button"
                onClick={() => setOpen(project.gallery.length + i)}
                className="group text-left"
                aria-label={`Enlarge: ${d.label}`}
              >
                <span className="relative block aspect-square overflow-hidden bg-ink">
                  <Image
                    src={d.src}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover"
                    style={{ objectPosition: d.focus, transform: `scale(${d.zoom})`, transformOrigin: d.focus }}
                  />
                </span>
                <span className="mt-4 flex items-baseline justify-between border-t border-line pt-3">
                  <span className="font-display text-xl text-espresso">{d.label}</span>
                  <span className="text-[0.6rem] tabular-nums tracking-[0.2em] text-muted">0{i + 1}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <Lightbox items={items} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </>
  );
}
