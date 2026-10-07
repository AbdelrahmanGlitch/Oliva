import type { Layout } from "./projects";

/**
 * Process — based on what OLIVA states (design to delivery, own manufacturing, engineers planning
 * around location/size/space). Installation is not named by OLIVA, so it is not listed as a separate step.
 */
export const processSteps = [
  {
    number: "01",
    title: "Discover",
    body: "Your space, how you live in it, and everything you want your kitchen to include.",
  },
  {
    number: "02",
    title: "Engineer",
    body: "OLIVA's engineers plan the layout around the location, size and proportions of the room.",
  },
  {
    number: "03",
    title: "Design",
    body: "Colours, textures and materials are chosen together, from palette to reality.",
  },
  {
    number: "04",
    title: "Manufacture",
    body: "The kitchen is made from scratch in OLIVA's own manufacturing, to the engineers' plans.",
  },
  {
    number: "05",
    title: "Deliver",
    body: "From design to final delivery: the kitchen is complete and ready for its home.",
  },
  {
    number: "06",
    title: "Live",
    body: "A calm, functional kitchen that becomes part of everyday life.",
  },
] as const;

/** Layouts that appear in OLIVA's own work */
export const layouts: {
  id: Layout;
  name: string;
  body: string;
  bestFor: string;
  project: string;
}[] = [
  {
    id: "l-shaped",
    name: "L-Shaped",
    body: "Two runs meet in a corner, opening the room and keeping the working triangle tight.",
    bestFor: "Open-plan apartments, corners, kitchens that connect to living space",
    project: "graphite-oak",
  },
  {
    id: "u-shaped",
    name: "U-Shaped",
    body: "Three walls of storage and worktop wrap the cook, with everything within reach.",
    bestFor: "Enclosed kitchens, serious cooks, maximum storage",
    project: "light-grey-u",
  },
  {
    id: "island",
    name: "Island",
    body: "A wall of tall units and a free-standing island that becomes the centre of the home.",
    bestFor: "Larger rooms, entertaining, family gathering",
    project: "walnut-marble-island",
  },
  {
    id: "parallel",
    name: "Parallel",
    body: "Two facing runs, here with an island alongside, for a kitchen that works like a studio.",
    bestFor: "Long rooms, villas, kitchens with a separate service wall",
    project: "smoked-glass-green-stone",
  },
];

/** Design approaches — conceptual personas, not OLIVA products */
export const personas = [
  {
    name: "The Entertainer",
    line: "A kitchen that hosts.",
    points: ["Island with bar seating", "Lit vitrines on display", "Open to the living space"],
    project: "smoked-glass-green-stone",
  },
  {
    name: "The Minimalist",
    line: "Nothing out of place.",
    points: ["Handleless planes", "Appliances in tall columns", "One calm palette"],
    project: "greige-fluted-wood",
  },
  {
    name: "The Family Kitchen",
    line: "Built for every day.",
    points: ["Deep drawers and tall storage", "Hard-wearing surfaces", "Room to gather"],
    project: "graphite-oak",
  },
] as const;

export const brandWords = ["Space", "Material", "Craft", "Detail", "Life"] as const;
