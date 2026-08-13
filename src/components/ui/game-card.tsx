import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface GameCardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: "default" | "primary" | "warm" | "success";
  tilt?: "left" | "right" | "none";
}

const toneClasses: Record<NonNullable<GameCardProps["tone"]>, string> = {
  default: "border-border bg-[linear-gradient(145deg,var(--surface-raised),var(--surface))]",
  primary:
    "border-primary/55 bg-[linear-gradient(145deg,#30275a,var(--surface))]",
  warm: "border-secondary/45 bg-[linear-gradient(145deg,#48233b,var(--surface))]",
  success: "border-success/45 bg-[linear-gradient(145deg,#173b2c,var(--surface))]",
};

export function GameCard({
  className,
  tone = "default",
  tilt = "none",
  ...props
}: GameCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-card border p-5 shadow-card sm:p-6",
        toneClasses[tone],
        tilt === "left" && "-rotate-[0.75deg]",
        tilt === "right" && "rotate-[0.75deg]",
        className,
      )}
      {...props}
    />
  );
}
