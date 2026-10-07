"use client";

import { useMemo } from "react";
import type * as THREE from "three";

import type { FinishId } from "@/data/configurator";
import { finishMaterial } from "./materials";

export type V3 = [number, number, number];
export type Face = "front" | "top" | "side";

export const GAP = 0.004;

/** A box whose textured face is scaled in metres */
export function Slab({
  size,
  position,
  finish,
  material,
  face = "front",
  cast = true,
  receive = true,
}: {
  size: V3;
  position: V3;
  finish?: FinishId;
  material?: THREE.Material;
  face?: Face;
  cast?: boolean;
  receive?: boolean;
}) {
  const [w, h, d] = size;
  const mat = useMemo(() => {
    if (material) return material;
    const faceSize: [number, number] = face === "front" ? [w, h] : face === "top" ? [w, d] : [d, h];
    return finishMaterial(finish!, faceSize);
  }, [material, finish, face, w, h, d]);
  return (
    <mesh position={position} castShadow={cast} receiveShadow={receive} material={mat}>
      <boxGeometry args={size} />
    </mesh>
  );
}
