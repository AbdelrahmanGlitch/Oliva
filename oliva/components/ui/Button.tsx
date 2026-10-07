import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "tertiary" | "light" | "outline-light";

const base =
  "arrow-link group inline-flex items-center justify-center gap-3 whitespace-nowrap text-[0.72rem] font-semibold uppercase tracking-[0.22em] transition-colors duration-500 ease-[var(--ease-arch)]";

const variants: Record<Variant, string> = {
  primary: "h-14 px-8 bg-espresso text-ivory hover:bg-terracotta",
  secondary: "h-14 px-8 border border-espresso/30 text-espresso hover:border-espresso hover:bg-espresso hover:text-ivory",
  tertiary: "h-auto px-0 text-espresso",
  light: "h-14 px-8 bg-ivory text-espresso hover:bg-terracotta hover:text-ivory",
  "outline-light": "h-14 px-8 border border-ivory/40 text-ivory hover:border-ivory hover:bg-ivory hover:text-espresso",
};

type Props = {
  href: string;
  variant?: Variant;
  children: ReactNode;
  arrow?: boolean;
  className?: string;
  external?: boolean;
} & Omit<ComponentProps<"a">, "href">;

export function Button({ href, variant = "primary", children, arrow = true, className = "", external, ...rest }: Props) {
  const cls = `${base} ${variants[variant]} ${className}`;
  const content = (
    <>
      <span className={variant === "tertiary" ? "u-grow pb-1" : ""}>{children}</span>
      {arrow && (
        <span aria-hidden className="arrow">
          →
        </span>
      )}
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {content}
    </Link>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-eyebrow flex items-center gap-3 ${className}`}>
      <span aria-hidden className="inline-block h-px w-8 bg-current opacity-60" />
      {children}
    </p>
  );
}
