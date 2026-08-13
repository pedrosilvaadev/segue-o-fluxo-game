"use client";

import { motion, useReducedMotion } from "motion/react";

const PARTICLES = [
  [8, "#f8d448", 0.05, -18],
  [17, "#ff4f8b", 0.22, 22],
  [27, "#8b6cff", 0.1, -28],
  [38, "#4ade80", 0.28, 16],
  [50, "#f8d448", 0, 30],
  [61, "#ff6969", 0.18, -14],
  [72, "#8b6cff", 0.08, 25],
  [83, "#4ade80", 0.25, -24],
  [92, "#ff4f8b", 0.14, 18],
] as const;

export function Confetti() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-72 overflow-hidden" aria-hidden="true">
      {PARTICLES.map(([left, color, delay, drift], index) => (
        <motion.span
          key={`${left}-${color}`}
          className="absolute top-0 h-3 w-2 rounded-[2px]"
          style={{ left: `${left}%`, backgroundColor: color }}
          initial={{ y: -20, x: 0, rotate: 0, opacity: 0 }}
          animate={{ y: 270, x: drift, rotate: 300 + index * 35, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.55 + (index % 3) * 0.16, delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
