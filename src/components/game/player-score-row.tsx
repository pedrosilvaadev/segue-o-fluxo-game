"use client";

import { motion, useReducedMotion } from "motion/react";

import { ScoreStepper } from "@/components/ui";
import type { Player } from "@/types/game";

interface PlayerScoreRowProps {
  player: Player;
  roundPoints: number;
  onChange: (value: number) => void;
}

export function PlayerScoreRow({
  player,
  roundPoints,
  onChange,
}: PlayerScoreRowProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.li
      layout={!shouldReduceMotion}
      className="flex min-h-24 items-center justify-between gap-3 rounded-[1.4rem] border border-white/8 bg-surface px-4 py-3 shadow-[0_8px_24px_rgb(0_0_0/0.18)]"
    >
      <div className="min-w-0">
        <p className="truncate font-display text-lg font-black text-foreground">
          {player.name}
        </p>
        <p className="mt-0.5 text-xs font-bold text-muted">
          {player.score} {player.score === 1 ? "ponto" : "pontos"} no total
        </p>
      </div>
      <ScoreStepper
        value={roundPoints}
        onChange={onChange}
        label={player.name}
      />
    </motion.li>
  );
}
