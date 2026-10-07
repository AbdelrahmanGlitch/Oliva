import type { StaticImageData } from "next/image";

import smokedStone from "@/assets/images/smoked-stone.jpg";
import graphiteOak from "@/assets/images/graphite-oak.jpg";
import graphiteIsland from "@/assets/images/graphite-island.jpg";
import walnutBlush from "@/assets/images/walnut-blush.jpg";
import greigeVision from "@/assets/images/greige-vision.jpg";
import walnutMarbleIsland from "@/assets/images/walnut-marble-island.jpg";
import lightGreyU from "@/assets/images/light-grey-u.jpg";
import walnutVitrine from "@/assets/images/walnut-vitrine.jpg";
import walnutPanels from "@/assets/images/walnut-panels.jpg";

/**
 * OLIVA projects. All photos are OLIVA's own (Instagram / Facebook, or supplied by the user from OLIVA's social media).
 * Titles are internal style names: OLIVA publishes no client names, locations or years, so none are shown.
 * Material lines describe what is visible in the photo, not a specification.
 */

export type ProjectImage = {
  src: StaticImageData;
  alt: string;
  /** object-position for crops */
  focus?: string;
};

export type Detail = {
  label: string;
  src: StaticImageData;
  /** object-position + zoom used to frame a close-up from the original photo */
  focus: string;
  zoom: number;
};

export type Layout = "l-shaped" | "u-shaped" | "island" | "parallel" | "wall";

export type Project = {
  slug: string;
  number: string;
  title: string;
  mood: string;
  layout: Layout | null;
  layoutLabel: string | null;
  summary: string;
  description: string;
  cover: ProjectImage;
  gallery: ProjectImage[];
  materials: { part: string; finish: string }[];
  details: Detail[];
  tags: string[];
  source: { label: string; url: string | null; caption: string | null };
};

export const projects: Project[] = [
  {
    slug: "smoked-glass-green-stone",
    number: "01",
    title: "Smoked Glass & Green Stone",
    mood: "Smoked & Stone",
    layout: "parallel",
    layoutLabel: "Parallel run with island",
    summary: "Lit smoked-glass vitrines over walnut, beside a waterfall island in green-veined stone.",
    description:
      "A long wall of smoked-glass cabinets, framed in black and lit from within, floats above walnut base units and a light stone worktop that folds down at the end. Opposite, deep green tall units close the room, and an island in dramatic green-veined stone gathers the bar seating.",
    cover: { src: smokedStone, alt: "OLIVA kitchen with lit smoked-glass wall cabinets, walnut base units and a green-veined stone island", focus: "50% 45%" },
    gallery: [
      { src: smokedStone, alt: "OLIVA kitchen with lit smoked-glass wall cabinets, walnut base units and a green-veined stone island" },
    ],
    materials: [
      { part: "Wall cabinets", finish: "Smoked glass, black frame, integrated lighting" },
      { part: "Base units", finish: "Walnut finish, handleless" },
      { part: "Tall units", finish: "Deep green, high gloss" },
      { part: "Worktop", finish: "Light stone surface, waterfall end" },
      { part: "Island", finish: "Green-veined stone surface, waterfall sides" },
    ],
    details: [
      { label: "Vitrines lit from within", src: smokedStone, focus: "35% 20%", zoom: 1.9 },
      { label: "Waterfall stone edge", src: smokedStone, focus: "12% 85%", zoom: 2 },
      { label: "Green-veined island", src: smokedStone, focus: "92% 88%", zoom: 2 },
    ],
    tags: ["Smoked glass", "Walnut", "Green stone", "Waterfall"],
    source: { label: "OLIVA social media", url: null, caption: null },
  },
  {
    slug: "graphite-oak",
    number: "02",
    title: "Graphite & Oak",
    mood: "Graphite & Oak",
    layout: "l-shaped",
    layoutLabel: "L-shaped with island",
    summary: "Graphite handleless fronts, oak and black-framed glass, slatted panels running to the ceiling.",
    description:
      "Matte graphite tall units hold the built-in ovens, while an oak-lined niche with black-framed glass cabinets brings warmth and light to the cooking wall. Vertical slatted panels finish every cabinet line up to the ceiling and wrap the island, tying the whole open-plan space together.",
    cover: { src: graphiteOak, alt: "OLIVA graphite and oak L-shaped kitchen with lit glass wall cabinets and slatted panels", focus: "50% 50%" },
    gallery: [
      { src: graphiteOak, alt: "OLIVA graphite and oak L-shaped kitchen with lit glass wall cabinets and slatted panels" },
      { src: graphiteIsland, alt: "Open-plan view of the graphite and oak kitchen with a slatted island and pendant lighting" },
    ],
    materials: [
      { part: "Base & tall units", finish: "Graphite matte, handleless channel" },
      { part: "Wall cabinets", finish: "Oak finish with black-framed lit glass" },
      { part: "Top panels & island", finish: "Graphite vertical slats" },
      { part: "Worktop", finish: "Oak-look surface" },
      { part: "Backsplash", finish: "White veined stone surface" },
    ],
    details: [
      { label: "Lit glass in oak", src: graphiteOak, focus: "28% 42%", zoom: 1.9 },
      { label: "Handleless drawer channels", src: graphiteOak, focus: "40% 72%", zoom: 2 },
      { label: "Slatted panels to the ceiling", src: graphiteOak, focus: "55% 25%", zoom: 1.9 },
    ],
    tags: ["Graphite", "Oak", "Slatted", "Glass"],
    source: {
      label: "Instagram — “From Palette To Reality”",
      url: "https://www.instagram.com/p/DdBkxJSjCMe/",
      caption: "From Palette To Reality. See How Colors, Textures, And Materials Come Together In Real OLIVA Kitchens.",
    },
  },
  {
    slug: "walnut-blush",
    number: "03",
    title: "Walnut & Blush",
    mood: "Warm Walnut",
    layout: null,
    layoutLabel: null,
    summary: "Walnut above, blush-taupe below, and a gold-veined slab between them, traced by a line of light.",
    description:
      "Walnut wall cabinets and soft blush-taupe drawers meet across a gold-veined white slab backsplash. A continuous LED line runs beneath the walnut, and the handleless drawer channels draw a fine dark rule along the length of the run.",
    cover: { src: walnutBlush, alt: "OLIVA kitchen detail with walnut wall cabinets, gold-veined backsplash and blush-taupe handleless drawers", focus: "50% 55%" },
    gallery: [
      { src: walnutBlush, alt: "OLIVA kitchen detail with walnut wall cabinets, gold-veined backsplash and blush-taupe handleless drawers" },
    ],
    materials: [
      { part: "Wall cabinets", finish: "Walnut finish" },
      { part: "Base units", finish: "Blush-taupe matte, handleless channel" },
      { part: "Backsplash", finish: "Gold-veined white slab" },
      { part: "Worktop", finish: "White stone surface" },
      { part: "Lighting", finish: "Continuous LED line under wall cabinets" },
    ],
    details: [
      { label: "The line of light", src: walnutBlush, focus: "70% 22%", zoom: 1.9 },
      { label: "Gold-veined slab", src: walnutBlush, focus: "55% 45%", zoom: 2 },
      { label: "Drawer channel", src: walnutBlush, focus: "88% 88%", zoom: 1.9 },
    ],
    tags: ["Walnut", "Blush", "Gold vein", "LED"],
    source: {
      label: "Instagram — “From Palette To Reality”",
      url: "https://www.instagram.com/p/DdBkxJSjCMe/",
      caption: "From Palette To Reality. See How Colors, Textures, And Materials Come Together In Real OLIVA Kitchens.",
    },
  },
  {
    slug: "greige-fluted-wood",
    number: "04",
    title: "Greige & Fluted Wood",
    mood: "Soft Greige",
    layout: "l-shaped",
    layoutLabel: "L-shaped with island",
    summary: "Quiet greige handleless units under dark fluted wood, with a tall column for the ovens.",
    description:
      "Greige handleless units wrap the room in an L, under dark fluted-wood wall cabinets washed by warm light. A tall column keeps the oven and microwave at eye level, and the island repeats the same greige and white stone.",
    cover: { src: greigeVision, alt: "OLIVA greige L-shaped kitchen with dark fluted wood wall cabinets and a tall oven column", focus: "50% 50%" },
    gallery: [
      { src: greigeVision, alt: "OLIVA greige L-shaped kitchen with dark fluted wood wall cabinets and a tall oven column" },
    ],
    materials: [
      { part: "Base & tall units", finish: "Greige matte, handleless channel" },
      { part: "Wall cabinets", finish: "Dark fluted wood" },
      { part: "Worktop & backsplash", finish: "White stone surface" },
      { part: "Appliances", finish: "Built-in oven and microwave in a tall column" },
      { part: "Lighting", finish: "Warm LED under wall cabinets" },
    ],
    details: [
      { label: "Fluted wood grain", src: greigeVision, focus: "35% 10%", zoom: 1.9 },
      { label: "Warm light on stone", src: greigeVision, focus: "40% 35%", zoom: 2 },
      { label: "Tall appliance column", src: greigeVision, focus: "85% 45%", zoom: 2 },
    ],
    tags: ["Greige", "Fluted wood", "Tall column"],
    source: {
      label: "OLIVA social media — “Every great kitchen starts with a vision.”",
      url: null,
      caption: "Every great kitchen starts with a vision.",
    },
  },
  {
    slug: "walnut-marble-island",
    number: "05",
    title: "Walnut & Marble Island",
    mood: "Warm Walnut",
    layout: "island",
    layoutLabel: "Wall run with island",
    summary: "Walnut floating above greige, and a veined-stone island that falls to the floor.",
    description:
      "A greige wall of tall units houses two ovens and a microwave. Walnut wall cabinets float above a full-height veined-stone backsplash, and the island turns the same stone into a waterfall edge.",
    cover: { src: walnutMarbleIsland, alt: "OLIVA kitchen with walnut wall cabinets, greige tall units and a white veined stone waterfall island", focus: "50% 50%" },
    gallery: [
      { src: walnutMarbleIsland, alt: "OLIVA kitchen with walnut wall cabinets, greige tall units and a white veined stone waterfall island" },
    ],
    materials: [
      { part: "Tall units", finish: "Greige matte, handleless" },
      { part: "Wall cabinets", finish: "Walnut finish with LED line" },
      { part: "Backsplash", finish: "White veined stone slab" },
      { part: "Island", finish: "White veined stone, waterfall edge" },
    ],
    details: [],
    tags: ["Walnut", "Greige", "Veined stone"],
    source: {
      label: "Instagram",
      url: "https://www.instagram.com/p/DdjWyuWgIgo/",
      caption: "Another Kitchen, Successfully Delivered.",
    },
  },
  {
    slug: "light-grey-u",
    number: "06",
    title: "Light Grey U-Kitchen",
    mood: "Soft Greige",
    layout: "u-shaped",
    layoutLabel: "U-shaped",
    summary: "Pale grey and light oak in a calm U, softened by under-cabinet light.",
    description:
      "Pale grey handleless units wrap three walls. A recessed band of light-oak wall cabinets, lit from beneath, warms the stone backsplash, with track lights and downlights above.",
    cover: { src: lightGreyU, alt: "OLIVA U-shaped kitchen in pale grey with light oak wall cabinets", focus: "50% 50%" },
    gallery: [{ src: lightGreyU, alt: "OLIVA U-shaped kitchen in pale grey with light oak wall cabinets" }],
    materials: [
      { part: "Units", finish: "Pale grey matte, handleless" },
      { part: "Wall cabinets", finish: "Light oak finish" },
      { part: "Worktop & backsplash", finish: "Light stone surface" },
    ],
    details: [],
    tags: ["Pale grey", "Oak", "U-shaped"],
    source: {
      label: "Instagram",
      url: "https://www.instagram.com/p/Ddyc927gPIt/",
      caption: "From Design To Final Delivery.",
    },
  },
  {
    slug: "walnut-wall-vitrine",
    number: "07",
    title: "Walnut Wall & Vitrine",
    mood: "Warm Walnut",
    layout: "wall",
    layoutLabel: "Full-height wall",
    summary: "A full-height walnut wall with a lit glass vitrine set into it.",
    description:
      "A full-height walnut wall integrates the oven and a black-framed glass vitrine, lit from within, under a stepped ceiling.",
    cover: { src: walnutVitrine, alt: "OLIVA full-height walnut kitchen wall with a lit glass vitrine", focus: "50% 100%" },
    gallery: [{ src: walnutVitrine, alt: "OLIVA full-height walnut kitchen wall with a lit glass vitrine", focus: "50% 100%" }],
    materials: [
      { part: "Wall", finish: "Walnut finish, full height" },
      { part: "Vitrine", finish: "Black-framed glass, lit" },
    ],
    details: [],
    tags: ["Walnut", "Vitrine"],
    source: {
      label: "Instagram",
      url: "https://www.instagram.com/p/DeKdtamAIzI/",
      caption: "Another Kitchen Delivered By OLIVA.",
    },
  },
];

export const extraImages = { walnutPanels };

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
