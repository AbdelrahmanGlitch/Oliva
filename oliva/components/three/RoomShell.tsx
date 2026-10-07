"use client";

import * as THREE from "three";

import type { KitchenScene, Opening, Wall } from "@/data/scenes";
import { floorMaterial, roomMaterials, wallMaterial } from "./materials";
import { Slab, type V3 } from "./parts";

const T = 0.15; // wall thickness

let outside: THREE.Material | null = null;
/** soft daylight view seen through windows: pale sky over muted garden green */
function outsideMaterial() {
  if (outside) return outside;
  const c = document.createElement("canvas");
  c.width = 16;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, "#f6f4ee");
  g.addColorStop(0.55, "#eef0ea");
  g.addColorStop(0.62, "#c9cfbd");
  g.addColorStop(1, "#aab39c");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 16, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  outside = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false });
  return outside;
}

/** Map a point in a wall's local frame (u along the wall, v up, w into the room) to world space */
function wallFrame(wall: Wall, room: KitchenScene["room"]) {
  if (wall === "back") return { pos: (u: number, v: number, w: number): V3 => [room.x0 + u, v, w], size: (l: number, h: number, t: number): V3 => [l, h, t], length: room.x1 - room.x0, rotY: 0 };
  const x = wall === "left" ? room.x0 : room.x1;
  const s = wall === "left" ? -1 : 1;
  return { pos: (u: number, v: number, w: number): V3 => [x - s * w, v, u], size: (l: number, h: number, t: number): V3 => [t, h, l], length: room.depth, rotY: wall === "left" ? Math.PI / 2 : -Math.PI / 2 };
}

function WallWithOpenings({ wall, scene }: { wall: Wall; scene: KitchenScene }) {
  const { room } = scene;
  const H = room.height;
  const f = wallFrame(wall, room);
  const mat = wallMaterial(scene.wallFinish);
  const r = roomMaterials();
  // back-wall openings are given in world x; side-wall openings in world z (which starts at the back wall)
  const offset = wall === "back" ? room.x0 : 0;
  const holes = scene.openings
    .filter((o) => o.wall === wall)
    .map((o) => ({ ...o, at: o.at - offset }))
    .sort((a, b) => a.at - b.at);

  const pieces: { u0: number; u1: number; v0: number; v1: number }[] = [];
  let cursor = 0;
  for (const o of holes) {
    const a = o.at - o.w / 2;
    const b = o.at + o.w / 2;
    if (a > cursor) pieces.push({ u0: cursor, u1: a, v0: 0, v1: H });
    if (o.bottom > 0) pieces.push({ u0: a, u1: b, v0: 0, v1: o.bottom });
    pieces.push({ u0: a, u1: b, v0: o.bottom + o.h, v1: H });
    cursor = b;
  }
  if (cursor < f.length) pieces.push({ u0: cursor, u1: f.length, v0: 0, v1: H });

  return (
    <group>
      {pieces.map((p, i) => (
        <group key={i}>
          <Slab material={mat} size={f.size(p.u1 - p.u0, p.v1 - p.v0, T)} position={f.pos((p.u0 + p.u1) / 2, (p.v0 + p.v1) / 2, -T / 2)} />
          {p.v0 === 0 && <Slab material={r.baseboard} size={f.size(p.u1 - p.u0, 0.08, 0.012)} position={f.pos((p.u0 + p.u1) / 2, 0.04, 0.006)} cast={false} />}
        </group>
      ))}
      {holes.map((o, i) => (
        <OpeningDressing key={i} o={o} frame={f} />
      ))}
    </group>
  );
}

function OpeningDressing({ o, frame: f }: { o: Opening; frame: ReturnType<typeof wallFrame> }) {
  const r = roomMaterials();
  const a = o.at - o.w / 2;
  const b = o.at + o.w / 2;
  const top = o.bottom + o.h;
  const fw = 0.035; // slim black frame, as on OLIVA's glass cabinets
  if (o.kind === "door") {
    return (
      <group>
        <Slab material={r.baseboard} size={f.size(0.04, o.h, T + 0.02)} position={f.pos(a + 0.02, o.h / 2, -T / 2)} />
        <Slab material={r.baseboard} size={f.size(0.04, o.h, T + 0.02)} position={f.pos(b - 0.02, o.h / 2, -T / 2)} />
        <Slab material={r.baseboard} size={f.size(o.w, 0.04, T + 0.02)} position={f.pos(o.at, top - 0.02, -T / 2)} />
        {/* hallway beyond */}
        <Slab material={r.hallway} size={f.size(o.w + 1.2, 2.6, 0.02)} position={f.pos(o.at, 1.3, -1.4)} cast={false} />
        <Slab material={r.hallway} size={f.size(o.w + 1.2, 0.02, 1.4)} position={f.pos(o.at, 0.001, -0.75)} cast={false} />
      </group>
    );
  }
  return (
    <group>
      {/* frame */}
      <Slab material={r.black} size={f.size(fw, o.h, 0.06)} position={f.pos(a + fw / 2, o.bottom + o.h / 2, -T / 2)} />
      <Slab material={r.black} size={f.size(fw, o.h, 0.06)} position={f.pos(b - fw / 2, o.bottom + o.h / 2, -T / 2)} />
      <Slab material={r.black} size={f.size(o.w, fw, 0.06)} position={f.pos(o.at, o.bottom + fw / 2, -T / 2)} />
      <Slab material={r.black} size={f.size(o.w, fw, 0.06)} position={f.pos(o.at, top - fw / 2, -T / 2)} />
      {o.w > 1.1 && <Slab material={r.black} size={f.size(0.025, o.h, 0.05)} position={f.pos(o.at, o.bottom + o.h / 2, -T / 2)} />}
      <Slab material={r.windowGlass} size={f.size(o.w - 0.04, o.h - 0.04, 0.01)} position={f.pos(o.at, o.bottom + o.h / 2, -T / 2)} cast={false} receive={false} />
      {/* deep stone sill on low windows */}
      {o.bottom > 0.5 && <Slab finish="whiteStone" face="top" size={f.size(o.w + 0.06, 0.03, T)} position={f.pos(o.at, o.bottom - 0.015, -T / 2)} cast={false} />}
      {/* daylight view */}
      <Slab material={outsideMaterial()} size={f.size(o.w + 4, o.h + 3, 0.02)} position={f.pos(o.at, o.bottom + o.h / 2, -2.2)} cast={false} receive={false} />
    </group>
  );
}

export function RoomShell({ scene }: { scene: KitchenScene }) {
  const { room } = scene;
  const r = roomMaterials();
  const w = room.x1 - room.x0;
  const cx = (room.x0 + room.x1) / 2;

  return (
    <group>
      {/* floor runs past the open sides so the room sits inside a home, not on a plinth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0, room.depth / 2 + 2]} receiveShadow material={floorMaterial(scene.floor)}>
        <planeGeometry args={[w + 10, room.depth + 10]} />
      </mesh>

      {room.walls.map((wall) => (
        <WallWithOpenings key={wall} wall={wall} scene={scene} />
      ))}

      {/* ceiling (faces down) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[cx, room.height, room.depth / 2]} material={r.ceiling} receiveShadow>
        <planeGeometry args={[w + 0.3, room.depth]} />
      </mesh>

      {/* recessed downlights */}
      {scene.downlights.map(([x, z]) => (
        <group key={`${x}-${z}`} position={[x, room.height - 0.003, z]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={r.black}>
            <ringGeometry args={[0.04, 0.055, 24]} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} material={r.glow}>
            <circleGeometry args={[0.04, 24]} />
          </mesh>
          <pointLight position={[0, -0.25, 0]} intensity={0.55} distance={3.2} decay={2} color="#ffe6c8" />
        </group>
      ))}

      {scene.lightSlot && (
        <mesh position={[scene.lightSlot.x, room.height - 0.004, (scene.lightSlot.z0 + scene.lightSlot.z1) / 2]} material={r.glow}>
          <boxGeometry args={[0.035, 0.006, scene.lightSlot.z1 - scene.lightSlot.z0]} />
        </mesh>
      )}
    </group>
  );
}
