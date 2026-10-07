"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { defaultConfig, describeConfig, presets, type KitchenConfig, type PresetId } from "@/data/configurator";
import { getProject } from "@/data/projects";
import { getScene, kitchenScenes } from "@/data/scenes";
import { PRESET_EVENT, sendConfigToForm } from "@/lib/events";
import { Eyebrow } from "@/components/ui/Button";
import { LineReveal, Reveal } from "@/components/ui/Reveal";
import { ScenePlan } from "@/components/studio/ScenePlan";
import { StudioControls } from "@/components/studio/StudioControls";
import { CompareSpaces } from "@/components/studio/CompareSpaces";

const Kitchen3DViewer = dynamic(() => import("@/components/three/Kitchen3DViewer"), { ssr: false });

const poster = getProject("greige-fluted-wood")!;
const STORAGE_KEY = "oliva-studio-design";
const FADE_MS = 450;
const ease = [0.22, 1, 0.36, 1] as const;

function readSavedDesign(): Partial<KitchenConfig> | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<KitchenConfig>) : null;
  } catch {
    return null;
  }
}

export function KitchenStudio() {
  const sectionRef = useRef<HTMLElement>(null);
  const [config, setConfig] = useState<KitchenConfig>(defaultConfig);
  const [preset, setPreset] = useState<PresetId | null>("warm-walnut");
  const [sceneId, setSceneId] = useState(kitchenScenes[0].id); // requested
  const [shownId, setShownId] = useState(kitchenScenes[0].id); // rendered (after fade)
  const [fading, setFading] = useState(false);
  const [cameraId, setCameraId] = useState("hero");
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [compare, setCompare] = useState(false);
  const timers = useRef<number[]>([]);
  const restored = useRef(false);

  const scene = getScene(shownId);
  const selected = getScene(sceneId);

  // Restore ?scene= and the visitor's saved design (async so first render matches the server)
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const fromUrl = new URLSearchParams(window.location.search).get("scene");
      if (fromUrl && kitchenScenes.some((s) => s.id === fromUrl)) {
        setSceneId(fromUrl);
        setShownId(fromUrl);
        setLoad(true);
      }
      const saved = readSavedDesign();
      if (saved) {
        setConfig((c) => ({ ...c, ...saved }));
        setPreset(null);
      }
      restored.current = true;
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // Remember the design for this visitor
  useEffect(() => {
    if (!restored.current) return; // don't overwrite the saved design before it has been read
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      /* storage unavailable: the design simply isn't remembered */
    }
  }, [config]);

  // Desktop: load the 3D scene when the section approaches. Mobile: on tap only.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !window.matchMedia("(min-width: 1024px)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onPreset = (e: Event) => {
      const id = (e as CustomEvent<PresetId>).detail;
      setConfig(presets[id].config);
      setPreset(id);
      setLoad(true);
    };
    window.addEventListener(PRESET_EVENT, onPreset);
    return () => window.removeEventListener(PRESET_EVENT, onPreset);
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  /** Cinematic room change: soften the current room, swap, let the camera settle, reveal */
  const selectScene = useCallback(
    (id: string) => {
      if (id === sceneId) return;
      setSceneId(id);
      setLoad(true);
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("scene", id);
        window.history.replaceState(window.history.state, "", url);
      } catch {
        /* ignore */
      }
      if (!ready) {
        setShownId(id);
        setCameraId("hero");
        return;
      }
      timers.current.forEach(clearTimeout);
      setFading(true);
      timers.current = [
        window.setTimeout(() => {
          setShownId(id);
          setCameraId("hero");
        }, FADE_MS),
        window.setTimeout(() => setFading(false), FADE_MS + 250),
      ];
    },
    [sceneId, ready],
  );

  const update = <K extends keyof KitchenConfig>(key: K, value: KitchenConfig[K]) => {
    setConfig((c) => ({ ...c, [key]: value }));
    setPreset(null);
  };
  const applyPreset = (id: PresetId) => {
    setConfig(presets[id].config);
    setPreset(id);
    setLoad(true);
  };

  const summary = describeConfig(config, scene);
  const controls = <StudioControls scene={scene} config={config} preset={preset} onChange={update} onPreset={applyPreset} />;

  return (
    <section id="studio" ref={sectionRef} aria-labelledby="studio-title" className="section-y bg-paper">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <Eyebrow className="text-terracotta">OLIVA 3D Kitchen Studio · Interactive concept</Eyebrow>
            <h2 id="studio-title" className="text-display-lg mt-6 text-espresso">
              <LineReveal lines={["Choose your", <em key="i" className="italic">space.</em>]} />
            </h2>
          </div>
          <Reveal className="max-w-md">
            <p className="text-[0.95rem] leading-relaxed text-muted">
              Explore different kitchen layouts, proportions and design possibilities. Step into each room, then change the fronts,
              wall cabinets, worktop and light. Every finish is one found in OLIVA’s own kitchens.
            </p>
          </Reveal>
        </div>

        {/* Mobile / tablet scene selector */}
        <div className="no-scrollbar -mx-[var(--gutter)] mt-10 flex scroll-px-[var(--gutter)] snap-x snap-mandatory gap-2 overflow-x-auto px-[var(--gutter)] lg:hidden" role="tablist" aria-label="Kitchen spaces">
          {kitchenScenes.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={s.id === sceneId}
              onClick={() => selectScene(s.id)}
              className={`flex w-[44%] shrink-0 snap-start flex-col border p-3 text-left transition-colors sm:w-[30%] ${
                s.id === sceneId ? "border-espresso bg-surface" : "border-espresso/15"
              }`}
            >
              <span className="flex h-16 items-center justify-center text-espresso">
                <ScenePlan scene={s} className="h-full w-auto" />
              </span>
              <span className="mt-2 text-[0.58rem] font-semibold tracking-[0.2em] text-terracotta">{s.number} · {s.badge.toUpperCase()}</span>
              <span className="text-[0.75rem] text-espresso">{s.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-8 lg:mt-14 lg:grid-cols-12 lg:gap-10">
          {/* Viewer */}
          <div className="lg:col-span-8">
            <div className="lg:sticky lg:top-24">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#e8e2d8] sm:aspect-[16/11] lg:aspect-auto lg:h-[min(72vh,680px)]">
                {load ? (
                  <Kitchen3DViewer scene={scene} config={config} cameraId={cameraId} onReady={() => setReady(true)} />
                ) : (
                  <div className="absolute inset-0">
                    <Image src={poster.cover.src} alt="" fill placeholder="blur" sizes="(min-width:1024px) 60vw, 100vw" className="object-cover opacity-90" />
                    <div className="absolute inset-0 bg-paper/55 backdrop-blur-sm" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center">
                      <p className="font-display text-3xl font-light text-espresso sm:text-4xl">Step into the 3D studio</p>
                      <button
                        type="button"
                        onClick={() => setLoad(true)}
                        className="arrow-link inline-flex h-14 items-center gap-3 bg-espresso px-8 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ivory hover:bg-terracotta"
                      >
                        Enter {selected.badge} kitchen <span className="arrow">→</span>
                      </button>
                      <p className="text-[0.62rem] uppercase tracking-[0.2em] text-muted">Lightweight · loads only when you ask</p>
                    </div>
                  </div>
                )}

                {/* room change: soft architectural fade with the new room's name */}
                <AnimatePresence>
                  {load && (!ready || fading) && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center bg-[#e8e2d8]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: FADE_MS / 1000, ease }}
                    >
                      <div className="text-center">
                        <p className="text-[0.6rem] font-semibold tracking-[0.28em] text-terracotta">
                          {selected.number} · {selected.badge.toUpperCase()}
                        </p>
                        <p className="mt-2 font-display text-3xl font-light text-espresso">{selected.name}</p>
                        <div className="mx-auto mt-4 h-px w-32 overflow-hidden bg-espresso/10">
                          <motion.div className="h-px w-1/3 bg-terracotta" animate={{ x: ["-100%", "300%"] }} transition={{ duration: 1.2, repeat: Infinity }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {load && (
                  <>
                    <div className="no-scrollbar absolute inset-x-3 top-3 flex gap-1 overflow-x-auto sm:inset-x-4 sm:top-4" role="group" aria-label="Camera views">
                      {scene.cameras.map((c) => (
                        <button
                          key={`${scene.id}-${c.id}`}
                          type="button"
                          onClick={() => setCameraId(c.id)}
                          aria-pressed={cameraId === c.id}
                          className={`h-9 shrink-0 px-3 text-[0.58rem] font-semibold uppercase tracking-[0.18em] backdrop-blur transition-colors sm:px-4 ${
                            cameraId === c.id ? "bg-espresso text-ivory" : "bg-paper/80 text-espresso hover:bg-paper"
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                    <div className="pointer-events-none absolute inset-x-3 bottom-3 flex flex-wrap items-end justify-between gap-2 sm:inset-x-4 sm:bottom-4">
                      <span className="bg-paper/85 px-3 py-2 text-[0.56rem] font-semibold uppercase tracking-[0.2em] text-espresso backdrop-blur">
                        Interactive concept · finishes from OLIVA projects
                      </span>
                      <span className="hidden text-[0.56rem] uppercase tracking-[0.2em] text-espresso/60 sm:block">Drag to rotate · Scroll to zoom · Right-drag to pan</span>
                    </div>
                  </>
                )}
              </div>

              {/* Scene note + plan */}
              <div className="mt-5 grid items-center gap-5 border-b border-line pb-5 sm:grid-cols-[1fr_auto]">
                <AnimatePresence mode="wait">
                  <motion.div key={selected.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease }}>
                    <p className="text-[0.6rem] font-semibold tracking-[0.24em] text-terracotta">
                      {selected.number} · {selected.badge.toUpperCase()} · {selected.label.toUpperCase()}
                    </p>
                    <p className="mt-2 font-display text-2xl text-espresso">{selected.tagline}</p>
                    <p className="mt-1 max-w-lg text-sm leading-relaxed text-muted">{selected.description}</p>
                  </motion.div>
                </AnimatePresence>
                <div className="flex items-center gap-5">
                  <div className="h-20 w-28 text-espresso">
                    <ScenePlan scene={selected} className="h-full w-full" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setCompare((v) => !v)}
                    aria-expanded={compare}
                    aria-controls="compare-spaces"
                    className="arrow-link whitespace-nowrap text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-espresso"
                  >
                    <span className="u-grow pb-1">{compare ? "Hide comparison" : "Compare spaces"}</span> <span className="arrow">→</span>
                  </button>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {compare && (
                  <motion.div
                    id="compare-spaces"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.6, ease }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6">
                      <CompareSpaces activeId={sceneId} onSelect={selectScene} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mobile: open finishes in a bottom sheet */}
              <button
                type="button"
                onClick={() => setSheet(true)}
                className="arrow-link mt-5 inline-flex h-12 w-full items-center justify-center gap-3 border border-espresso text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-espresso lg:hidden"
              >
                Customise finishes <span className="arrow">→</span>
              </button>
            </div>
          </div>

          {/* Desktop panel */}
          <div className="lg:col-span-4">
            <div className="hidden lg:block">
              <p className="text-eyebrow text-muted">Kitchen spaces</p>
              <ul className="mt-4 border-t border-line" role="tablist" aria-label="Kitchen spaces">
                {kitchenScenes.map((s) => {
                  const active = s.id === sceneId;
                  return (
                    <li key={s.id} className="border-b border-line">
                      <button
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => selectScene(s.id)}
                        className={`group relative flex w-full items-center gap-4 py-3 pl-4 text-left transition-colors ${active ? "bg-surface" : "hover:bg-surface/60"}`}
                      >
                        <span className={`absolute inset-y-0 left-0 w-0.5 transition-colors ${active ? "bg-terracotta" : "bg-transparent"}`} />
                        <span className="text-[0.62rem] tabular-nums tracking-[0.2em] text-muted">{s.number}</span>
                        <span className="flex-1">
                          <span className={`block text-[0.7rem] font-semibold uppercase tracking-[0.2em] ${active ? "text-espresso" : "text-espresso/70"}`}>{s.badge}</span>
                          <span className="block font-display text-lg leading-tight text-muted">{s.label}</span>
                        </span>
                        <span className={`mr-3 flex h-12 w-16 items-center justify-center ${active ? "text-espresso" : "text-espresso/50"}`}>
                          <ScenePlan scene={s} className="h-full w-auto" />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-8">{!sheet && controls}</div>
            </div>

            <div className="mt-2 bg-surface p-6 lg:mt-8">
              <p className="font-display text-2xl text-espresso">Your configuration is ready.</p>
              <dl className="mt-4 space-y-2 text-sm">
                {summary.map((s) => (
                  <div key={s.part} className="flex justify-between gap-4">
                    <dt className="text-muted">{s.part}</dt>
                    <dd className="text-right text-espresso">{s.value}</dd>
                  </div>
                ))}
              </dl>
              <button
                type="button"
                onClick={() => sendConfigToForm(summary.map((s) => `${s.part}: ${s.value}`).join("\n"), preset ? presets[preset].label : undefined)}
                className="arrow-link mt-6 inline-flex h-14 w-full items-center justify-center gap-3 bg-espresso text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-terracotta"
              >
                Request a consultation <span className="arrow">→</span>
              </button>
              <p className="mt-3 text-[0.62rem] leading-relaxed text-muted">
                A concept to start the conversation. Your design is remembered on this device. OLIVA’s engineers design the real kitchen around your space.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {sheet && (
          <>
            <motion.div className="fixed inset-0 z-[65] bg-ink/40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(false)} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Customise finishes"
              className="fixed inset-x-0 bottom-0 z-[66] max-h-[78vh] overflow-y-auto rounded-t-2xl bg-paper px-[var(--gutter)] pb-8 pt-3 lg:hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.55, ease }}
            >
              <div className="sticky top-0 z-10 -mx-[var(--gutter)] flex items-center justify-between bg-paper px-[var(--gutter)] pb-3">
                <span className="mx-auto mb-2 block h-1 w-10 rounded-full bg-espresso/20" aria-hidden />
              </div>
              <div className="mb-4 flex items-center justify-between">
                <p className="font-display text-2xl text-espresso">{scene.badge} finishes</p>
                <button type="button" onClick={() => setSheet(false)} className="h-10 px-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em]" autoFocus>
                  Done
                </button>
              </div>
              {controls}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
