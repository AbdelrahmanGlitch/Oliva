"use client";

import { useLayoutEffect, useRef } from "react";
import type * as THREE from "three";

import type { KitchenConfig } from "@/data/configurator";
import type { KitchenScene } from "@/data/scenes";
import { CabinetRun } from "./CabinetRun";
import { Dining, Island, Pendants } from "./Furniture";
import { RoomShell } from "./RoomShell";

/** Daylight through the scene's main window; walls cast the shadows that shape the light */
function Sun({ scene, soft }: { scene: KitchenScene; soft: boolean }) {
  const ref = useRef<THREE.DirectionalLight>(null);
  const { position, target, intensity } = scene.sun;
  useLayoutEffect(() => {
    const l = ref.current;
    if (!l) return;
    l.target.position.set(...target);
    l.target.updateMatrixWorld();
  }, [target]);
  const span = Math.max(scene.room.x1 - scene.room.x0, scene.room.depth) + 4;
  return (
    <>
      <directionalLight
        ref={ref}
        position={position}
        intensity={intensity}
        color="#fff3e0"
        castShadow={!soft}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-camera-left={-span}
        shadow-camera-right={span}
        shadow-camera-top={span}
        shadow-camera-bottom={-span}
        shadow-camera-far={30}
      />
    </>
  );
}

export function KitchenSceneModel({ scene, config, soft }: { scene: KitchenScene; config: KitchenConfig; soft: boolean }) {
  const evening = config.light !== "off";
  return (
    <group>
      <ambientLight intensity={evening ? 0.6 : 0.75} />
      <hemisphereLight args={["#fff6ea", "#cfc5b6", 0.55]} />
      <Sun scene={scene} soft={soft} />

      <RoomShell scene={scene} />
      {scene.runs.map((run) => (
        <CabinetRun key={run.id} run={run} scene={scene} config={config} />
      ))}
      {scene.island && <Island island={scene.island} config={config} />}
      {scene.pendants && <Pendants pendants={scene.pendants} ceiling={scene.room.height} light={config.light} />}
      {scene.dining && <Dining dining={scene.dining} />}
    </group>
  );
}
