import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface ScreenHeaderProps extends HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title: string;
  description?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  align?: "left" | "center";
}

export function ScreenHeader({
  eyebrow,
  title,
  description,
  leading,
  trailing,
  align = "left",
  className,
  ...props
}: ScreenHeaderProps) {
  return (
    <header
      className={cn("mb-6 grid grid-cols-[auto_1fr_auto] items-start gap-3", align === "center" && "text-center", className)}
      {...props}
    >
      <div className="min-w-11">{leading}</div>
      <div className={cn("min-w-0 pt-1", align === "left" && !leading && "-ml-14")}>
        {eyebrow ? (
          <p className="mb-1 text-xs font-black uppercase tracking-[0.16em] text-accent">{eyebrow}</p>
        ) : null}
        <h1 className="font-display text-[clamp(1.85rem,8vw,2.5rem)] leading-[1.02] font-black tracking-[-0.035em] text-foreground">
          {title}
        </h1>
        {description ? <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{description}</p> : null}
      </div>
      <div className="min-w-11">{trailing}</div>
    </header>
  );
}
