"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/cn";
import type { TimerStatus } from "@/types/game";

interface GameTimerProps {
  seconds: number;
  status: TimerStatus;
  urgent: boolean;
}

function formatTime(seconds: number): string {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export function GameTimer({ seconds, status, urgent }: GameTimerProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "mx-auto grid min-h-28 w-full max-w-[15rem] place-items-center rounded-[2rem] border bg-black/25 px-6 py-4 transition-colors",
        urgent ? "border-danger/70 bg-danger/10" : "border-white/10",
        status === "finished" &&
          "animate-[game-pulse_0.5s_ease-in-out_2] border-accent/70",
      )}
      role="timer"
      aria-live={urgent ? "assertive" : "off"}
      aria-label={`${seconds} segundos restantes`}
    >
      <motion.span
        key={seconds}
        initial={urgent && !shouldReduceMotion ? { scale: 1.18 } : false}
        animate={shouldReduceMotion ? undefined : { scale: 1 }}
        className={cn(
          "font-display text-5xl font-black tabular-nums tracking-[-0.05em]",
          urgent ? "text-danger" : "text-foreground",
          status === "finished" && "text-accent",
        )}
      >
        {formatTime(seconds)}
      </motion.span>
      <span className="text-xs font-black uppercase tracking-[0.16em] text-muted">
        {status === "idle" && "Prontos?"}
        {status === "running" && (urgent ? "Últimos segundos!" : "Valendo!")}
        {status === "finished" && "Tempo esgotado"}
      </span>
    </div>
  );
}
