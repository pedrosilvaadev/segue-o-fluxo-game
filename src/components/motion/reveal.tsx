"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";

interface RevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  delay?: number;
  distance?: number;
}

export function Reveal({
  children,
  className,
  delay = 0,
  distance = 14,
  ...props
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { delay, duration: 0.28, ease: [0.22, 1, 0.36, 1] }
      }
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface PopInProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
}

export function PopIn({ children, className, ...props }: PopInProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.72, rotate: -4 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 310, damping: 22 }
      }
      className={cn("will-change-transform", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CountUp({ value, className }: { value: number; className?: string }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion || value <= 0) {
    return <span className={className}>{value}</span>;
  }

  return <AnimatedCount value={value} className={className} />;
}

function AnimatedCount({ value, className }: { value: number; className?: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 700;
    const startedAt = performance.now();
    let frame = 0;

    const update = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - (1 - progress) ** 3;
      setDisplayValue(Math.round(value * eased));

      if (progress < 1) frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span className={className}>{displayValue}</span>;
}
