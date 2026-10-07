import { brand } from "@/data/brand";
import { Button, Eyebrow } from "@/components/ui/Button";
import { LineReveal, Reveal } from "@/components/ui/Reveal";

/** Location confirmed: Eloia Mall, New Cairo. Opening hours and phone are not published, so they are not shown. */
export function Visit() {
  const { location } = brand;
  return (
    <section id="visit" aria-labelledby="visit-title" className="on-dark bg-ink text-ivory">
      <div className="grid lg:grid-cols-2">
        <div className="container-x section-y lg:max-w-none lg:pr-16">
          <Eyebrow className="text-ivory/60">Visit OLIVA</Eyebrow>
          <h2 id="visit-title" className="text-display-lg mt-6">
            <LineReveal lines={["Experience OLIVA", <em key="i" className="italic">in person.</em>]} />
          </h2>
          <Reveal>
            <dl className="mt-12 grid gap-8 border-t border-line-light pt-8 sm:grid-cols-2">
              <div>
                <dt className="text-eyebrow text-ivory/50">Find us</dt>
                <dd className="mt-3 font-display text-2xl font-light leading-snug">
                  {location.name}
                  <br />
                  <span className="text-ivory/70">
                    {location.area}, {location.city}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-eyebrow text-ivory/50">Before you visit</dt>
                <dd className="mt-3 text-sm leading-relaxed text-ivory/70">
                  Send OLIVA a message to arrange a time with the design team.
                </dd>
              </div>
            </dl>
            <div className="mt-12 flex flex-col gap-3 sm:flex-row">
              <Button href={location.mapsUrl} external variant="light">
                Get directions
              </Button>
              <Button href={brand.social.instagramDm} external variant="outline-light">
                Book a visit
              </Button>
            </div>
          </Reveal>
        </div>
        <div className="relative min-h-[420px] lg:min-h-full">
          {/* designed fallback, visible until (or if) the map loads */}
          <div className="plaster absolute inset-0 flex flex-col items-center justify-center gap-3 text-ivory">
            <span className="text-eyebrow text-ivory/70">New Cairo</span>
            <span className="font-display text-4xl font-light">{location.name}</span>
          </div>
          <iframe
            title={`Map showing OLIVA at ${location.name}, ${location.area}`}
            src={location.embedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0 [filter:grayscale(1)_sepia(0.35)_contrast(0.95)_brightness(0.9)]"
          />
          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgb(239_232_220/0.08)]" />
        </div>
      </div>
    </section>
  );
}
