"use client";

import { motion } from "motion/react";
import { useState } from "react";

import { Eyebrow } from "@/components/ui/Button";
import { LineReveal, Reveal } from "@/components/ui/Reveal";

type Part = "drawer" | "pantry" | "vitrine" | "led";

const parts: { id: Part; title: string; body: string; action: string }[] = [
  {
    id: "drawer",
    title: "Handleless drawers",
    body: "A fine channel replaces every handle, as in OLIVA’s graphite and blush kitchens. Inside, wide drawers bring everything to you.",
    action: "Open the drawer",
  },
  {
    id: "pantry",
    title: "Tall storage",
    body: "Floor-to-ceiling units keep provisions and appliances out of sight, so the room stays calm.",
    action: "Open the tall unit",
  },
  {
    id: "vitrine",
    title: "Lit glass cabinets",
    body: "Black-framed glass, lit from within, turns storage into display, as in OLIVA’s smoked-glass and oak kitchens.",
    action: "Light the vitrine",
  },
  {
    id: "led",
    title: "Integrated light line",
    body: "A continuous LED line beneath the wall cabinets, a detail that runs through OLIVA’s work.",
    action: "Toggle the light line",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Functionality() {
  const [state, setState] = useState<Record<Part, boolean>>({ drawer: false, pantry: false, vitrine: false, led: true });
  const [focus, setFocus] = useState<Part>("drawer");
  const toggle = (p: Part) => {
    setFocus(p);
    setState((s) => ({ ...s, [p]: !s[p] }));
  };

  return (
    <section aria-labelledby="function-title" className="section-y bg-surface">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow className="text-terracotta">Function</Eyebrow>
          </div>
          <h2 id="function-title" className="text-display-lg text-espresso lg:col-span-8">
            <LineReveal lines={["Beautiful outside.", <em key="i" className="italic">Considered inside.</em>]} />
          </h2>
        </div>

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-12">
          {/* Elevation drawing */}
          <Reveal className="lg:col-span-8">
            <div className="relative aspect-[16/10] w-full select-none overflow-hidden bg-[#ebe6dd] [perspective:1400px]">
              {/* wall + floor */}
              <div className="absolute inset-x-0 bottom-0 h-[8%] bg-[#d9d3c8]" />

              {/* wall cabinets (walnut) with glass vitrine on the right half */}
              <div className="absolute left-[4%] top-[10%] h-[25%] w-[30%] bg-gradient-to-b from-[#6e4a2e] to-[#5c3d25] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.15)]">
                <div className="absolute inset-y-0 left-1/2 w-px bg-black/25" />
              </div>
              <button
                type="button"
                aria-label="Light the glass vitrine"
                aria-pressed={state.vitrine}
                onClick={() => toggle("vitrine")}
                className="group absolute left-[34.5%] top-[10%] h-[25%] w-[29.5%] border-[3px] border-[#151312] bg-[#231b15]"
              >
                <motion.div
                  className="absolute inset-0"
                  animate={{ opacity: state.vitrine ? 1 : 0 }}
                  transition={{ duration: 0.8 }}
                  style={{ background: "radial-gradient(80% 90% at 50% 40%, rgb(255 214 160 / 0.75), rgb(140 90 50 / 0.5) 60%, transparent)" }}
                />
                {[33, 66].map((t) => (
                  <div key={t} className="absolute inset-x-1 h-px bg-[#c8a578]/60" style={{ top: `${t}%` }} />
                ))}
                <div className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 bg-[#151312]" />
                <Hint active={focus === "vitrine"} className="right-2 top-2" />
              </button>

              {/* LED line + backsplash */}
              <motion.div
                className="led-line absolute left-[4%] top-[35%] w-[60%]"
                animate={{ opacity: state.led ? 1 : 0.08 }}
                transition={{ duration: 0.6 }}
              />
              <motion.div
                className="absolute left-[4%] top-[35.2%] h-[20%] w-[60%]"
                animate={{ opacity: state.led ? 1 : 0 }}
                transition={{ duration: 0.8 }}
                style={{ background: "linear-gradient(to bottom, rgb(255 226 185 / 0.55), transparent 80%)" }}
              />
              <div className="absolute left-[4%] top-[35.2%] h-[20%] w-[60%] bg-[linear-gradient(115deg,transparent_40%,rgb(160_150_140/0.25)_41%,transparent_43%,transparent_70%,rgb(160_150_140/0.2)_71%,transparent_72%)]" />

              {/* worktop */}
              <div className="absolute left-[3.5%] top-[55%] h-[2.6%] w-[61%] bg-[#f4f1ec] shadow-[0_2px_0_rgb(0_0_0/0.08)]" />

              {/* open drawer interior (seen from above, in perspective) */}
              <motion.div
                className="absolute left-[4.6%] top-[57.6%] h-[16%] w-[18.8%] origin-bottom bg-[#d8cfc3]"
                initial={false}
                animate={{ rotateX: state.drawer ? 0 : 90, opacity: state.drawer ? 1 : 0 }}
                transition={{ duration: 0.9, ease }}
                style={{ zIndex: 1 }}
              >
                <div className="grid h-full grid-cols-5 gap-[3px] p-[5%]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-center bg-[#c6bbad]">
                      <div className="h-[70%] w-[18%] rounded-full bg-[#9c968f]" />
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* base units */}
              <div className="absolute left-[4%] top-[57.6%] h-[34.4%] w-[60%] bg-[#b6ab9f]" />
              <motion.button
                type="button"
                aria-label="Open the top drawer"
                aria-pressed={state.drawer}
                onClick={() => toggle("drawer")}
                className="group absolute left-[4%] top-[57.6%] h-[9%] w-[20%] bg-[#bcb1a5] shadow-[inset_0_-2px_0_rgb(30_23_18/0.55)]"
                animate={{ y: state.drawer ? "190%" : "0%", scale: state.drawer ? 1.06 : 1 }}
                transition={{ duration: 0.9, ease }}
                style={{ zIndex: 2 }}
              >
                <Hint active={focus === "drawer"} className="right-2 top-1/2 -translate-y-1/2" />
              </motion.button>
              {/* remaining fronts */}
              {[
                "left-[4%] top-[67.2%] h-[11.6%] w-[20%]",
                "left-[4%] top-[79.4%] h-[12.6%] w-[20%]",
                "left-[24.3%] top-[57.6%] h-[34.4%] w-[9.8%]",
                "left-[34.4%] top-[57.6%] h-[34.4%] w-[9.8%]",
                "left-[44.5%] top-[57.6%] h-[16.6%] w-[19.5%]",
                "left-[44.5%] top-[74.6%] h-[17.4%] w-[19.5%]",
              ].map((c) => (
                <div key={c} className={`absolute ${c} bg-[#bcb1a5] shadow-[inset_0_-2px_0_rgb(30_23_18/0.45)]`} />
              ))}

              {/* tall pantry (door swings open) */}
              <div className="absolute left-[66%] top-[10%] h-[82%] w-[14.5%] bg-[#d9d1c5]">
                {[18, 36, 54, 72].map((t, i) => (
                  <div key={t} className="absolute inset-x-[6%] border-b-2 border-[#a59a8c]" style={{ top: `${t}%`, height: "14%" }}>
                    <div className="flex h-full items-end justify-around px-[6%]">
                      {Array.from({ length: 3 + (i % 2) }).map((_, j) => (
                        <div
                          key={j}
                          className="w-[18%] rounded-t-sm"
                          style={{ height: `${55 + ((i + j) % 3) * 15}%`, background: ["#8b4a2f", "#c9b79c", "#6e4a2e", "#efe8dc"][(i + j) % 4] }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <motion.button
                type="button"
                aria-label="Open the tall unit"
                aria-pressed={state.pantry}
                onClick={() => toggle("pantry")}
                className="group absolute left-[66%] top-[10%] h-[82%] w-[14.5%] origin-left bg-[#b6ab9f] shadow-[inset_-2px_0_0_rgb(30_23_18/0.35)]"
                initial={false}
                animate={{ rotateY: state.pantry ? -105 : 0 }}
                transition={{ duration: 1.1, ease }}
                style={{ transformStyle: "preserve-3d", zIndex: 3 }}
              >
                <Hint active={focus === "pantry"} className="right-2 top-1/2" />
              </motion.button>

              {/* appliance column */}
              <div className="absolute left-[81%] top-[10%] h-[82%] w-[15%] bg-[#b6ab9f]">
                <div className="absolute inset-x-[7%] top-[24%] h-[13%] border border-black/40 bg-[#121212]" />
                <div className="absolute inset-x-[7%] top-[39%] h-[20%] border border-black/40 bg-[#0d0d0d]">
                  <div className="absolute inset-x-[10%] top-[18%] h-px bg-[#444]" />
                </div>
                <div className="absolute inset-x-0 top-[61%] h-px bg-black/25" />
              </div>
              <div className="absolute bottom-[8%] left-[4%] h-[0.8%] w-[92%] bg-black/30" />

              <button
                type="button"
                onClick={() => toggle("led")}
                aria-pressed={state.led}
                className="absolute right-4 top-3 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-espresso/70 hover:text-espresso"
              >
                Light line {state.led ? "on" : "off"}
              </button>
            </div>
            <p className="mt-3 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-espresso/60">
              Concept illustration · interior fittings are specified per project
            </p>
          </Reveal>

          {/* Controls / explanation */}
          <div className="lg:col-span-4">
            <ul className="border-t border-line">
              {parts.map((p, i) => (
                <li key={p.id} className="border-b border-line">
                  <button type="button" onClick={() => toggle(p.id)} className="flex w-full items-start gap-5 py-5 text-left" aria-pressed={state[p.id]}>
                    <span className={`pt-1 text-[0.65rem] tabular-nums tracking-[0.2em] ${focus === p.id ? "text-terracotta" : "text-muted"}`}>0{i + 1}</span>
                    <span className="flex-1">
                      <span className={`block font-display text-2xl transition-colors ${focus === p.id ? "text-espresso" : "text-espresso/50"}`}>{p.title}</span>
                      <motion.span
                        initial={false}
                        animate={{ height: focus === p.id ? "auto" : 0, opacity: focus === p.id ? 1 : 0 }}
                        transition={{ duration: 0.6, ease }}
                        className="block overflow-hidden"
                      >
                        <span className="block pt-2 text-sm leading-relaxed text-muted">{p.body}</span>
                        <span className="mt-3 block text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-espresso">
                          {state[p.id] && p.id !== "led" ? "Close" : p.action} →
                        </span>
                      </motion.span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Hint({ active, className }: { active: boolean; className: string }) {
  return (
    <span aria-hidden className={`pointer-events-none absolute flex h-5 w-5 items-center justify-center ${className}`}>
      <span className={`absolute inset-0 rounded-full bg-terracotta/40 ${active ? "animate-ping" : "opacity-0 group-hover:opacity-100"}`} />
      <span className="relative h-2 w-2 rounded-full bg-terracotta" />
    </span>
  );
}
