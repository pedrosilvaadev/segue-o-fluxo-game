import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface BottomActionBarProps extends HTMLAttributes<HTMLDivElement> {
  sticky?: boolean;
}

export function BottomActionBar({ className, sticky = true, ...props }: BottomActionBarProps) {
  return (
    <div
      className={cn(
        "z-20 mt-auto border-t border-white/7 bg-background/92 px-[var(--page-gutter)] pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-xl",
        sticky && "sticky bottom-0",
        className,
      )}
      {...props}
    />
  );
}
