import type { StaticImageData } from "next/image";

import smokedStone from "@/assets/images/smoked-stone.jpg";
import graphiteOak from "@/assets/images/graphite-oak.jpg";
import walnutBlush from "@/assets/images/walnut-blush.jpg";
import greigeVision from "@/assets/images/greige-vision.jpg";

import type { PresetId } from "./configurator";

/**
 * Collections are moods drawn from OLIVA's own delivered kitchens — not catalogue product lines.
 * Every OLIVA kitchen is designed from scratch; these simply group the work by character.
 */
export type Collection = {
  id: PresetId;
  number: string;
  name: string;
  line: string;
  description: string;
  swatches: string[];
  image: StaticImageData;
  alt: string;
  project: string;
};

export const collections: Collection[] = [
  {
    id: "smoked-stone",
    number: "01",
    name: "Smoked & Stone",
    line: "Dark, lit from within.",
    description: "Smoked glass glowing over walnut, deep green lacquer and a stone island with movement in every vein.",
    swatches: ["#2c241e", "#5a3d29", "#2f3b34", "#cfcac0"],
    image: smokedStone,
    alt: "Smoked glass and green stone OLIVA kitchen",
    project: "smoked-glass-green-stone",
  },
  {
    id: "graphite-oak",
    number: "02",
    name: "Graphite & Oak",
    line: "Strong lines, warm wood.",
    description: "Matte graphite, oak niches with black-framed glass, and slatted panels that carry the line to the ceiling.",
    swatches: ["#3e3f42", "#a0703f", "#1b1b1c", "#ece9e4"],
    image: graphiteOak,
    alt: "Graphite and oak OLIVA kitchen",
    project: "graphite-oak",
  },
  {
    id: "warm-walnut",
    number: "03",
    name: "Warm Walnut",
    line: "Wood, stone and a line of light.",
    description: "Walnut above, soft blush or greige below, and veined slabs in between, traced by a continuous LED line.",
    swatches: ["#6e4a2e", "#c4a898", "#efeae2", "#b9a07a"],
    image: walnutBlush,
    alt: "Walnut and blush OLIVA kitchen detail",
    project: "walnut-blush",
  },
  {
    id: "soft-greige",
    number: "04",
    name: "Soft Greige",
    line: "Quiet, bright, precise.",
    description: "Greige and pale grey handleless planes, white stone and dark fluted wood for depth.",
    swatches: ["#b9aea2", "#2b231f", "#ece8e1", "#d8d2c8"],
    image: greigeVision,
    alt: "Greige and fluted wood OLIVA kitchen",
    project: "greige-fluted-wood",
  },
];
