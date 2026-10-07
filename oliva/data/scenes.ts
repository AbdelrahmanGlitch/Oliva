/**
 * OLIVA 3D Kitchen Studio — scene definitions.
 *
 * Every scene is a complete virtual room described as data: room size, walls, openings,
 * floor/wall finishes, cabinet runs, island, lighting and camera presets.
 * The renderer (components/three) and the mini floor plans (components/studio) both read this,
 * so a new kitchen space is added here without touching the configurator.
 *
 * All rooms are design concepts. Proportions are illustrative, not OLIVA specifications.
 * Units: metres. The back wall sits at z = 0 and the room extends towards +z.
 */

export type ModuleType =
  | "drawers3"
  | "drawers2"
  | "doors"
  | "sink"
  | "hob"
  | "dishwasher"
  | "corner"
  | "tall-oven"
  | "tall-fridge"
  | "tall-pantry";

/** what sits above a base module */
export type UpperType = "cabinet" | "none" | "hood" | "shelf";

export type CabinetModule = { type: ModuleType; w: number; upper?: UpperType };

export type Wall = "back" | "left" | "right";

export type CabinetRun = {
  id: string;
  wall: Wall;
  /** distance along the wall where the run starts (x for the back wall, z for side walls) */
  from: number;
  modules: CabinetModule[];
};

export type Opening = {
  wall: Wall;
  /** centre along the wall */
  at: number;
  w: number;
  bottom: number;
  h: number;
  kind: "window" | "door";
};

export type ControlId = "fronts" | "upper" | "shelves" | "tall" | "worktop" | "island" | "light";

export type CameraPreset = { id: string; label: string; position: [number, number, number]; target: [number, number, number] };

export type FloorKind = "stone" | "oak" | "terrazzo";
export type WallKind = "plaster" | "greige" | "limewash";

export type KitchenScene = {
  id: string;
  number: string;
  name: string;
  badge: string;
  label: string;
  tagline: string;
  description: string;
  room: { x0: number; x1: number; depth: number; height: number; walls: Wall[] };
  floor: FloorKind;
  wallFinish: WallKind;
  openings: Opening[];
  runs: CabinetRun[];
  /** top of wall cabinets and tall units (compact kitchens run storage up to the ceiling) */
  upperTop: number;
  island?: { x: number; z: number; w: number; d: number; seats: number };
  dining?: { x: number; z: number; w: number; d: number };
  pendants?: { x: number; z: number; count: number; spacing: number };
  downlights: [number, number][];
  /** decorative ceiling light slot running along z at this x */
  lightSlot?: { x: number; z0: number; z1: number };
  /** daylight: position outside the main window and the point it aims at */
  sun: { position: [number, number, number]; target: [number, number, number]; intensity: number };
  cameras: CameraPreset[];
  /** lens: small rooms use a wider field of view instead of backing the camera through a wall */
  fov?: number;
  controls: ControlId[];
  compare: { character: string; storage: string; space: string; bestFor: string };
};

export const kitchenScenes: KitchenScene[] = [
  {
    id: "l-shape",
    number: "01",
    name: "Spacious L-Shaped Kitchen",
    badge: "L-Shape",
    label: "Spacious",
    tagline: "Open. Spacious. Architectural.",
    description: "Designed for homes where the kitchen becomes a central part of the living space.",
    room: { x0: 0, x1: 6.6, depth: 5.6, height: 2.9, walls: ["back", "left"] },
    floor: "stone",
    wallFinish: "plaster",
    openings: [
      { wall: "back", at: 3.2, w: 1.0, bottom: 1.12, h: 1.2, kind: "window" },
      { wall: "left", at: 4.5, w: 1.3, bottom: 0.05, h: 2.45, kind: "window" },
    ],
    runs: [
      {
        id: "back",
        wall: "back",
        from: 0,
        modules: [
          { type: "corner", w: 0.6 },
          { type: "drawers3", w: 0.6 },
          { type: "hob", w: 0.9, upper: "hood" },
          { type: "drawers2", w: 0.6 },
          { type: "sink", w: 1.0, upper: "none" },
          { type: "dishwasher", w: 0.6 },
          { type: "tall-fridge", w: 0.6 },
          { type: "tall-oven", w: 0.6 },
          { type: "tall-pantry", w: 0.6 },
        ],
      },
      {
        id: "left",
        wall: "left",
        from: 0.6,
        modules: [
          { type: "drawers3", w: 0.6, upper: "shelf" },
          { type: "doors", w: 0.8, upper: "shelf" },
          { type: "drawers2", w: 0.6, upper: "shelf" },
          { type: "doors", w: 0.6, upper: "shelf" },
        ],
      },
    ],
    upperTop: 2.2,
    dining: { x: 5.3, z: 3.9, w: 2.0, d: 0.95 },
    downlights: [
      [1.4, 1.3],
      [3.2, 1.3],
      [5.0, 1.3],
      [1.3, 2.6],
    ],
    sun: { position: [-5, 4.2, 5.4], target: [2.6, 0, 3.2], intensity: 2.1 },
    cameras: [
      { id: "hero", label: "Hero", position: [4.4, 1.75, 6.6], target: [2.5, 1.0, 1.2] },
      { id: "wide", label: "Wide", position: [7.4, 2.5, 8.0], target: [2.8, 0.9, 2.0] },
      { id: "work", label: "Work zone", position: [2.3, 1.6, 3.0], target: [2.0, 1.05, 0.3] },
      { id: "detail", label: "Cabinet detail", position: [3.5, 1.3, 1.5], target: [3.2, 1.15, 0.1] },
      { id: "corner", label: "Corner", position: [3.0, 1.7, 3.6], target: [0.4, 1.0, 0.7] },
    ],
    controls: ["fronts", "upper", "shelves", "tall", "worktop", "light"],
    compare: {
      character: "Open, generous, architectural",
      storage: "Two runs plus a full-height tall wall",
      space: "Larger, open-plan rooms",
      bestFor: "Kitchens that flow into living and dining",
    },
  },
  {
    id: "u-shape",
    number: "02",
    name: "Full U-Shaped Kitchen",
    badge: "U-Shape",
    label: "Full layout",
    tagline: "Efficient. Immersive. Functional.",
    description: "Three walls of cabinetry create a highly organised kitchen environment.",
    room: { x0: 0, x1: 3.9, depth: 5.0, height: 2.8, walls: ["back", "left", "right"] },
    floor: "oak",
    wallFinish: "greige",
    openings: [
      { wall: "back", at: 1.7, w: 1.0, bottom: 1.12, h: 1.15, kind: "window" },
      { wall: "right", at: 4.35, w: 0.9, bottom: 0, h: 2.15, kind: "door" },
    ],
    runs: [
      {
        id: "back",
        wall: "back",
        from: 0,
        modules: [
          { type: "corner", w: 0.6 },
          { type: "drawers3", w: 0.6 },
          { type: "sink", w: 1.0, upper: "none" },
          { type: "dishwasher", w: 0.6 },
          { type: "drawers2", w: 0.5 },
          { type: "corner", w: 0.6 },
        ],
      },
      {
        id: "left",
        wall: "left",
        from: 0.6,
        modules: [
          { type: "doors", w: 0.6 },
          { type: "hob", w: 0.9, upper: "hood" },
          { type: "drawers3", w: 0.6 },
          { type: "drawers2", w: 0.8 },
        ],
      },
      {
        id: "right",
        wall: "right",
        from: 0.6,
        modules: [
          { type: "drawers3", w: 0.6 },
          { type: "drawers2", w: 0.8 },
          { type: "tall-oven", w: 0.6 },
          { type: "tall-fridge", w: 0.6 },
          { type: "tall-pantry", w: 0.6 },
        ],
      },
    ],
    upperTop: 2.2,
    downlights: [
      [0.9, 1.6],
      [3.0, 1.6],
      [0.9, 3.2],
      [3.0, 3.2],
    ],
    lightSlot: { x: 1.95, z0: 0.9, z1: 3.9 },
    sun: { position: [1.7, 4.6, -4.5], target: [1.95, 0, 2.6], intensity: 2.4 },
    cameras: [
      { id: "hero", label: "Hero", position: [1.95, 1.7, 6.6], target: [1.95, 1.0, 1.4] },
      { id: "wide", label: "Wide", position: [3.6, 2.4, 7.6], target: [1.9, 0.9, 1.8] },
      { id: "center", label: "Centre", position: [1.95, 1.55, 3.4], target: [1.95, 1.0, 0.2] },
      { id: "left", label: "Left wall", position: [3.3, 1.6, 3.2], target: [0.2, 1.0, 2.0] },
      { id: "right", label: "Right wall", position: [0.6, 1.6, 3.4], target: [3.7, 1.2, 2.4] },
      { id: "storage", label: "Storage", position: [0.7, 1.55, 4.7], target: [3.5, 1.2, 2.7] },
    ],
    controls: ["fronts", "upper", "tall", "worktop", "light"],
    compare: {
      character: "Enclosed, organised, immersive",
      storage: "Three walls of base, wall and tall storage",
      space: "Medium-to-large dedicated kitchen rooms",
      bestFor: "Cooks who want everything within reach",
    },
  },
  {
    id: "compact-u",
    number: "03",
    name: "Small Space U-Shaped Kitchen",
    badge: "Compact U",
    label: "Small space",
    tagline: "Compact. Intelligent. Purposeful.",
    description: "Designed to make smaller spaces feel considered rather than compromised.",
    room: { x0: 0, x1: 2.5, depth: 3.4, height: 2.6, walls: ["back", "left", "right"] },
    floor: "terrazzo",
    wallFinish: "limewash",
    openings: [{ wall: "back", at: 0.95, w: 0.7, bottom: 1.2, h: 0.9, kind: "window" }],
    runs: [
      {
        id: "back",
        wall: "back",
        from: 0,
        modules: [
          { type: "corner", w: 0.6 },
          { type: "sink", w: 0.7, upper: "none" },
          { type: "drawers2", w: 0.6 },
          { type: "corner", w: 0.6 },
        ],
      },
      {
        id: "left",
        wall: "left",
        from: 0.6,
        modules: [
          { type: "hob", w: 0.6, upper: "hood" },
          { type: "drawers3", w: 0.6 },
          { type: "tall-pantry", w: 0.5 },
        ],
      },
      {
        id: "right",
        wall: "right",
        from: 0.6,
        modules: [
          { type: "drawers3", w: 0.6 },
          { type: "tall-fridge", w: 0.6 },
          { type: "tall-oven", w: 0.6 },
        ],
      },
    ],
    upperTop: 2.45,
    downlights: [
      [1.25, 1.0],
      [1.25, 2.2],
    ],
    sun: { position: [0.95, 4.2, -4.2], target: [1.25, 0, 1.8], intensity: 2.2 },
    cameras: [
      { id: "hero", label: "Hero", position: [1.25, 1.72, 3.36], target: [1.25, 0.95, 0.5] },
      { id: "wide", label: "Wide", position: [1.6, 2.3, 3.35], target: [1.0, 0.7, 1.0] },
      { id: "triangle", label: "Work triangle", position: [1.25, 1.85, 2.6], target: [1.25, 0.9, 0.6] },
      { id: "storage", label: "Storage", position: [1.6, 1.55, 3.3], target: [0.3, 1.25, 1.6] },
      { id: "appliances", label: "Appliance wall", position: [0.9, 1.55, 3.3], target: [2.2, 1.2, 1.6] },
      { id: "detail", label: "Detail", position: [0.95, 1.35, 1.35], target: [0.95, 1.05, 0.15] },
    ],
    fov: 56,
    controls: ["fronts", "upper", "tall", "worktop", "light"],
    compare: {
      character: "Compact, efficient, purposeful",
      storage: "Vertical storage running up to the ceiling",
      space: "Smaller apartments and enclosed kitchens",
      bestFor: "Making every centimetre work harder",
    },
  },
  {
    id: "island",
    number: "04",
    name: "Island Showroom Kitchen",
    badge: "Island",
    label: "Showroom",
    tagline: "Social. Sculptural. Statement.",
    description: "A wall of tall units and a free-standing island that becomes the centre of the home.",
    room: { x0: -3.4, x1: 3.9, depth: 5.8, height: 3.0, walls: ["back", "left"] },
    floor: "stone",
    wallFinish: "plaster",
    openings: [{ wall: "left", at: 2.4, w: 1.4, bottom: 0.08, h: 2.5, kind: "window" }],
    runs: [
      {
        id: "back",
        wall: "back",
        from: -2.4,
        modules: [
          { type: "drawers3", w: 0.6 },
          { type: "doors", w: 0.9 },
          { type: "hob", w: 0.9 },
          { type: "doors", w: 0.6 },
          { type: "drawers3", w: 0.6 },
          { type: "doors", w: 0.7 },
          { type: "tall-oven", w: 0.6 },
          { type: "tall-pantry", w: 0.6 },
        ],
      },
    ],
    upperTop: 2.2,
    island: { x: -0.3, z: 2.15, w: 2.4, d: 1.0, seats: 3 },
    pendants: { x: -0.3, z: 2.15, count: 3, spacing: 0.75 },
    downlights: [
      [-1.8, 1.0],
      [1.4, 1.0],
    ],
    sun: { position: [-7, 4.2, 2.6], target: [0.5, 0, 2.2], intensity: 2.0 },
    cameras: [
      { id: "hero", label: "Hero", position: [4.3, 2.5, 6.4], target: [-0.3, 1.0, 1.1] },
      { id: "front", label: "Front", position: [-0.25, 1.45, 4.6], target: [-0.25, 1.2, 0.3] },
      { id: "island", label: "Island", position: [-3.0, 1.75, 4.2], target: [-0.3, 0.85, 2.1] },
      { id: "detail", label: "Detail", position: [-0.35, 1.3, 1.45], target: [-1.0, 1.12, 0.2] },
    ],
    controls: ["fronts", "upper", "tall", "worktop", "island", "light"],
    compare: {
      character: "Social, sculptural, open",
      storage: "One tall wall plus a working island",
      space: "Large open-plan rooms",
      bestFor: "Entertaining and family gathering",
    },
  },
];

export type SceneId = (typeof kitchenScenes)[number]["id"];

export function getScene(id: string | null | undefined) {
  return kitchenScenes.find((s) => s.id === id) ?? kitchenScenes[0];
}

/* ---------- shared geometry helpers (3D renderer + 2D plans) ---------- */

export const DIM = {
  baseDepth: 0.6,
  tallDepth: 0.62,
  upperDepth: 0.35,
  plinth: 0.1,
  baseTop: 0.88,
  worktop: 0.03,
  upperBottom: 1.48,
} as const;

export const isTall = (t: ModuleType) => t.startsWith("tall");

export function runLength(run: CabinetRun) {
  return run.modules.reduce((a, m) => a + m.w, 0);
}

/** World transform of a run's local frame: local x runs along the wall, local +z points into the room. */
export function runTransform(run: CabinetRun, room: KitchenScene["room"]) {
  const L = runLength(run);
  if (run.wall === "back") return { position: [run.from, 0, 0] as [number, number, number], rotationY: 0, reversed: false };
  if (run.wall === "right") return { position: [room.x1, 0, run.from] as [number, number, number], rotationY: -Math.PI / 2, reversed: false };
  // left wall: local x points towards -z, so lay modules out in reverse
  return { position: [room.x0, 0, run.from + L] as [number, number, number], rotationY: Math.PI / 2, reversed: true };
}

/** Plan-view rectangles of each module (world x/z), used by the 2D floor plans */
export function runFootprints(run: CabinetRun, room: KitchenScene["room"]) {
  let cum = 0;
  return run.modules.map((m) => {
    const d = isTall(m.type) ? DIM.tallDepth : DIM.baseDepth;
    const s = run.from + cum;
    cum += m.w;
    if (run.wall === "back") return { x: s, z: 0, w: m.w, d, tall: isTall(m.type), type: m.type };
    if (run.wall === "left") return { x: room.x0, z: s, w: d, d: m.w, tall: isTall(m.type), type: m.type };
    return { x: room.x1 - d, z: s, w: d, d: m.w, tall: isTall(m.type), type: m.type };
  });
}
