import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProject, projects } from "@/data/projects";
import { Plan } from "@/components/sections/LayoutExplorer";
import { ProjectImages } from "@/components/project/ProjectImages";
import { Button, Eyebrow } from "@/components/ui/Button";
import { ImageReveal, LineReveal, Reveal } from "@/components/ui/Reveal";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${p.title} — OLIVA Project ${p.number}`,
    description: p.summary,
    openGraph: { images: [{ url: p.cover.src.src, alt: p.cover.alt }] },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const i = projects.indexOf(project);
  const next = projects[(i + 1) % projects.length];
  const total = String(projects.length).padStart(2, "0");

  return (
    <article>
      {/* Hero */}
      <header className="pt-16 lg:pt-[var(--nav-h)]">
        <div className="container-x grid gap-10 pb-12 pt-10 lg:grid-cols-12 lg:items-end lg:pb-16 lg:pt-16">
          <div className="lg:col-span-7">
            <nav aria-label="Breadcrumb" className="text-[0.62rem] uppercase tracking-[0.22em] text-muted">
              <Link href="/#projects" className="u-grow">
                Projects
              </Link>{" "}
              / {project.number} of {total}
            </nav>
            <Eyebrow className="mt-8 text-terracotta">OLIVA Project {project.number}</Eyebrow>
            <h1 className="text-display-xl mt-6 text-espresso">
              <LineReveal lines={project.title.split(" & ").map((part, k, arr) => (k < arr.length - 1 ? `${part} &` : part))} />
            </h1>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal>
              <p className="text-lead text-muted">{project.summary}</p>
              <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6 text-sm">
                <div>
                  <dt className="text-eyebrow text-muted">Mood</dt>
                  <dd className="mt-2 text-espresso">{project.mood}</dd>
                </div>
                {project.layoutLabel && (
                  <div>
                    <dt className="text-eyebrow text-muted">Layout</dt>
                    <dd className="mt-2 text-espresso">{project.layoutLabel}</dd>
                  </div>
                )}
              </dl>
            </Reveal>
          </div>
        </div>
        <ImageReveal className="relative mx-auto h-[70svh] max-h-[960px] min-h-[420px] w-full max-w-[96rem] overflow-hidden lg:h-[86svh]">
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            preload
            placeholder="blur"
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: project.cover.focus }}
          />
        </ImageReveal>
      </header>

      {/* Story + materials */}
      <section className="section-y">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Eyebrow className="text-terracotta">The kitchen</Eyebrow>
            <Reveal>
              <p className="mt-8 font-display text-[1.8rem] font-light leading-snug text-espresso lg:text-[2.3rem]">{project.description}</p>
            </Reveal>
            {project.source.caption && (
              <Reveal>
                <blockquote className="mt-10 border-l-2 border-terracotta pl-5">
                  <p className="font-display text-xl italic text-espresso">“{project.source.caption}”</p>
                  <footer className="mt-2 text-[0.62rem] uppercase tracking-[0.2em] text-muted">
                    {project.source.url ? (
                      <a href={project.source.url} target="_blank" rel="noopener noreferrer" className="u-grow">
                        {project.source.label}
                      </a>
                    ) : (
                      project.source.label
                    )}
                  </footer>
                </blockquote>
              </Reveal>
            )}
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <Eyebrow className="text-terracotta">Material details</Eyebrow>
            <dl className="mt-8 border-t border-line">
              {project.materials.map((m) => (
                <div key={m.part} className="grid grid-cols-[9rem_1fr] gap-4 border-b border-line py-4 text-sm">
                  <dt className="text-muted">{m.part}</dt>
                  <dd className="text-espresso">{m.finish}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[0.62rem] uppercase leading-relaxed tracking-[0.16em] text-muted">
              Finishes as seen in the photographs. Exact specifications are set per project.
            </p>

            {project.layout && (
              <div className="mt-12">
                <p className="text-eyebrow text-muted">Kitchen layout · {project.layoutLabel}</p>
                <div className="mt-4 aspect-[4/3] bg-surface p-5">
                  <Plan id={project.layout} />
                </div>
                <p className="mt-2 text-[0.6rem] uppercase tracking-[0.16em] text-muted">Schematic plan, not to scale</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {(project.gallery.length > 1 || project.details.length > 0) && (
        <section className="pb-[var(--section)]">
          <div className="container-x">
            <ProjectImages project={project} />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="plaster on-dark text-ivory">
        <div className="container-x section-y flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <p className="text-eyebrow text-ivory/70">Your kitchen, from scratch</p>
            <h2 className="text-display-lg mt-6">
              Create something
              <br />
              <em className="italic">similar.</em>
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/#consultation" variant="light">
              Book a consultation
            </Button>
            <Button href="/#studio" variant="outline-light">
              Try it in 3D
            </Button>
          </div>
        </div>
      </section>

      {/* Next project */}
      <Link href={`/projects/${next.slug}`} className="group block bg-ink text-ivory">
        <div className="container-x grid items-center gap-8 py-14 sm:grid-cols-[1fr_auto]">
          <div>
            <p className="text-eyebrow text-ivory/50">Next · OLIVA Project {next.number}</p>
            <p className="mt-3 font-display text-4xl font-light transition-transform duration-700 group-hover:translate-x-2 lg:text-6xl">{next.title} →</p>
          </div>
          <div className="relative hidden h-32 w-48 overflow-hidden sm:block">
            <Image src={next.cover.src} alt="" fill sizes="192px" className="object-cover transition-transform duration-1000 group-hover:scale-110" />
          </div>
        </div>
      </Link>
    </article>
  );
}
