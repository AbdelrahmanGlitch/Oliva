import Image from "next/image";

import { brand } from "@/data/brand";
import { getProject } from "@/data/projects";
import { Eyebrow } from "@/components/ui/Button";
import { ImageReveal, LineReveal, Reveal } from "@/components/ui/Reveal";

const main = getProject("greige-fluted-wood")!;
const second = getProject("graphite-oak")!;

// Confirmed by the user from an OLIVA reel: design from scratch, engineers, own manufacturing.
const pillars = [
  {
    title: "Made from scratch",
    body: "Nothing comes off a shelf. The design, the colours and the materials are decided for your kitchen alone.",
  },
  {
    title: "Engineered for your space",
    body: brand.fullService.engineers,
  },
  {
    title: "Our own manufacturing",
    body: "What OLIVA's engineers design is made in OLIVA's own manufacturing, so the drawing and the finished kitchen stay one and the same.",
  },
];

export function Approach() {
  return (
    <section id="approach" aria-labelledby="approach-title" className="section-y overflow-hidden">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow className="text-terracotta">The OLIVA approach</Eyebrow>
          </div>
          <h2 id="approach-title" className="text-display-lg text-espresso lg:col-span-8">
            <LineReveal lines={["A kitchen should feel like", <span key="b">it <em className="italic text-terracotta">belongs</em> to your home.</span>]} />
          </h2>
        </div>

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-10">
          {/* asymmetric image composition */}
          <div className="relative lg:col-span-7">
            <ImageReveal className="relative aspect-[1080/930] w-full overflow-hidden">
              <Image src={main.cover.src} alt={main.cover.alt} fill placeholder="blur" sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
            </ImageReveal>
            <ImageReveal
              delay={0.2}
              direction="left"
              className="absolute -bottom-20 right-[4%] hidden aspect-[4/5] w-[34%] overflow-hidden border-[10px] border-paper md:block"
            >
              <Image src={second.cover.src} alt={second.cover.alt} fill placeholder="blur" sizes="25vw" className="object-cover" />
            </ImageReveal>
            <p className="mt-4 text-[0.65rem] uppercase tracking-[0.22em] text-muted">
              OLIVA Project {main.number} — {main.title}
            </p>
          </div>

          <div className="lg:col-span-5 lg:col-start-8 lg:pt-6">
            <Reveal>
              <p className="font-display text-[1.65rem] font-light leading-snug text-espresso lg:text-[2rem]">
                “{brand.intro}”
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-lead mt-6 text-muted">{brand.fullService.summary}</p>
            </Reveal>

            <Reveal delay={0.15}>
              <ul className="mt-12 border-t border-line">
                {pillars.map((p, i) => (
                  <li key={p.title} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-6">
                    <span className="font-display text-2xl italic text-terracotta">0{i + 1}</span>
                    <div>
                      <h3 className="text-eyebrow text-espresso">{p.title}</h3>
                      <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{p.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
