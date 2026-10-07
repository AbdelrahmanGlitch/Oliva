import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Providers } from "@/components/layout/Providers";

import { brand } from "@/data/brand";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactDock } from "@/components/layout/ContactDock";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const description =
  "OLIVA designs kitchens and interiors that feel calm, functional and deeply connected to modern living. Every kitchen is designed from scratch, engineered for your space and made in OLIVA's own manufacturing. Eloia Mall, New Cairo.";

export const metadata: Metadata = {
  title: {
    default: "OLIVA Kitchens | Bespoke Kitchens, Designed & Made from Scratch",
    template: "%s | OLIVA Kitchens",
  },
  description,
  openGraph: {
    title: "OLIVA Kitchens",
    description: brand.bio,
    images: [{ url: "/brand/oliva-avatar.jpg", width: 720, height: 720, alt: "OLIVA — Kitchen & Home Furniture" }],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f1ea",
};

// Organization + LocalBusiness: only verified facts (no phone, hours or reviews are published)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: "OLIVA Kitchens",
  description,
  slogan: brand.bio,
  image: "/brand/oliva-avatar.jpg",
  address: {
    "@type": "PostalAddress",
    streetAddress: `${brand.location.name}, North Teseen`,
    addressLocality: "New Cairo",
    addressRegion: "Cairo Governorate",
    addressCountry: "EG",
  },
  geo: { "@type": "GeoCoordinates", latitude: brand.location.lat, longitude: brand.location.lng },
  hasMap: brand.location.mapsUrl,
  sameAs: [brand.social.instagram.url, brand.social.facebook.url],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="min-h-full bg-paper">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-80 focus:bg-espresso focus:px-4 focus:py-3 focus:text-ivory">
          Skip to content
        </a>
        <Providers>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <ContactDock />
        </Providers>
      </body>
    </html>
  );
}
