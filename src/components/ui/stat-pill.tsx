import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface StatPillProps {
  icon?: ReactNode;
  label: string;
  value?: string | number;
  className?: string;
  tone?: "default" | "primary" | "accent" | "success";
}

export function StatPill({ icon, label, value, className, tone = "default" }: StatPillProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full border px-3 py-2 text-sm font-bold",
        tone === "default" && "border-border bg-surface-raised text-foreground",
        tone === "primary" && "border-primary/45 bg-primary/15 text-primary-soft",
        tone === "accent" && "border-accent/45 bg-accent/12 text-accent",
        tone === "success" && "border-success/45 bg-success/12 text-success",
        className,
      )}
    >
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      <span>{label}</span>
      {value !== undefined ? <strong className="font-black tabular-nums">{value}</strong> : null}
    </span>
  );
}
