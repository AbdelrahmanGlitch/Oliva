"use client";

import {
  finishes,
  options,
  presets,
  type Finish,
  type FinishId,
  type KitchenConfig,
  type LightMode,
  type PresetId,
} from "@/data/configurator";
import type { KitchenScene } from "@/data/scenes";

export function swatchStyle(f: Finish): React.CSSProperties {
  switch (f.kind) {
    case "wood":
      return { background: `repeating-linear-gradient(92deg, ${f.color} 0 3px, ${f.detail} 3px 4px, ${f.color} 4px 7px)` };
    case "fluted":
      return { background: `repeating-linear-gradient(90deg, ${f.color} 0 4px, ${f.detail} 4px 6px)` };
    case "stone":
      return { background: `linear-gradient(130deg, ${f.color} 0 40%, ${f.detail} 42%, ${f.color} 46% 70%, ${f.detail} 71%, ${f.color} 73%)` };
    case "glass":
      return { background: "linear-gradient(160deg, #1e1712, #6b4a2e 60%, #e0a868)" };
    case "gloss":
      return { background: `linear-gradient(135deg, ${f.color} 0 55%, #5a6b61 75%, ${f.color})` };
    default:
      return { background: f.color };
  }
}

function SwatchGroup({
  label,
  value,
  items,
  onChange,
  name,
}: {
  label: string;
  value: string;
  items: { id: string; label: string; style: React.CSSProperties }[];
  onChange: (v: string) => void;
  name: string;
}) {
  const current = items.find((i) => i.id === value);
  return (
    <fieldset className="border-b border-line py-5">
      <legend className="sr-only">{label}</legend>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-eyebrow text-muted">{label}</span>
        <span className="text-right font-display text-lg text-espresso">{current?.label}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {items.map((it) => (
          <label key={it.id} className="cursor-pointer" title={it.label}>
            <input type="radio" name={name} value={it.id} checked={value === it.id} onChange={() => onChange(it.id)} className="peer sr-only" />
            <span
              className="block h-10 w-10 rounded-full border border-espresso/15 ring-offset-2 ring-offset-paper transition-[box-shadow,transform] duration-300 hover:scale-105 peer-checked:ring-1 peer-checked:ring-espresso peer-focus-visible:ring-2 peer-focus-visible:ring-terracotta"
              style={it.style}
            />
            <span className="sr-only">{it.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Segmented<T extends string>({ label, value, items, onChange }: { label: string; value: T; items: { id: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <fieldset className="border-b border-line py-5">
      <legend className="sr-only">{label}</legend>
      <span className="text-eyebrow text-muted">{label}</span>
      <div className="mt-4 grid gap-2" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            onClick={() => onChange(it.id)}
            aria-pressed={value === it.id}
            className={`h-10 border text-[0.62rem] font-semibold uppercase tracking-[0.16em] transition-colors ${
              value === it.id ? "border-espresso bg-espresso text-ivory" : "border-espresso/20 text-espresso hover:border-espresso"
            }`}
          >
            {it.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

const items = (ids: (FinishId | "match")[], fronts: FinishId, matchLabel = "Match the base units") =>
  ids.map((id) =>
    id === "match"
      ? { id, label: matchLabel, style: { ...swatchStyle(finishes[fronts]), outline: "1px dashed rgb(30 23 18 / 0.5)", outlineOffset: "-6px" } }
      : { id, label: finishes[id].label, style: swatchStyle(finishes[id]) },
  );

export function StudioControls({
  scene,
  config,
  preset,
  onChange,
  onPreset,
}: {
  scene: KitchenScene;
  config: KitchenConfig;
  preset: PresetId | null;
  onChange: <K extends keyof KitchenConfig>(key: K, value: KitchenConfig[K]) => void;
  onPreset: (id: PresetId) => void;
}) {
  const has = (c: string) => scene.controls.includes(c as never);
  return (
    <div>
      <p className="text-eyebrow text-muted">Start from an OLIVA look</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {(Object.keys(presets) as PresetId[]).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => onPreset(id)}
            aria-pressed={preset === id}
            className={`h-11 border text-[0.62rem] font-semibold uppercase tracking-[0.16em] transition-colors ${
              preset === id ? "border-espresso bg-espresso text-ivory" : "border-espresso/20 text-espresso hover:border-espresso"
            }`}
          >
            {presets[id].label}
          </button>
        ))}
      </div>

      <div className="mt-6 border-t border-line">
        {has("fronts") && (
          <SwatchGroup label="Base units" name="fronts" value={config.fronts} items={items(options.fronts, config.fronts)} onChange={(v) => onChange("fronts", v as FinishId)} />
        )}
        {has("upper") && (
          <SwatchGroup label="Wall cabinets" name="upper" value={config.upper} items={items(options.upper, config.fronts)} onChange={(v) => onChange("upper", v as FinishId)} />
        )}
        {has("shelves") && (
          <Segmented
            label="Side wall"
            value={config.shelves}
            items={[
              { id: "open", label: "Open shelves" },
              { id: "closed", label: "Wall cabinets" },
            ]}
            onChange={(v) => onChange("shelves", v)}
          />
        )}
        {has("tall") && (
          <SwatchGroup label="Tall units" name="tall" value={config.tall} items={items(options.tall, config.fronts)} onChange={(v) => onChange("tall", v as FinishId | "match")} />
        )}
        {has("worktop") && (
          <SwatchGroup label="Worktop & backsplash" name="worktop" value={config.worktop} items={items(options.worktop, config.fronts)} onChange={(v) => onChange("worktop", v as FinishId)} />
        )}
        {has("island") && (
          <SwatchGroup label="Island" name="island" value={config.island} items={items(options.island, config.fronts)} onChange={(v) => onChange("island", v as FinishId | "match")} />
        )}
        {has("light") && (
          <Segmented<LightMode>
            label="LED light line"
            value={config.light}
            items={[
              { id: "warm", label: "Warm" },
              { id: "neutral", label: "Neutral" },
              { id: "off", label: "Off" },
            ]}
            onChange={(v) => onChange("light", v)}
          />
        )}
      </div>
    </div>
  );
}
