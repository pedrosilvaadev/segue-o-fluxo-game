import { X } from "lucide-react";

import { cn } from "@/lib/cn";

export interface PlayerChipProps {
  name: string;
  onRemove?: () => void;
  className?: string;
  accent?: "primary" | "secondary" | "accent" | "success";
}

const accentClasses: Record<NonNullable<PlayerChipProps["accent"]>, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  accent: "bg-accent",
  success: "bg-success",
};

export function PlayerChip({ name, onRemove, className, accent = "primary" }: PlayerChipProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-11 max-w-full items-center gap-2 rounded-full border border-border bg-surface-raised py-1 pl-2 pr-1",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("grid size-7 shrink-0 place-items-center rounded-full text-xs font-black text-[#17121f]", accentClasses[accent])}
      >
        {name.slice(0, 1).toLocaleUpperCase("pt-BR")}
      </span>
      <span className="truncate text-sm font-bold text-foreground">{name}</span>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remover ${name}`}
          className="grid size-11 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-white/8 hover:text-foreground"
        >
          <X aria-hidden="true" size={16} strokeWidth={2.5} />
        </button>
      ) : null}
    </span>
  );
}
