"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

/** Fade + rise when scrolled into view */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  ...rest
}: { children: ReactNode; delay?: number; y?: number; className?: string } & Omit<HTMLMotionProps<"div">, "children">) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.1, ease, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Architectural clip-path reveal for images */
export function ImageReveal({
  children,
  className,
  direction = "up",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
  delay?: number;
}) {
  const from = {
    up: "inset(100% 0% 0% 0%)",
    left: "inset(0% 100% 0% 0%)",
    right: "inset(0% 0% 0% 100%)",
  }[direction];
  return (
    <motion.div
      className={className}
      initial={{ clipPath: from }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.5, ease, delay }}
    >
      <motion.div
        className="h-full w-full"
        initial={{ scale: 1.18 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 2.2, ease, delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/** Line-by-line headline reveal; pass lines as an array */
export function LineReveal({ lines, className, delay = 0 }: { lines: ReactNode[]; className?: string; delay?: number }) {
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            initial={{ y: "105%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 1.2, ease, delay: delay + i * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
