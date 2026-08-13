import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "quiet" | "danger";
type ButtonSize = "default" | "compact";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-primary-strong bg-primary-strong text-white shadow-[var(--shadow-button)] hover:bg-primary active:translate-y-[5px] active:shadow-[var(--shadow-button-active)]",
  secondary:
    "border-border-strong bg-surface-raised text-foreground shadow-[0_5px_0_#17131f] hover:bg-surface-soft active:translate-y-[3px] active:shadow-[0_2px_0_#17131f]",
  quiet:
    "border-transparent bg-transparent text-muted hover:bg-white/6 hover:text-foreground active:bg-white/10",
  danger:
    "border-danger/70 bg-danger/15 text-[#ffb2b2] hover:bg-danger/25 active:translate-y-px",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "min-h-14 px-6 py-3 text-base",
  compact: "min-h-11 px-4 py-2 text-sm",
};

export function Button({
  className,
  variant = "primary",
  size = "default",
  fullWidth = false,
  leadingIcon,
  trailingIcon,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex select-none items-center justify-center gap-2 rounded-control border font-display font-extrabold tracking-[0.01em] transition-[transform,background-color,box-shadow,color] duration-150 disabled:cursor-not-allowed disabled:opacity-45",
        "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {leadingIcon ? <span aria-hidden="true">{leadingIcon}</span> : null}
      <span>{children}</span>
      {trailingIcon ? <span aria-hidden="true">{trailingIcon}</span> : null}
    </button>
  );
}
