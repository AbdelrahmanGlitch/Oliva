"use client";

import Image from "next/image";
import { useState } from "react";

import { brand } from "@/data/brand";
import { projects } from "@/data/projects";
import { extraImages } from "@/data/projects";
import { Button, Eyebrow } from "@/components/ui/Button";
import { LineReveal } from "@/components/ui/Reveal";
import { Lightbox, type LightboxItem } from "@/components/ui/Lightbox";

const items: (LightboxItem & { slug: string })[] = [
  ...projects.map((p) => ({ src: p.cover.src, alt: p.cover.alt, caption: `OLIVA Project ${p.number} — ${p.title}`, slug: p.slug, focus: p.cover.focus })),
  { src: extraImages.walnutPanels, alt: "Flush walnut-finish panels in an OLIVA kitchen", caption: "From palette to reality — walnut", slug: "walnut-wall-vitrine" },
];

// 4 tall + 4 square tiles fill a 4×3 grid exactly (and 2×6 on mobile)
const spans = ["row-span-2", "", "", "row-span-2", "", "row-span-2", "row-span-2", ""];

export function SocialGallery() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section aria-labelledby="social-title" className="section-y">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <Eyebrow className="text-terracotta">{brand.social.instagram.handle}</Eyebrow>
            <h2 id="social-title" className="text-display-lg mt-6 text-espresso">
              <LineReveal lines={["Follow", <em key="i" className="italic">the work.</em>]} />
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href={brand.social.instagram.url} external>
              Follow on Instagram
            </Button>
            <Button href={brand.social.facebook.url} external variant="secondary">
              Facebook
            </Button>
          </div>
        </div>

        <div className="mt-14 grid grid-flow-dense auto-rows-[38vw] grid-cols-2 gap-2 sm:auto-rows-[24vw] sm:grid-cols-3 lg:auto-rows-[16vw] lg:grid-cols-4 lg:gap-3">
          {items.map((it, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setOpen(i)}
              className={`group relative overflow-hidden bg-stone ${spans[i] ?? ""}`}
              aria-label={`Open image: ${it.caption}`}
            >
              <Image
                src={it.src}
                alt={it.alt}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-arch)] group-hover:scale-105"
                style={{ objectPosition: it.focus }}
              />
              <span className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 via-transparent to-transparent p-4 text-left opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                <span>
                  <span className="block text-[0.6rem] uppercase tracking-[0.2em] text-ivory/70">{it.caption}</span>
                  <span className="mt-1 block text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-ivory">View →</span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <Lightbox items={items} index={open} onClose={() => setOpen(null)} onIndex={setOpen} linkFor={(i) => `/projects/${items[i].slug}`} />
    </section>
  );
}
