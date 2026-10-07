/**
 * 3D studio options. Every finish is one seen in an OLIVA kitchen (see data/materials.ts).
 * The studio is an interactive concept, not a product specification.
 */

export type SurfaceKind = "matte" | "gloss" | "wood" | "fluted" | "stone" | "glass";

export type Finish = {
  id: string;
  label: string;
  kind: SurfaceKind;
  /** base colour */
  color: string;
  /** vein / grain colour for procedural textures */
  detail?: string;
  roughness: number;
};

export const finishes = {
  greige: { id: "greige", label: "Greige matte", kind: "matte", color: "#b6ab9f", roughness: 0.62 },
  graphite: { id: "graphite", label: "Graphite matte", kind: "matte", color: "#3c3d40", roughness: 0.58 },
  blush: { id: "blush", label: "Blush taupe", kind: "matte", color: "#c3a594", roughness: 0.6 },
  paleGrey: { id: "paleGrey", label: "Pale grey matte", kind: "matte", color: "#cfcdc8", roughness: 0.6 },
  green: { id: "green", label: "Deep green gloss", kind: "gloss", color: "#26332c", roughness: 0.12 },
  walnut: { id: "walnut", label: "Walnut", kind: "wood", color: "#6b4529", detail: "#3e2614", roughness: 0.55 },
  oak: { id: "oak", label: "Oak", kind: "wood", color: "#a8794a", detail: "#7a5230", roughness: 0.55 },
  fluted: { id: "fluted", label: "Fluted dark wood", kind: "fluted", color: "#3a2a20", detail: "#1c130d", roughness: 0.6 },
  slatted: { id: "slatted", label: "Graphite slats", kind: "fluted", color: "#3c3d40", detail: "#1f2022", roughness: 0.6 },
  smoked: { id: "smoked", label: "Smoked glass, lit", kind: "glass", color: "#2a2018", roughness: 0.08 },
  whiteStone: { id: "whiteStone", label: "White veined stone", kind: "stone", color: "#ecebe7", detail: "#9b9a98", roughness: 0.18 },
  goldVein: { id: "goldVein", label: "Gold-veined slab", kind: "stone", color: "#f1ece4", detail: "#b08d5c", roughness: 0.15 },
  greenStone: { id: "greenStone", label: "Green-veined stone", kind: "stone", color: "#2d3a33", detail: "#d9ddd6", roughness: 0.2 },
  darkStone: { id: "darkStone", label: "Dark matte stone", kind: "stone", color: "#2b2a29", detail: "#3d3b39", roughness: 0.55 },
} satisfies Record<string, Finish>;

export type FinishId = keyof typeof finishes;

export const options = {
  fronts: ["greige", "graphite", "blush", "paleGrey", "green", "walnut"] as FinishId[],
  upper: ["walnut", "oak", "fluted", "smoked", "greige", "graphite"] as FinishId[],
  worktop: ["whiteStone", "goldVein", "greenStone", "darkStone", "oak"] as FinishId[],
  island: ["match", "walnut", "slatted", "greenStone", "whiteStone"] as (FinishId | "match")[],
  tall: ["match", "green", "walnut", "graphite", "greige"] as (FinishId | "match")[],
};

export type LightMode = "warm" | "neutral" | "off";

export type ShelfMode = "open" | "closed";

/** Finishes chosen by the visitor. Shared across scenes so a design survives switching rooms. */
export type KitchenConfig = {
  fronts: FinishId;
  upper: FinishId;
  worktop: FinishId;
  island: FinishId | "match";
  tall: FinishId | "match";
  shelves: ShelfMode;
  light: LightMode;
};

export type PresetId = "smoked-stone" | "graphite-oak" | "warm-walnut" | "soft-greige";

export const presets: Record<PresetId, { label: string; config: KitchenConfig }> = {
  "smoked-stone": {
    label: "Smoked & Stone",
    config: { fronts: "walnut", upper: "smoked", worktop: "whiteStone", island: "greenStone", tall: "green", shelves: "closed", light: "warm" },
  },
  "graphite-oak": {
    label: "Graphite & Oak",
    config: { fronts: "graphite", upper: "oak", worktop: "oak", island: "slatted", tall: "match", shelves: "open", light: "neutral" },
  },
  "warm-walnut": {
    label: "Warm Walnut",
    config: { fronts: "blush", upper: "walnut", worktop: "goldVein", island: "match", tall: "walnut", shelves: "closed", light: "neutral" },
  },
  "soft-greige": {
    label: "Soft Greige",
    config: { fronts: "greige", upper: "fluted", worktop: "whiteStone", island: "match", tall: "match", shelves: "open", light: "warm" },
  },
};

export const defaultConfig: KitchenConfig = presets["warm-walnut"].config;

export const tallFinish = (c: KitchenConfig): FinishId => (c.tall === "match" ? c.fronts : c.tall);

/** Human-readable summary, limited to the controls the chosen scene actually has */
export function describeConfig(c: KitchenConfig, scene: { name: string; controls: string[] }) {
  const has = (k: string) => scene.controls.includes(k);
  const match = (v: FinishId | "match") => (v === "match" ? `${finishes[c.fronts].label} (matching)` : finishes[v].label);
  const rows = [
    { part: "Kitchen space", value: scene.name },
    { part: "Base units", value: finishes[c.fronts].label },
    has("upper") && { part: "Wall cabinets", value: finishes[c.upper].label },
    has("shelves") && { part: "Side wall", value: c.shelves === "open" ? "Open shelving" : "Wall cabinets" },
    has("tall") && { part: "Tall units", value: match(c.tall) },
    { part: "Worktop & backsplash", value: finishes[c.worktop].label },
    has("island") && { part: "Island", value: match(c.island) },
    { part: "Lighting", value: { warm: "Warm LED line", neutral: "Neutral LED line", off: "No LED line" }[c.light] },
  ];
  return rows.filter(Boolean) as { part: string; value: string }[];
}
