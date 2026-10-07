"use client";

import { kitchenScenes } from "@/data/scenes";
import { ScenePlan } from "./ScenePlan";

/** Side-by-side comparison of the studio's spaces. Descriptive only: no measurements or performance claims. */
export function CompareSpaces({ activeId, onSelect }: { activeId: string; onSelect: (id: string) => void }) {
  const rows: { key: keyof (typeof kitchenScenes)[number]["compare"]; label: string }[] = [
    { key: "character", label: "Character" },
    { key: "storage", label: "Storage" },
    { key: "space", label: "Room it suits" },
    { key: "bestFor", label: "Best for" },
  ];
  return (
    <div className="no-scrollbar -mx-[var(--gutter)] scroll-px-[var(--gutter)] overflow-x-auto px-[var(--gutter)]">
      <div className="grid min-w-[760px] grid-cols-4 gap-px bg-line">
        {kitchenScenes.map((s) => (
          <div key={s.id} className={`flex flex-col bg-paper p-5 ${s.id === activeId ? "outline outline-1 -outline-offset-1 outline-terracotta" : ""}`}>
            <p className="text-[0.6rem] font-semibold tracking-[0.22em] text-terracotta">
              {s.number} · {s.badge.toUpperCase()}
            </p>
            <p className="mt-2 font-display text-2xl leading-tight text-espresso">{s.name}</p>
            <div className="mt-4 flex h-28 items-center justify-center bg-surface p-3 text-espresso">
              <ScenePlan scene={s} className="h-full w-auto" />
            </div>
            <dl className="mt-4 flex-1 space-y-3 text-sm">
              {rows.map((r) => (
                <div key={r.key}>
                  <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-muted">{r.label}</dt>
                  <dd className="mt-1 text-espresso">{s.compare[r.key]}</dd>
                </div>
              ))}
            </dl>
            <button
              type="button"
              onClick={() => onSelect(s.id)}
              disabled={s.id === activeId}
              className="mt-5 h-10 border border-espresso/25 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-espresso transition-colors hover:border-espresso disabled:border-terracotta disabled:text-terracotta"
            >
              {s.id === activeId ? "Viewing now" : "Enter this space →"}
            </button>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[0.6rem] uppercase tracking-[0.18em] text-muted">Conceptual comparison. Every OLIVA kitchen is engineered to its own room.</p>
    </div>
  );
}
