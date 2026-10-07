import * as THREE from "three";

import { finishes, type Finish, type FinishId } from "@/data/configurator";

/**
 * Procedural PBR materials for the 3D studio. Textures are drawn on canvases at runtime
 * (wood grain, veined stone, fluting), so the scene needs no downloaded assets.
 */

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
}

function noise(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number, rand: () => number) {
  const img = ctx.getImageData(0, 0, w, h);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (rand() - 0.5) * amount;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

function toTexture(c: HTMLCanvasElement, srgb = true) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}

function woodCanvas(base: string, grain: string, seed: number) {
  const W = 512;
  const H = 1024;
  const [c, ctx] = canvas(W, H);
  const rand = rng(seed);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 260; i++) {
    const x0 = rand() * W;
    const amp = 2 + rand() * 6;
    const freq = 0.002 + rand() * 0.006;
    const phase = rand() * Math.PI * 2;
    ctx.beginPath();
    for (let y = 0; y <= H; y += 8) {
      const x = x0 + Math.sin(y * freq + phase) * amp;
      if (y === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    const light = rand() > 0.82;
    ctx.strokeStyle = light ? "rgba(255,235,210,0.10)" : grain;
    ctx.globalAlpha = light ? 1 : 0.06 + rand() * 0.22;
    ctx.lineWidth = 0.5 + rand() * (light ? 3 : 2.4);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  noise(ctx, W, H, 10, rand);
  return c;
}

function stoneCanvas(base: string, vein: string, seed: number, dark: boolean) {
  const S = 1024;
  const [c, ctx] = canvas(S, S);
  const rand = rng(seed);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, S, S);
  // soft clouds
  for (let i = 0; i < 18; i++) {
    const g = ctx.createRadialGradient(rand() * S, rand() * S, 0, rand() * S, rand() * S, 200 + rand() * 300);
    g.addColorStop(0, dark ? "rgba(255,255,255,0.05)" : "rgba(120,110,100,0.05)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
  }
  // veins: random walks, drawn twice (soft halo + sharp core)
  const veins = dark ? 12 : 11;
  for (let v = 0; v < veins; v++) {
    const pts: [number, number][] = [];
    let x = rand() * S;
    let y = rand() * S;
    let a = rand() * Math.PI * 2;
    const steps = 80 + Math.floor(rand() * 140);
    for (let s = 0; s < steps; s++) {
      a += (rand() - 0.5) * 0.5;
      x += Math.cos(a) * 9;
      y += Math.sin(a) * 9 + 2;
      pts.push([x, y]);
    }
    const width = 0.6 + rand() * (dark ? 3.5 : 2.4);
    for (const pass of [0, 1]) {
      ctx.beginPath();
      pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
      ctx.strokeStyle = vein;
      ctx.lineJoin = "round";
      ctx.filter = pass === 0 ? "blur(4px)" : "blur(0.6px)";
      ctx.globalAlpha = pass === 0 ? (dark ? 0.1 : 0.18) : dark ? 0.22 + rand() * 0.3 : 0.45 + rand() * 0.4;
      ctx.lineWidth = pass === 0 ? width * 5 : width;
      ctx.stroke();
    }
  }
  ctx.filter = "none";
  ctx.globalAlpha = 1;
  noise(ctx, S, S, 6, rand);
  return c;
}

function flutedCanvas(base: string, groove: string) {
  const W = 256;
  const [c, ctx] = canvas(W, 64);
  const flutes = 10;
  const fw = W / flutes;
  for (let i = 0; i < flutes; i++) {
    const g = ctx.createLinearGradient(i * fw, 0, (i + 1) * fw, 0);
    g.addColorStop(0, groove);
    g.addColorStop(0.18, base);
    g.addColorStop(0.55, base);
    g.addColorStop(0.9, groove);
    g.addColorStop(1, groove);
    ctx.fillStyle = g;
    ctx.fillRect(i * fw, 0, fw, 64);
  }
  return c;
}

function bumpFromFluted() {
  const W = 256;
  const [c, ctx] = canvas(W, 64);
  const flutes = 10;
  const fw = W / flutes;
  for (let i = 0; i < flutes; i++) {
    const g = ctx.createLinearGradient(i * fw, 0, (i + 1) * fw, 0);
    g.addColorStop(0, "#000");
    g.addColorStop(0.5, "#fff");
    g.addColorStop(1, "#000");
    ctx.fillStyle = g;
    ctx.fillRect(i * fw, 0, fw, 64);
  }
  return c;
}

/** World size (metres) that one texture tile covers, per surface kind */
const tile: Record<Finish["kind"], [number, number]> = {
  matte: [1, 1],
  gloss: [1, 1],
  wood: [0.9, 2.2],
  fluted: [0.36, 1],
  stone: [1.8, 1.8],
  glass: [1, 1],
};

const textureCache = new Map<string, THREE.Texture>();
const materialCache = new Map<string, THREE.Material>();

function baseTexture(f: Finish) {
  const key = f.id;
  let t = textureCache.get(key);
  if (t) return t;
  if (f.kind === "wood") t = toTexture(woodCanvas(f.color, f.detail!, f.id.length * 97));
  else if (f.kind === "stone") t = toTexture(stoneCanvas(f.color, f.detail!, f.id.length * 131, f.id === "greenStone" || f.id === "darkStone"));
  else if (f.kind === "fluted") t = toTexture(flutedCanvas(f.color, f.detail!));
  else return null;
  textureCache.set(key, t);
  return t;
}

function fluteBump() {
  let t = textureCache.get("__flute-bump");
  if (!t) {
    t = toTexture(bumpFromFluted(), false);
    textureCache.set("__flute-bump", t);
  }
  return t;
}

/**
 * Material for a finish on a surface of `size` metres (width, height of the textured face).
 * Cached per finish + rounded size so meshes share materials.
 */
export function finishMaterial(id: FinishId, size: [number, number] = [1, 1]) {
  const f: Finish = finishes[id];
  const [tw, th] = tile[f.kind];
  const rx = Math.max(0.05, Math.round((size[0] / tw) * 20) / 20);
  const ry = Math.max(0.05, Math.round((size[1] / th) * 20) / 20);
  const key = `${id}|${rx}|${ry}`;
  const cached = materialCache.get(key);
  if (cached) return cached;

  let m: THREE.Material;
  const tex = baseTexture(f);
  const map = tex ? tex.clone() : null;
  if (map) {
    map.repeat.set(rx, ry);
    map.needsUpdate = true;
  }

  switch (f.kind) {
    case "gloss":
      m = new THREE.MeshPhysicalMaterial({ color: f.color, roughness: f.roughness, clearcoat: 1, clearcoatRoughness: 0.06 });
      break;
    case "stone":
      m = new THREE.MeshPhysicalMaterial({ map, roughness: f.roughness, clearcoat: 0.35, clearcoatRoughness: 0.15 });
      break;
    case "fluted": {
      const bump = fluteBump().clone();
      bump.repeat.set(rx, ry);
      bump.needsUpdate = true;
      m = new THREE.MeshStandardMaterial({ map, bumpMap: bump, bumpScale: 2.5, roughness: f.roughness });
      break;
    }
    case "glass":
      m = new THREE.MeshPhysicalMaterial({
        color: f.color,
        roughness: 0.04,
        metalness: 0.1,
        transparent: true,
        opacity: 0.42,
        clearcoat: 1,
        depthWrite: false,
      });
      break;
    case "wood":
      m = new THREE.MeshStandardMaterial({ map, roughness: f.roughness });
      break;
    default:
      m = new THREE.MeshStandardMaterial({ color: f.color, roughness: f.roughness });
  }
  materialCache.set(key, m);
  return m;
}

/* ---------- Room materials (shared, cached) ---------- */

function oakPlanksCanvas() {
  const W = 1024;
  const [c, ctx] = canvas(W, W);
  const rand = rng(41);
  const plankH = W / 6;
  for (let r = 0; r < 6; r++) {
    // each row is a strip of wood grain, rotated so the grain runs along the plank
    const strip = woodCanvas(["#b48a5e", "#a97f55", "#bb9467"][r % 3], "#6e4a2e", 300 + r);
    ctx.save();
    ctx.translate(0, r * plankH);
    ctx.rotate(-Math.PI / 2);
    ctx.drawImage(strip, -plankH, 0, plankH, W);
    ctx.restore();
    ctx.fillStyle = "rgba(60,40,25,0.55)";
    ctx.fillRect(0, r * plankH, W, 2);
    const joint = (r % 2 ? 0.35 : 0.8) * W + rand() * 60;
    ctx.fillRect(joint, r * plankH, 2, plankH);
  }
  return c;
}

function terrazzoCanvas() {
  const S = 512;
  const [c, ctx] = canvas(S, S);
  const rand = rng(77);
  ctx.fillStyle = "#e6dfd4";
  ctx.fillRect(0, 0, S, S);
  const chips = ["#8b4a2f", "#b5aca0", "#2b231f", "#cfc4b3", "#a07a55"];
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = chips[Math.floor(rand() * chips.length)];
    ctx.globalAlpha = 0.5 + rand() * 0.5;
    const r = 1 + rand() * (rand() > 0.92 ? 6 : 2.4);
    ctx.beginPath();
    ctx.ellipse(rand() * S, rand() * S, r, r * (0.5 + rand() * 0.5), rand() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  noise(ctx, S, S, 6, rand);
  return c;
}

const roomCache = new Map<string, THREE.Material>();

export function floorMaterial(kind: "stone" | "oak" | "terrazzo") {
  const key = `floor-${kind}`;
  let m = roomCache.get(key);
  if (m) return m;
  let tex: THREE.Texture;
  let roughness = 0.42;
  if (kind === "oak") {
    tex = toTexture(oakPlanksCanvas());
    tex.repeat.set(4, 4);
    roughness = 0.5;
  } else if (kind === "terrazzo") {
    tex = toTexture(terrazzoCanvas());
    tex.repeat.set(5, 5);
    roughness = 0.35;
  } else {
    const [fc, fctx] = canvas(1024, 1024);
    fctx.drawImage(stoneCanvas("#dcd6cb", "#b9b1a5", 7, false), 0, 0);
    fctx.strokeStyle = "rgba(120,110,100,0.35)";
    fctx.lineWidth = 2;
    fctx.strokeRect(0, 0, 1024, 1024);
    tex = toTexture(fc);
    tex.repeat.set(5, 4);
  }
  m = new THREE.MeshStandardMaterial({ map: tex, roughness });
  roomCache.set(key, m);
  return m;
}

const wallColors = { plaster: "#ece6dc", greige: "#ddd3c5", limewash: "#e8e2d6" } as const;

export function wallMaterial(kind: keyof typeof wallColors) {
  const key = `wall-${kind}`;
  let m = roomCache.get(key);
  if (m) return m;
  const [wc, wctx] = canvas(512, 512);
  wctx.fillStyle = wallColors[kind];
  wctx.fillRect(0, 0, 512, 512);
  if (kind === "limewash") {
    // soft cloudy limewash movement
    const rand = rng(9);
    for (let i = 0; i < 40; i++) {
      const g = wctx.createRadialGradient(rand() * 512, rand() * 512, 0, rand() * 512, rand() * 512, 120 + rand() * 160);
      g.addColorStop(0, "rgba(255,255,255,0.10)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      wctx.fillStyle = g;
      wctx.fillRect(0, 0, 512, 512);
    }
  }
  noise(wctx, 512, 512, kind === "limewash" ? 12 : 8, rng(3));
  const tex = toTexture(wc);
  tex.repeat.set(3, 2);
  m = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 });
  roomCache.set(key, m);
  return m;
}

let shared: Record<string, THREE.Material> | null = null;
export function roomMaterials() {
  if (shared) return shared;
  shared = {
    shadowGap: new THREE.MeshStandardMaterial({ color: "#16120f", roughness: 0.9 }),
    blackGlass: new THREE.MeshPhysicalMaterial({ color: "#0b0b0c", roughness: 0.05, clearcoat: 1, metalness: 0.2 }),
    steel: new THREE.MeshStandardMaterial({ color: "#9a9894", roughness: 0.25, metalness: 0.9 }),
    brushed: new THREE.MeshStandardMaterial({ color: "#c9c6c0", roughness: 0.35, metalness: 0.85 }),
    black: new THREE.MeshStandardMaterial({ color: "#151414", roughness: 0.45, metalness: 0.3 }),
    fabric: new THREE.MeshStandardMaterial({ color: "#c9c0b3", roughness: 1 }),
    windowGlass: new THREE.MeshPhysicalMaterial({ color: "#dfe7ea", roughness: 0.02, transparent: true, opacity: 0.18, clearcoat: 1, depthWrite: false }),
    sky: new THREE.MeshBasicMaterial({ color: "#f3f1ea", toneMapped: false }),
    garden: new THREE.MeshBasicMaterial({ color: "#c9cdbb", toneMapped: false }),
    hallway: new THREE.MeshStandardMaterial({ color: "#d6cdbf", roughness: 0.9 }),
    ceiling: new THREE.MeshStandardMaterial({ color: "#f1ece4", roughness: 0.95, emissive: "#f1ece4", emissiveIntensity: 0.32 }),
    baseboard: new THREE.MeshStandardMaterial({ color: "#d8d0c4", roughness: 0.8 }),
    glow: new THREE.MeshBasicMaterial({ color: "#fff1dc", toneMapped: false }),
  };
  return shared;
}

/** Generate a scene's floor and wall textures ahead of time (used to pre-warm the next scene) */
export function prewarm(floor: "stone" | "oak" | "terrazzo", wall: keyof typeof wallColors) {
  floorMaterial(floor);
  wallMaterial(wall);
}
