import { cn } from "@/lib/cn";

export interface StepIndicatorProps {
  steps: readonly string[];
  currentStep: number;
  className?: string;
}

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <ol className={cn("flex items-start", className)} aria-label="Etapas da configuração">
      {steps.map((step, index) => {
        const number = index + 1;
        const isActive = number === currentStep;
        const isComplete = number < currentStep;

        return (
          <li
            key={step}
            className={cn("flex min-w-0 flex-1 items-start", index === steps.length - 1 && "flex-none")}
            aria-current={isActive ? "step" : undefined}
          >
            <div className="flex min-w-11 flex-col items-center gap-1.5">
              <span
                className={cn(
                  "grid size-11 place-items-center rounded-full border-2 font-display text-sm font-extrabold transition-colors",
                  isActive && "border-accent bg-accent text-[#241d08]",
                  isComplete && "border-primary bg-primary text-white",
                  !isActive && !isComplete && "border-border bg-surface text-muted",
                )}
              >
                {number}
              </span>
              <span className={cn("max-w-20 truncate text-xs font-semibold", isActive ? "text-foreground" : "text-muted")}>{step}</span>
            </div>
            {index < steps.length - 1 ? (
              <span
                aria-hidden="true"
                className={cn("mt-[21px] h-0.5 min-w-5 flex-1", isComplete ? "bg-primary" : "bg-border")}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
