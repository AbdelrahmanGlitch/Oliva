"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { brand } from "@/data/brand";
import { CONFIG_TO_FORM_EVENT } from "@/lib/events";
import { Eyebrow } from "@/components/ui/Button";
import { LineReveal } from "@/components/ui/Reveal";

const propertyTypes = ["Apartment", "Villa", "Penthouse", "Other"];
const kitchenTypes = ["New kitchen", "Renovation", "Kitchen + interiors"];
const sizes = ["Small", "Medium", "Large"];
const styles = ["Smoked & Stone", "Graphite & Oak", "Warm Walnut", "Soft Greige", "Not sure yet"];

const field =
  "peer w-full border-0 border-b border-espresso/25 bg-transparent px-0 pb-3 pt-6 text-[1rem] text-espresso placeholder-transparent transition-colors focus:border-terracotta focus:outline-none focus:ring-0";
const floatLabel =
  "pointer-events-none absolute left-0 top-6 text-[0.95rem] text-muted transition-all duration-300 peer-focus:top-0 peer-focus:text-[0.62rem] peer-focus:uppercase peer-focus:tracking-[0.2em] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[0.62rem] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.2em]";

function Text({ name, label, type = "text", required, autoComplete }: { name: string; label: string; type?: string; required?: boolean; autoComplete?: string }) {
  return (
    <div className="relative">
      <input id={name} name={name} type={type} required={required} autoComplete={autoComplete} placeholder={label} className={field} />
      <label htmlFor={name} className={floatLabel}>
        {label}
        {required && <span className="text-terracotta"> *</span>}
      </label>
    </div>
  );
}

function Choice({ name, label, items, value, onChange }: { name: string; label: string; items: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset>
      <legend className="text-eyebrow text-muted">{label}</legend>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((it) => (
          <label key={it} className="cursor-pointer">
            <input type="radio" name={name} value={it} checked={value === it} onChange={() => onChange(it)} className="peer sr-only" />
            <span className="inline-flex h-10 items-center border border-espresso/20 px-4 text-[0.78rem] text-espresso transition-colors hover:border-espresso peer-checked:border-espresso peer-checked:bg-espresso peer-checked:text-ivory peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-terracotta">
              {it}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function ConsultationForm() {
  const [property, setProperty] = useState(propertyTypes[0]);
  const [kitchen, setKitchen] = useState(kitchenTypes[0]);
  const [size, setSize] = useState(sizes[1]);
  const [style, setStyle] = useState(styles[4]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<string | null>(null);
  const [sent, setSent] = useState<string | null>(null);
  const [fromStudio, setFromStudio] = useState(false);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const onConfig = (e: Event) => {
      const { summary, style: s } = (e as CustomEvent<{ summary: string; style?: string }>).detail;
      setMessage(`My 3D studio configuration:\n${summary}\n\n`);
      if (s && styles.includes(s)) setStyle(s);
      setFromStudio(true);
      setTimeout(() => messageRef.current?.focus({ preventScroll: true }), 900);
    };
    window.addEventListener(CONFIG_TO_FORM_EVENT, onConfig);
    return () => window.removeEventListener(CONFIG_TO_FORM_EVENT, onConfig);
  }, []);

  return (
    <section id="consultation" aria-labelledby="consult-title" className="section-y bg-paper">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Eyebrow className="text-terracotta">Design consultation</Eyebrow>
            <h2 id="consult-title" className="text-display-lg mt-6 text-espresso">
              <LineReveal lines={["Let’s design", <em key="i" className="italic">your kitchen.</em>]} />
            </h2>
            <p className="text-lead mt-6 text-muted">Tell us about your space and let OLIVA’s designers take it from there.</p>
            <p className="mt-8 border-l-2 border-terracotta pl-4 text-sm leading-relaxed text-espresso">
              Ask about current offers. Every OLIVA kitchen is priced to its own design, so quotations are personal.
            </p>
            <div className="mt-10 space-y-3 text-sm">
              <p className="text-eyebrow text-muted">Prefer to message?</p>
              <a href={brand.social.instagramDm} target="_blank" rel="noopener noreferrer" className="arrow-link flex items-center gap-2 text-espresso">
                <span className="u-grow pb-0.5">Message OLIVA on Instagram</span> <span className="arrow">→</span>
              </a>
              <a href={brand.social.facebook.url} target="_blank" rel="noopener noreferrer" className="arrow-link flex items-center gap-2 text-espresso">
                <span className="u-grow pb-0.5">OLIVA on Facebook</span> <span className="arrow">→</span>
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="plaster on-dark flex min-h-[420px] flex-col justify-end p-8 text-ivory sm:p-12"
                role="status"
              >
                <p className="text-eyebrow text-ivory/70">Request prepared</p>
                <p className="mt-4 font-display text-4xl font-light leading-tight sm:text-5xl">Thank you, {sent}.</p>
                <p className="mt-4 max-w-md text-ivory/80">
                  Your request is ready for OLIVA’s design team. This proposal demo isn’t connected to OLIVA yet, so for now, message OLIVA directly to start.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href={brand.social.instagramDm} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center bg-ivory px-6 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-espresso">
                    Message on Instagram →
                  </a>
                  <button type="button" onClick={() => setSent(null)} className="inline-flex h-12 items-center border border-ivory/40 px-6 text-[0.68rem] font-semibold uppercase tracking-[0.2em]">
                    Edit request
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                exit={{ opacity: 0 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  const data = new FormData(e.currentTarget);
                  setSent(String(data.get("name") || "").split(" ")[0] || "there");
                }}
                className="space-y-10"
              >
                <div className="grid gap-8 sm:grid-cols-2">
                  <Text name="name" label="Full name" required autoComplete="name" />
                  <Text name="phone" label="Phone" type="tel" required autoComplete="tel" />
                  <Text name="email" label="Email (optional)" type="email" autoComplete="email" />
                  <Text name="location" label="Area / city" autoComplete="address-level2" />
                </div>
                <Choice name="property" label="Property type" items={propertyTypes} value={property} onChange={setProperty} />
                <Choice name="kitchen" label="Project" items={kitchenTypes} value={kitchen} onChange={setKitchen} />
                <Choice name="size" label="Approximate space" items={sizes} value={size} onChange={setSize} />
                <Choice name="style" label="Preferred mood" items={styles} value={style} onChange={setStyle} />

                <div className="relative">
                  {fromStudio && (
                    <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-terracotta">Added from the 3D studio</p>
                  )}
                  <textarea
                    ref={messageRef}
                    id="message"
                    name="message"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your space"
                    className={`${field} resize-none`}
                  />
                  <label htmlFor="message" className={floatLabel}>
                    Tell us about your space
                  </label>
                </div>

                <div>
                  <label className="flex cursor-pointer items-center justify-between gap-4 border border-dashed border-espresso/30 px-5 py-5 transition-colors hover:border-espresso focus-within:border-terracotta">
                    <span>
                      <span className="text-eyebrow block text-muted">Inspiration or floor plan</span>
                      <span className="mt-1 block text-sm text-espresso">{file ?? "Upload an image or PDF"}</span>
                    </span>
                    <span className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-espresso">Browse</span>
                    <input
                      type="file"
                      name="file"
                      accept="image/*,application/pdf"
                      className="sr-only"
                      onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)}
                    />
                  </label>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    className="arrow-link inline-flex h-14 items-center justify-center gap-3 bg-espresso px-10 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-terracotta"
                  >
                    Request a design consultation <span className="arrow">→</span>
                  </button>
                  <p className="text-[0.66rem] uppercase tracking-[0.16em] text-muted">* Required</p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
