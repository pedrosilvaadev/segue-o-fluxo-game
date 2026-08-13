import { CircleAlert } from "lucide-react";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export function InlineError({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      role="alert"
      className={cn("flex items-start gap-2 text-sm font-semibold text-[#ffabab]", className)}
      {...props}
    >
      <CircleAlert aria-hidden="true" className="mt-0.5 shrink-0" size={17} />
      <span>{children}</span>
    </p>
  );
}

export function VisuallyHidden({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("sr-only", className)} {...props} />;
}
