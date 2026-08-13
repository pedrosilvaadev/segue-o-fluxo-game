import type { ReactNode } from "react";

import { ProgressBar } from "@/components/ui";

interface RoundProgressProps {
  current: number;
  total: number;
  action?: ReactNode;
}

export function RoundProgress({ current, total, action }: RoundProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <p className="font-display text-sm font-black uppercase tracking-[0.12em] text-accent">
          Rodada {current} de {total}
        </p>
        <span className="ml-auto text-xs font-bold text-muted">
          {Math.round((current / total) * 100)}%
        </span>
        {action}
      </div>
      <ProgressBar
        value={current}
        max={total}
        label={`Rodada ${current} de ${total}`}
        tone="accent"
      />
    </div>
  );
}
