"use client";

import { CameraControls, ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";

import type { KitchenConfig } from "@/data/configurator";
import { kitchenScenes, type KitchenScene } from "@/data/scenes";
import { KitchenSceneModel } from "./KitchenSceneModel";
import { prewarm } from "./materials";

RectAreaLightUniformsLib.init();

function Rig({ scene, cameraId }: { scene: KitchenScene; cameraId: string }) {
  const ref = useRef<CameraControls>(null);
  const lastScene = useRef<string | null>(null);
  const getState = useThree((st) => st.get);

  // per-scene lens
  useEffect(() => {
    const cam = getState().camera;
    if (cam instanceof THREE.PerspectiveCamera) {
      cam.fov = scene.fov ?? 40;
      cam.updateProjectionMatrix();
    }
  }, [getState, scene]);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const preset = scene.cameras.find((p) => p.id === cameraId) ?? scene.cameras[0];
    const [px, py, pz] = preset.position;
    const [tx, ty, tz] = preset.target;
    if (lastScene.current !== scene.id) {
      // entering a new room: start slightly pulled back, then settle into the view
      lastScene.current = scene.id;
      c.setLookAt(tx + (px - tx) * 1.35, py + 0.35, tz + (pz - tz) * 1.35, tx, ty, tz, false);
    }
    c.setLookAt(px, py, pz, tx, ty, tz, true);
  }, [scene, cameraId]);

  const far = Math.max(...scene.cameras.map((p) => Math.hypot(p.position[0] - p.target[0], p.position[1] - p.target[1], p.position[2] - p.target[2])));

  return (
    <CameraControls
      ref={ref}
      makeDefault
      minDistance={0.4}
      maxDistance={far * 1.35}
      maxPolarAngle={Math.PI * 0.49}
      smoothTime={0.75}
      dollySpeed={0.5}
    />
  );
}

export default function Kitchen3DViewer({
  scene,
  config,
  cameraId,
  onReady,
}: {
  scene: KitchenScene;
  config: KitchenConfig;
  cameraId: string;
  onReady?: () => void;
}) {
  // Rendered client-only (ssr: false), so window is available here
  const [small] = useState(() => window.matchMedia("(max-width: 767px)").matches);

  // Pre-generate the next room's floor and wall textures while the browser is idle
  useEffect(() => {
    const i = kitchenScenes.findIndex((s) => s.id === scene.id);
    const next = kitchenScenes[(i + 1) % kitchenScenes.length];
    const run = () => prewarm(next.floor, next.wallFinish);
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    const id = w.requestIdleCallback ? w.requestIdleCallback(run) : window.setTimeout(run, 1500);
    return () => {
      if (!w.requestIdleCallback) window.clearTimeout(id);
    };
  }, [scene.id]);

  const hero = scene.cameras[0];

  return (
    <Canvas
      shadows={!small}
      dpr={small ? [1, 1.25] : [1, 1.75]}
      camera={{ position: hero.position, fov: 40, near: 0.05, far: 80 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.18 }}
      onCreated={() => onReady?.()}
      aria-label={`Interactive 3D concept: ${scene.name}`}
    >
      <color attach="background" args={["#e8e2d8"]} />
      <fog attach="fog" args={["#e8e2d8", 12, 30]} />

      {/* Studio reflections without downloading an HDR */}
      <Environment resolution={small ? 64 : 256} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[0, 5, 2]} rotation-x={Math.PI / 2} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[6, 2, 4]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} color="#fff3e2" />
        <Lightformer form="rect" intensity={0.8} position={[-6, 2, 3]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer form="ring" intensity={1.5} position={[0, 3, 8]} scale={2} color="#ffe2bf" />
      </Environment>

      <Suspense fallback={null}>
        {/* keyed by scene: switching rooms unmounts (and disposes) the previous room's geometry */}
        <KitchenSceneModel key={scene.id} scene={scene} config={config} soft={small} />
      </Suspense>

      <ContactShadows
        key={`cs-${scene.id}`}
        position={[(scene.room.x0 + scene.room.x1) / 2, 0.002, scene.room.depth / 2]}
        opacity={0.4}
        scale={Math.max(scene.room.x1 - scene.room.x0, scene.room.depth) + 4}
        blur={2.4}
        far={2.5}
        resolution={small ? 256 : 512}
      />
      <Rig scene={scene} cameraId={cameraId} />
    </Canvas>
  );
}
