"use client";

import { useMemo } from "react";
import * as THREE from "three";

import { tallFinish, type FinishId, type KitchenConfig } from "@/data/configurator";
import { DIM, isTall, runLength, runTransform, type CabinetModule, type CabinetRun as Run, type KitchenScene } from "@/data/scenes";
import { finishMaterial, roomMaterials } from "./materials";
import { GAP, Slab } from "./parts";

const { baseDepth: BASE_D, tallDepth: TALL_D, upperDepth: UPPER_D, plinth: PLINTH, baseTop: BASE_TOP, worktop: WT, upperBottom: UB } = DIM;
const FRONT_H = BASE_TOP - PLINTH - 0.03; // top 3 cm is the handleless channel
const DRAWER_GAP = 0.028;

const drawerSplits: Partial<Record<CabinetModule["type"], number[]>> = {
  drawers3: [0.2, 0.26, 0.28],
  drawers2: [0.34, 0.4],
  hob: [0.34, 0.4],
};

type Placed = CabinetModule & { x0: number; index: number };

function BaseFronts({ m, fronts }: { m: Placed; fronts: FinishId }) {
  const cx = m.x0 + m.w / 2;
  const z = BASE_D + 0.01;
  const split = drawerSplits[m.type];
  if (split) {
    const total = split.reduce((a, b) => a + b, 0);
    const heights = split.map((s, i) => (s / total) * FRONT_H - (i < split.length - 1 ? DRAWER_GAP : 0));
    const bottoms = heights.map((_, i) => PLINTH + heights.slice(0, i).reduce((a, h) => a + h + DRAWER_GAP, 0));
    return (
      <>
        {heights.map((h, i) => (
          <Slab key={i} finish={fronts} size={[m.w - GAP, h, 0.02]} position={[cx, bottoms[i] + h / 2, z]} />
        ))}
      </>
    );
  }
  const doors = (m.type === "doors" || m.type === "sink") && m.w > 0.7 ? 2 : 1;
  const dw = m.w / doors;
  return (
    <>
      {Array.from({ length: doors }).map((_, i) => (
        <Slab key={i} finish={fronts} size={[dw - GAP, FRONT_H, 0.02]} position={[m.x0 + dw * (i + 0.5), PLINTH + FRONT_H / 2, z]} />
      ))}
    </>
  );
}

function WorktopFixtures({ m }: { m: Placed }) {
  const r = roomMaterials();
  const cx = m.x0 + m.w / 2;
  const top = BASE_TOP + WT;
  if (m.type === "hob") {
    return <Slab material={r.blackGlass} size={[Math.min(0.78, m.w - 0.1), 0.006, 0.5]} position={[cx, top + 0.003, 0.32]} cast={false} />;
  }
  if (m.type === "sink") {
    return (
      <group>
        <Slab material={r.shadowGap} size={[m.w - 0.3, 0.008, 0.42]} position={[cx, top + 0.001, 0.32]} cast={false} />
        <mesh position={[cx, top + 0.2, 0.06]} material={r.black} castShadow>
          <cylinderGeometry args={[0.014, 0.016, 0.4, 16]} />
        </mesh>
        <mesh position={[cx, top + 0.4, 0.16]} rotation={[0, Math.PI / 2, 0]} material={r.black} castShadow>
          <torusGeometry args={[0.1, 0.012, 12, 32, Math.PI]} />
        </mesh>
      </group>
    );
  }
  return null;
}

function UpperCabinet({
  m,
  upper,
  glass,
  top,
  light,
}: {
  m: Placed;
  upper: FinishId;
  glass: boolean;
  top: number;
  light: KitchenConfig["light"];
}) {
  const r = roomMaterials();
  const cx = m.x0 + m.w / 2;
  const hood = m.upper === "hood";
  const y0 = hood ? UB + 0.08 : UB;
  const h = top - y0;
  const lit = light !== "off";
  const glow = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#2a1d14",
        emissive: new THREE.Color(light === "neutral" ? "#ffe9c9" : "#ffc58a"),
        emissiveIntensity: lit ? 0.6 : 0.06,
        roughness: 0.8,
      }),
    [light, lit],
  );

  return (
    <group>
      {hood && (
        <>
          <Slab material={r.black} size={[m.w - 0.02, 0.07, UPPER_D + 0.08]} position={[cx, UB + 0.035, (UPPER_D + 0.08) / 2]} />
          <Slab material={r.glow} size={[0.3, 0.004, 0.06]} position={[cx, UB - 0.002, UPPER_D - 0.05]} cast={false} />
        </>
      )}
      {!glass ? (
        <>
          <Slab material={r.shadowGap} size={[m.w, h, UPPER_D - 0.02]} position={[cx, y0 + h / 2, (UPPER_D - 0.02) / 2]} />
          <Slab finish={upper} size={[m.w - GAP, h, 0.02]} position={[cx, y0 + h / 2, UPPER_D - 0.01]} />
        </>
      ) : (
        <>
          <Slab material={finishMaterial(upper === "smoked" ? "walnut" : "oak", [m.w, h])} size={[m.w, h, 0.01]} position={[cx, y0 + h / 2, 0.02]} cast={false} />
          {[0.36, 0.68].map((f) => (
            <Slab key={f} material={glow} size={[m.w - 0.06, 0.012, UPPER_D - 0.06]} position={[cx, y0 + h * f, UPPER_D / 2]} cast={false} />
          ))}
          <Slab material={glow} size={[0.012, h - 0.04, 0.02]} position={[m.x0 + 0.03, y0 + h / 2, UPPER_D - 0.05]} cast={false} />
          <Slab material={r.black} size={[m.w, 0.02, UPPER_D]} position={[cx, y0 + 0.01, UPPER_D / 2]} />
          <Slab material={r.black} size={[m.w, 0.02, UPPER_D]} position={[cx, top - 0.01, UPPER_D / 2]} />
          <Slab material={r.black} size={[0.02, h, UPPER_D]} position={[m.x0 + 0.01, y0 + h / 2, UPPER_D / 2]} />
          <Slab material={r.black} size={[0.02, h, UPPER_D]} position={[m.x0 + m.w - 0.01, y0 + h / 2, UPPER_D / 2]} />
          <Slab finish="smoked" size={[m.w - 0.04, h - 0.04, 0.006]} position={[cx, y0 + h / 2, UPPER_D - 0.004]} cast={false} />
        </>
      )}
    </group>
  );
}

function OpenShelves({ m, upper, top }: { m: Placed; upper: FinishId; top: number }) {
  // shelves take the wall-cabinet finish when it is a wood, otherwise walnut
  const finish: FinishId = upper === "oak" || upper === "walnut" || upper === "fluted" ? upper : "walnut";
  const cx = m.x0 + m.w / 2;
  const r = roomMaterials();
  return (
    <group>
      {[UB + 0.1, UB + (top - UB) * 0.55].map((y, i) => (
        <group key={i}>
          <Slab finish={finish} face="top" size={[m.w - 0.02, 0.035, 0.3]} position={[cx, y, 0.15]} />
          {/* a few objects so open shelving reads as shelving */}
          <mesh position={[cx - m.w * 0.22, y + 0.1, 0.15]} material={r.fabric} castShadow>
            <cylinderGeometry args={[0.05, 0.045, 0.17, 20]} />
          </mesh>
          <mesh position={[cx + m.w * 0.18, y + 0.06, 0.14]} material={i ? r.brushed : r.fabric} castShadow>
            <boxGeometry args={[0.16, 0.09, 0.16]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function TallUnit({ m, finish, top }: { m: Placed; finish: FinishId; top: number }) {
  const r = roomMaterials();
  const cx = m.x0 + m.w / 2;
  const z = TALL_D;
  if (m.type === "tall-oven") {
    return (
      <group>
        <Slab finish={finish} size={[m.w - GAP, 0.74, 0.02]} position={[cx, PLINTH + 0.37, z]} />
        <Slab material={r.blackGlass} size={[m.w - 0.03, 0.58, 0.02]} position={[cx, 0.88 + 0.29, z]} />
        <Slab material={r.steel} size={[m.w - 0.12, 0.012, 0.02]} position={[cx, 1.4, z + 0.015]} cast={false} />
        <Slab material={r.blackGlass} size={[m.w - 0.03, 0.38, 0.02]} position={[cx, 1.5 + 0.19, z]} />
        <Slab finish={finish} size={[m.w - GAP, top - 1.92, 0.02]} position={[cx, 1.92 + (top - 1.92) / 2, z]} />
      </group>
    );
  }
  // fridge and pantry: two integrated doors
  const split = m.type === "tall-fridge" ? 1.32 : 1.5;
  return (
    <group>
      <Slab finish={finish} size={[m.w - GAP, split, 0.02]} position={[cx, PLINTH + split / 2, z]} />
      <Slab finish={finish} size={[m.w - GAP, top - PLINTH - split - GAP, 0.02]} position={[cx, PLINTH + split + (top - PLINTH - split) / 2, z]} />
    </group>
  );
}

/** contiguous [x0, x1] spans of modules matching a predicate */
function spans(mods: Placed[], pred: (m: Placed) => boolean) {
  const sorted = [...mods].sort((a, b) => a.x0 - b.x0);
  const out: [number, number][] = [];
  for (const m of sorted) {
    if (!pred(m)) continue;
    const last = out[out.length - 1];
    if (last && Math.abs(last[1] - m.x0) < 1e-6) last[1] = m.x0 + m.w;
    else out.push([m.x0, m.x0 + m.w]);
  }
  return out;
}

export function CabinetRun({ run, scene, config }: { run: Run; scene: KitchenScene; config: KitchenConfig }) {
  const r = roomMaterials();
  const t = runTransform(run, scene.room);
  const L = runLength(run);
  const upperTop = scene.upperTop;
  const tallTop = Math.min(upperTop + 0.2, scene.room.height - 0.15);
  const tall = tallFinish(config);

  // local placement (left-wall runs are laid out in reverse so data order stays back → front)
  const placed: Placed[] = run.modules.map((m, index) => {
    const cum = run.modules.slice(0, index).reduce((a, p) => a + p.w, 0);
    return { ...m, x0: t.reversed ? L - cum - m.w : cum, index };
  });

  const base = placed.filter((m) => !isTall(m.type));
  const talls = placed.filter((m) => isTall(m.type));
  const baseSpans = spans(placed, (m) => !isTall(m.type));
  const hasUpper = (m: Placed) => !isTall(m.type) && m.upper !== "none" && !(m.upper === "shelf" && config.shelves === "open");
  const ledSpans = spans(placed, (m) => !isTall(m.type) && m.upper !== "none");
  const glassAll = config.upper === "smoked";
  const ledColor = config.light === "neutral" ? "#fff0dc" : "#ffcf94";

  return (
    <group position={t.position} rotation={[0, t.rotationY, 0]}>
      {/* base carcass, plinth, worktop */}
      {baseSpans.map(([a, b]) => {
        const w = b - a;
        const cx = (a + b) / 2;
        return (
          <group key={`b${a}`}>
            <Slab material={r.shadowGap} size={[w, BASE_TOP - PLINTH, BASE_D - 0.02]} position={[cx, PLINTH + (BASE_TOP - PLINTH) / 2, (BASE_D - 0.02) / 2]} />
            <Slab material={r.shadowGap} size={[w, PLINTH, BASE_D - 0.08]} position={[cx, PLINTH / 2, (BASE_D - 0.08) / 2]} />
            <Slab finish={config.worktop} face="top" size={[w + 0.01, WT, BASE_D + 0.03]} position={[cx, BASE_TOP + WT / 2, (BASE_D + 0.03) / 2]} />
          </group>
        );
      })}

      {base.map((m) => (
        <group key={m.index}>
          <BaseFronts m={m} fronts={config.fronts} />
          <WorktopFixtures m={m} />
          {/* backsplash slab: full height under wall units, a low upstand under windows */}
          <Slab
            finish={config.worktop}
            size={[m.w, (m.upper === "none" ? 0.2 : UB - BASE_TOP - WT) - 0.001, 0.015]}
            position={[m.x0 + m.w / 2, BASE_TOP + WT + (m.upper === "none" ? 0.2 : UB - BASE_TOP - WT) / 2, 0.0075]}
            cast={false}
          />
          {hasUpper(m) && (
            <UpperCabinet
              m={m}
              upper={config.upper}
              glass={m.upper !== "hood" && (glassAll || (config.upper === "oak" && m.index % 3 === 1))}
              top={upperTop}
              light={config.light}
            />
          )}
          {m.upper === "shelf" && config.shelves === "open" && <OpenShelves m={m} upper={config.upper} top={upperTop} />}
        </group>
      ))}

      {/* tall units */}
      {talls.length > 0 &&
        spans(placed, (m) => isTall(m.type)).map(([a, b]) => (
          <Slab key={`t${a}`} material={r.shadowGap} size={[b - a, tallTop, TALL_D - 0.02]} position={[(a + b) / 2, tallTop / 2, (TALL_D - 0.02) / 2]} />
        ))}
      {talls.map((m) => (
        <TallUnit key={m.index} m={m} finish={tall} top={tallTop} />
      ))}

      {/* LED light line under wall units */}
      {ledSpans.map(([a, b]) => (
        <group key={`l${a}`}>
          <mesh position={[(a + b) / 2, UB - 0.006, UPPER_D - 0.06]}>
            <boxGeometry args={[b - a - 0.04, 0.008, 0.02]} />
            <meshBasicMaterial color={config.light === "off" ? "#3a332d" : ledColor} toneMapped={false} />
          </mesh>
          {config.light !== "off" && (
            <rectAreaLight
              position={[(a + b) / 2, UB - 0.01, UPPER_D - 0.08]}
              rotation={[-Math.PI / 2, 0, 0]}
              width={b - a}
              height={0.06}
              intensity={14}
              color={ledColor}
            />
          )}
        </group>
      ))}
    </group>
  );
}
