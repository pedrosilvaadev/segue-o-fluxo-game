import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: ReactNode;
  tone?: "default" | "danger";
}

export function IconButton({
  label,
  icon,
  tone = "default",
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        "inline-grid size-11 shrink-0 place-items-center rounded-full border transition-[transform,background-color,color] duration-150 hover:-translate-y-px active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45",
        tone === "default"
          ? "border-border bg-surface-raised text-foreground hover:bg-surface-soft"
          : "border-danger/50 bg-danger/10 text-danger hover:bg-danger/20",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  );
}
