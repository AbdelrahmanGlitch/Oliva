import Image from "next/image";

import { personas } from "@/data/content";
import { getProject } from "@/data/projects";
import { Eyebrow } from "@/components/ui/Button";
import { ImageReveal, LineReveal, Reveal } from "@/components/ui/Reveal";

export function Personas() {
  return (
    <section aria-labelledby="personas-title" className="section-y bg-surface">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <Eyebrow className="text-terracotta">Your space</Eyebrow>
            <h2 id="personas-title" className="text-display-lg mt-6 text-espresso">
              <LineReveal lines={["Designed for the way", <em key="i" className="italic">you live.</em>]} />
            </h2>
          </div>
          <Reveal className="max-w-sm">
            <p className="text-[0.95rem] leading-relaxed text-muted">
              Three design approaches to start the conversation. They are directions, not fixed products: every OLIVA kitchen is made from scratch.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-6 lg:gap-10">
          {personas.map((p, i) => {
            const project = getProject(p.project)!;
            return (
              <article key={p.name} className={i === 1 ? "md:mt-20" : ""}>
                <ImageReveal className="relative aspect-[3/4] overflow-hidden" delay={i * 0.1}>
                  <Image src={project.cover.src} alt={project.cover.alt} fill placeholder="blur" sizes="(min-width: 768px) 30vw, 100vw" className="object-cover" />
                </ImageReveal>
                <p className="text-eyebrow mt-6 text-muted">Approach 0{i + 1}</p>
                <h3 className="mt-2 font-display text-3xl font-light text-espresso">{p.name}</h3>
                <p className="mt-1 font-display text-lg italic text-terracotta">{p.line}</p>
                <ul className="mt-5 border-t border-line">
                  {p.points.map((pt) => (
                    <li key={pt} className="border-b border-line py-3 text-sm text-espresso/80">
                      {pt}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
