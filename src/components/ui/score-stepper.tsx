import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/cn";
import { MAX_ROUND_POINTS, MIN_ROUND_POINTS } from "@/types/game";

export interface ScoreStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label: string;
  className?: string;
}

export function ScoreStepper({
  value,
  onChange,
  min = MIN_ROUND_POINTS,
  max = MAX_ROUND_POINTS,
  label,
  className,
}: ScoreStepperProps) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  return (
    <div className={cn("inline-flex items-center gap-1 rounded-[1.1rem] border border-border bg-black/25 p-1", className)}>
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        aria-label={`Diminuir pontos de ${label}`}
        className="grid size-11 place-items-center rounded-[0.85rem] bg-surface-raised text-foreground transition-[transform,background-color] hover:bg-surface-soft active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Minus aria-hidden="true" size={20} strokeWidth={3} />
      </button>
      <output
        className="min-w-11 text-center font-display text-xl font-black tabular-nums text-foreground"
        aria-label={`${value} pontos para ${label}`}
      >
        {value}
      </output>
      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        aria-label={`Aumentar pontos de ${label}`}
        className="grid size-11 place-items-center rounded-[0.85rem] bg-primary text-white transition-[transform,background-color] hover:bg-primary-strong active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Plus aria-hidden="true" size={20} strokeWidth={3} />
      </button>
    </div>
  );
}
