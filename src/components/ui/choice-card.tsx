import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface ChoiceCardProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
  description?: string;
  badge?: string;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function ChoiceCard({
  name,
  value,
  checked,
  onChange,
  label,
  description,
  badge,
  icon,
  disabled = false,
  className,
}: ChoiceCardProps) {
  return (
    <label
      className={cn(
        "relative flex min-h-24 select-none flex-col justify-between rounded-card border-2 p-4 transition-[transform,border-color,background-color] duration-150 focus-within:outline-3 focus-within:outline-offset-3 focus-within:outline-accent",
        checked
          ? "border-primary bg-primary/15 shadow-[0_0_0_1px_var(--primary)]"
          : "border-border bg-surface hover:-translate-y-0.5 hover:border-border-strong",
        disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer active:translate-y-px",
        className,
      )}
    >
      <input
        className="sr-only"
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value)}
      />
      <span className="flex items-start justify-between gap-3">
        {icon ? <span className="text-accent" aria-hidden="true">{icon}</span> : null}
        {badge ? (
          <span className="ml-auto rounded-full bg-accent px-2 py-1 text-[0.65rem] font-black uppercase tracking-wide text-[#261f08]">
            {badge}
          </span>
        ) : null}
      </span>
      <span>
        <span className="block font-display text-xl font-extrabold text-foreground">{label}</span>
        {description ? <span className="mt-0.5 block text-sm text-muted">{description}</span> : null}
      </span>
    </label>
  );
}

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedSelectorProps<T extends string> {
  label: string;
  value: T;
  options: readonly SegmentedOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedSelector<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: SegmentedSelectorProps<T>) {
  return (
    <fieldset className={className}>
      <legend className="sr-only">{label}</legend>
      <div className="grid auto-cols-fr grid-flow-col gap-1 rounded-[1.25rem] border border-border bg-black/25 p-1.5">
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "grid min-h-11 cursor-pointer place-items-center rounded-[0.9rem] px-3 text-center text-sm font-extrabold transition-colors focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-accent",
              value === option.value ? "bg-primary text-white" : "text-muted hover:bg-white/6 hover:text-foreground",
            )}
          >
            <input
              className="sr-only"
              type="radio"
              name={label}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
