import type { PresetId } from "@/data/configurator";

/** Lightweight cross-section messaging (sections are siblings on one page). */

export const PRESET_EVENT = "oliva:preset";
export const CONFIG_TO_FORM_EVENT = "oliva:config-to-form";

export function openInStudio(preset: PresetId) {
  window.dispatchEvent(new CustomEvent<PresetId>(PRESET_EVENT, { detail: preset }));
  document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
}

export function sendConfigToForm(summary: string, style?: string) {
  window.dispatchEvent(new CustomEvent(CONFIG_TO_FORM_EVENT, { detail: { summary, style } }));
  document.getElementById("consultation")?.scrollIntoView({ behavior: "smooth" });
}
