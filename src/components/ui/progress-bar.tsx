import { cn } from "@/lib/cn";

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
  tone?: "primary" | "accent" | "success";
}

export function ProgressBar({
  value,
  max = 100,
  label = "Progresso",
  className,
  tone = "primary",
}: ProgressBarProps) {
  const safeMax = max > 0 ? max : 1;
  const safeValue = Math.min(Math.max(value, 0), safeMax);
  const percentage = (safeValue / safeMax) * 100;

  return (
    <div
      className={cn("h-3 overflow-hidden rounded-full bg-black/30 ring-1 ring-white/8", className)}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={safeValue}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-300",
          tone === "primary" && "bg-primary",
          tone === "accent" && "bg-accent",
          tone === "success" && "bg-success",
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
