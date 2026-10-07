import Link from "next/link";

import { brand, navigation, services } from "@/data/brand";
import { OlivaLogo } from "@/components/ui/OlivaLogo";

export function Footer() {
  return (
    <footer className="on-dark bg-ink pb-28 text-ivory lg:pb-10">
      <div className="container-x pt-20 lg:pt-28">
        <div className="grid gap-14 border-b border-line-light pb-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <OlivaLogo descriptor className="h-12 text-ivory lg:h-16" />
            <p className="mt-10 max-w-sm font-display text-2xl font-light leading-snug text-ivory/85">
              {brand.bio}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ivory/55">{brand.bioLine2}</p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h3 className="text-eyebrow text-ivory/45">Explore</h3>
              <ul className="mt-6 space-y-3 text-sm">
                {navigation.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="u-grow text-ivory/80 hover:text-ivory">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-eyebrow text-ivory/45">Services</h3>
              <ul className="mt-6 space-y-3 text-sm text-ivory/80">
                {services.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-eyebrow text-ivory/45">Find OLIVA</h3>
              <address className="mt-6 text-sm not-italic leading-relaxed text-ivory/80">
                {brand.location.name}
                <br />
                {brand.location.area}
                <br />
                {brand.location.city}, {brand.location.country}
              </address>
              <a
                href={brand.location.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="arrow-link mt-4 inline-flex gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ivory"
              >
                Get directions <span className="arrow">→</span>
              </a>
              <ul className="mt-8 space-y-3 text-sm">
                <li>
                  <a href={brand.social.instagram.url} target="_blank" rel="noopener noreferrer" className="u-grow text-ivory/80 hover:text-ivory">
                    Instagram — {brand.social.instagram.handle}
                  </a>
                </li>
                <li>
                  <a href={brand.social.facebook.url} target="_blank" rel="noopener noreferrer" className="u-grow text-ivory/80 hover:text-ivory">
                    Facebook — {brand.social.facebook.handle}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-8 text-[0.68rem] uppercase tracking-[0.2em] text-ivory/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 OLIVA · {brand.descriptor}</p>
          <p>Designed &amp; made from scratch · {brand.location.city}</p>
        </div>
      </div>
    </footer>
  );
}
