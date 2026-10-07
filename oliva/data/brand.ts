/**
 * OLIVA brand facts. Every value here is traceable to research/OLIVA_SOURCE_OF_TRUTH.md.
 * Anything not verified is `null` and must be hidden by the UI, never filled in.
 */

export const brand = {
  name: "OLIVA",
  accountName: "Oliva Kitchens",
  descriptor: "Kitchen & Home Furniture", // logo descriptor

  // Their own words
  intro:
    "We create kitchens and interiors that feel calm, functional, and deeply connected to modern living.", // Facebook intro
  bio: "Designing kitchens & interiors with balance and precision.", // Instagram bio, line 1
  bioLine2: "Crafted spaces rooted in structure, warmth, and timeless living.", // Instagram bio, line 2
  vision: "Every great kitchen starts with a vision.", // OLIVA post graphic
  visionBody:
    "Every exceptional kitchen begins as an idea. Through thoughtful design, premium materials, and attention to every detail.", // OLIVA post graphic
  materialLine:
    "It starts with the right material, continues with the right design, and ends with a finish worth seeing.", // IG caption
  detailsLine:
    "From material selection to the final finish, every element is carefully considered.", // IG caption
  trustLine: "Materials you can trust. Design you can notice. Quality you can feel.", // IG caption
  paletteLine:
    "See how colors, textures, and materials come together in real OLIVA kitchens, creating spaces with their own distinct character.", // IG caption

  // Confirmed by the user from an OLIVA reel (2026-10-07)
  fullService: {
    summary:
      "OLIVA creates every kitchen from scratch: the design, the colours and the materials are decided with you, and the kitchen is made in OLIVA's own manufacturing.",
    engineers:
      "OLIVA's engineers plan each kitchen around its location, size and space, and around everything you want it to include.",
  },

  location: {
    name: "Eloia Mall",
    area: "North Teseen, New Cairo",
    city: "Cairo",
    country: "Egypt",
    lat: 30.0302409,
    lng: 31.4583766,
    mapsUrl: "https://maps.app.goo.gl/wHisDpqSfrmu8ci17",
    embedUrl: "https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s30.0302409,31.4583766!6i16",
  },

  // Not public — keep null so the UI hides them
  phone: null as string | null,
  whatsapp: null as string | null,
  email: null as string | null,
  hours: null as string | null,

  social: {
    instagram: { label: "Instagram", handle: "@oliva_kitchens", url: "https://www.instagram.com/oliva_kitchens/" },
    instagramDm: "https://ig.me/m/oliva_kitchens",
    facebook: { label: "Facebook", handle: "Oliva Kitchens", url: "https://www.facebook.com/profile.php?id=61587844537658" },
  },
} as const;

export const navigation = [
  { label: "Kitchens", href: "/#collections" },
  { label: "Projects", href: "/#projects" },
  { label: "Materials", href: "/#materials" },
  { label: "3D Studio", href: "/#studio" },
  { label: "Process", href: "/#process" },
  { label: "Visit", href: "/#visit" },
] as const;

// Services confirmed by OLIVA's own content or by the user
export const services = [
  "Kitchen design",
  "Colours & materials",
  "Own manufacturing",
  "Full-service delivery",
] as const;
