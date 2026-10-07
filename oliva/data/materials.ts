import type { StaticImageData } from "next/image";

import smokedStone from "@/assets/images/smoked-stone.jpg";
import graphiteOak from "@/assets/images/graphite-oak.jpg";
import walnutBlush from "@/assets/images/walnut-blush.jpg";
import greigeVision from "@/assets/images/greige-vision.jpg";
import walnutPanels from "@/assets/images/walnut-panels.jpg";

/**
 * Finishes that recur in OLIVA's own kitchens, framed as close-ups cropped from their photos.
 * Names describe appearance only. Exact material specifications are chosen per project with OLIVA's engineers.
 */
export type Material = {
  id: string;
  code: string;
  name: string;
  finish: string;
  description: string;
  use: string;
  image: StaticImageData;
  focus: string;
  zoom: number;
  project: string;
};

export const materials: Material[] = [
  {
    id: "walnut",
    code: "WAL",
    name: "Walnut",
    finish: "Wood grain",
    description: "A deep, straight grain that brings warmth to full-height walls and floating cabinets.",
    use: "Wall cabinets · Tall walls · Islands",
    image: walnutPanels,
    focus: "50% 60%",
    zoom: 1.25,
    project: "walnut-wall-vitrine",
  },
  {
    id: "gold-vein",
    code: "GVS",
    name: "Gold-Veined Slab",
    finish: "Polished, veined",
    description: "White stone with warm gold veining, used as one continuous slab behind the hob.",
    use: "Backsplash · Worktop",
    image: walnutBlush,
    focus: "78% 40%",
    zoom: 1.8,
    project: "walnut-blush",
  },
  {
    id: "green-stone",
    code: "GRS",
    name: "Green-Veined Stone",
    finish: "Polished, dramatic veining",
    description: "Deep green with white movement, a statement surface for islands that wrap to the floor.",
    use: "Island · Waterfall sides",
    image: smokedStone,
    focus: "94% 82%",
    zoom: 1.9,
    project: "smoked-glass-green-stone",
  },
  {
    id: "smoked-glass",
    code: "SMG",
    name: "Smoked Glass",
    finish: "Tinted, black frame",
    description: "Tinted glass in slim black frames, lit from within so the cabinet becomes a light source.",
    use: "Wall vitrines · Display cabinets",
    image: smokedStone,
    focus: "30% 18%",
    zoom: 2,
    project: "smoked-glass-green-stone",
  },
  {
    id: "graphite",
    code: "GPH",
    name: "Graphite",
    finish: "Matte",
    description: "A soft-matte dark grey that lets wood and light take the lead.",
    use: "Base units · Tall units · Slatted panels",
    image: graphiteOak,
    focus: "60% 80%",
    zoom: 1.8,
    project: "graphite-oak",
  },
  {
    id: "fluted",
    code: "FLW",
    name: "Fluted Dark Wood",
    finish: "Vertical flute",
    description: "Fine vertical fluting in dark wood, catching warm light along every ridge.",
    use: "Wall cabinets",
    image: greigeVision,
    focus: "30% 6%",
    zoom: 1.9,
    project: "greige-fluted-wood",
  },
  {
    id: "greige",
    code: "GRG",
    name: "Greige",
    finish: "Matte, handleless",
    description: "Warm grey-beige planes with a fine handleless channel, calm enough to disappear into the room.",
    use: "Base units · Tall units · Islands",
    image: greigeVision,
    focus: "45% 72%",
    zoom: 2,
    project: "greige-fluted-wood",
  },
  {
    id: "blush",
    code: "BLT",
    name: "Blush Taupe",
    finish: "Matte, handleless",
    description: "A soft rose-taupe that pairs naturally with walnut and gold-veined stone.",
    use: "Base units · Drawers",
    image: walnutBlush,
    focus: "60% 90%",
    zoom: 1.8,
    project: "walnut-blush",
  },
];
