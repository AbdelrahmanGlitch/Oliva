"use client";

import type { FinishId, KitchenConfig } from "@/data/configurator";
import type { KitchenScene } from "@/data/scenes";
import { roomMaterials } from "./materials";
import { Slab } from "./parts";

function Stool({ position }: { position: [number, number, number] }) {
  const r = roomMaterials();
  return (
    <group position={position}>
      <mesh position={[0, 0.66, 0]} material={r.fabric} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.19, 0.07, 32]} />
      </mesh>
      <mesh position={[0, 0.83, 0.15]} rotation={[0.2, 0, 0]} material={r.fabric} castShadow>
        <boxGeometry args={[0.36, 0.22, 0.05]} />
      </mesh>
      {[
        [-0.13, -0.13],
        [0.13, -0.13],
        [-0.13, 0.13],
        [0.13, 0.13],
      ].map(([lx, lz]) => (
        <mesh key={`${lx}${lz}`} position={[lx, 0.32, lz]} material={r.black} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.64, 8]} />
        </mesh>
      ))}
    </group>
  );
}

export function Island({ island, config }: { island: NonNullable<KitchenScene["island"]>; config: KitchenConfig }) {
  const r = roomMaterials();
  const { w: W, d: D } = island;
  const H = 0.9;
  const T = 0.04;
  const body: FinishId = config.island === "match" ? config.fronts : config.island;
  const stoneIsland = config.island === "greenStone" || config.island === "whiteStone";
  const topFinish: FinishId = stoneIsland ? (config.island as FinishId) : config.worktop;
  const waterfall = stoneIsland || topFinish === "whiteStone" || topFinish === "goldVein" || topFinish === "greenStone";
  const seats = Array.from({ length: island.seats }, (_, i) => (i - (island.seats - 1) / 2) * 0.7);

  return (
    <group position={[island.x, 0, island.z]}>
      <Slab finish={body} size={[W - (waterfall ? 2 * T : 0), H - T, D - 0.04]} position={[0, (H - T) / 2, 0]} />
      <Slab finish={topFinish} face="top" size={[W, T, D]} position={[0, H - T / 2, 0]} />
      {waterfall && (
        <>
          <Slab finish={topFinish} face="side" size={[T, H - T, D]} position={[-W / 2 + T / 2, (H - T) / 2, 0]} />
          <Slab finish={topFinish} face="side" size={[T, H - T, D]} position={[W / 2 - T / 2, (H - T) / 2, 0]} />
        </>
      )}
      <Slab material={r.shadowGap} size={[0.62, 0.01, 0.42]} position={[0.45, H + 0.001, -0.12]} cast={false} />
      <group position={[0.45, H, -0.4]}>
        <mesh position={[0, 0.2, 0]} material={r.black} castShadow>
          <cylinderGeometry args={[0.014, 0.016, 0.4, 16]} />
        </mesh>
        <mesh position={[0, 0.4, 0.1]} rotation={[0, Math.PI / 2, 0]} material={r.black} castShadow>
          <torusGeometry args={[0.1, 0.012, 12, 32, Math.PI]} />
        </mesh>
      </group>
      {seats.map((sx) => (
        <Stool key={sx} position={[sx, 0, D / 2 + 0.38]} />
      ))}
    </group>
  );
}

export function Pendants({ pendants, ceiling, light }: { pendants: NonNullable<KitchenScene["pendants"]>; ceiling: number; light: KitchenConfig["light"] }) {
  const r = roomMaterials();
  const color = light === "neutral" ? "#fff0dc" : "#ffcf94";
  const drop = 2.0;
  const xs = Array.from({ length: pendants.count }, (_, i) => (i - (pendants.count - 1) / 2) * pendants.spacing);
  return (
    <group position={[pendants.x, 0, pendants.z]}>
      {xs.map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, (ceiling + drop) / 2, 0]} material={r.black}>
            <cylinderGeometry args={[0.003, 0.003, ceiling - drop, 6]} />
          </mesh>
          <mesh position={[0, drop, 0]} material={r.black} castShadow>
            <cylinderGeometry args={[0.055, 0.055, 0.22, 24]} />
          </mesh>
          <mesh position={[0, drop - 0.115, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.048, 24]} />
            <meshBasicMaterial color={light === "off" ? "#444" : color} toneMapped={false} />
          </mesh>
          {light !== "off" && <pointLight position={[0, drop - 0.2, 0]} intensity={0.9} distance={2.4} decay={2} color={color} />}
        </group>
      ))}
    </group>
  );
}

/** Dining table + chairs for open-plan scenes */
export function Dining({ dining }: { dining: NonNullable<KitchenScene["dining"]> }) {
  const r = roomMaterials();
  const { x, z, w, d } = dining;
  const chairs: [number, number, number][] = [
    [-w / 3, 0, -d / 2 - 0.3],
    [w / 3, 0, -d / 2 - 0.3],
    [-w / 3, 0, d / 2 + 0.3],
    [w / 3, 0, d / 2 + 0.3],
  ];
  return (
    <group position={[x, 0, z]}>
      <Slab finish="walnut" face="top" size={[w, 0.04, d]} position={[0, 0.74, 0]} />
      {[
        [-w / 2 + 0.12, -d / 2 + 0.12],
        [w / 2 - 0.12, -d / 2 + 0.12],
        [-w / 2 + 0.12, d / 2 - 0.12],
        [w / 2 - 0.12, d / 2 - 0.12],
      ].map(([lx, lz]) => (
        <Slab key={`${lx}${lz}`} material={r.black} size={[0.04, 0.72, 0.04]} position={[lx, 0.36, lz]} />
      ))}
      {chairs.map((p, i) => (
        <group key={i} position={p} rotation={[0, i < 2 ? 0 : Math.PI, 0]}>
          <Slab material={r.fabric} size={[0.44, 0.06, 0.42]} position={[0, 0.46, 0]} />
          <Slab finish="walnut" size={[0.44, 0.4, 0.04]} position={[0, 0.7, -0.2]} />
          {[
            [-0.19, -0.18],
            [0.19, -0.18],
            [-0.19, 0.18],
            [0.19, 0.18],
          ].map(([lx, lz]) => (
            <Slab key={`${lx}${lz}`} finish="walnut" size={[0.03, 0.44, 0.03]} position={[lx, 0.22, lz]} />
          ))}
        </group>
      ))}
    </group>
  );
}
