import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface PageShellProps extends HTMLAttributes<HTMLElement> {
  centered?: boolean;
}

export function PageShell({
  className,
  centered = false,
  ...props
}: PageShellProps) {
  return (
    <main
      className={cn(
        "relative mx-auto flex min-h-dvh w-full max-w-[480px] flex-col overflow-x-clip border-x border-white/5 bg-background shadow-[0_0_80px_rgb(0_0_0/0.5)]",
        centered && "justify-center",
        className,
      )}
      {...props}
    />
  );
}

export function PageContainer({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative flex w-full flex-1 flex-col px-[var(--page-gutter)] py-5",
        className,
      )}
      {...props}
    />
  );
}
