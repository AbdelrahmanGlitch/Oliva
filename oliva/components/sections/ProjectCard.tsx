import Image from "next/image";
import Link from "next/link";

import type { Project } from "@/data/projects";

export function ProjectCard({
  project,
  total,
  aspect = "aspect-[4/5]",
  sizes = "(min-width: 1024px) 45vw, 85vw",
  className = "",
}: {
  project: Project;
  total: number;
  aspect?: string;
  sizes?: string;
  className?: string;
}) {
  return (
    <article className={className}>
      <Link href={`/projects/${project.slug}`} className="group block" data-cursor="View">
        <div className={`relative overflow-hidden bg-stone ${aspect}`}>
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            placeholder="blur"
            sizes={sizes}
            className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-arch)] group-hover:scale-[1.05]"
            style={{ objectPosition: project.cover.focus }}
          />
          <div className="absolute inset-0 bg-ink/0 transition-colors duration-700 group-hover:bg-ink/15" />
          <span className="absolute left-0 top-0 bg-paper px-3 py-2 text-[0.6rem] font-semibold tabular-nums tracking-[0.22em] text-espresso">
            {project.number} / {String(total).padStart(2, "0")}
          </span>
        </div>
        <div className="mt-5 flex items-start justify-between gap-6">
          <div>
            <p className="text-eyebrow text-muted">OLIVA Project {project.number}</p>
            <h3 className="mt-2 font-display text-[1.7rem] font-light leading-tight text-espresso lg:text-3xl">{project.title}</h3>
            <p className="mt-2 text-[0.7rem] uppercase tracking-[0.18em] text-muted">
              {[project.layoutLabel, ...project.tags.slice(0, 2)].filter(Boolean).join(" · ")}
            </p>
          </div>
          <span className="arrow-link mt-1 shrink-0 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-espresso">
            <span className="hidden sm:inline">View project </span>
            <span className="arrow inline-block transition-transform duration-500 group-hover:translate-x-1.5">→</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
