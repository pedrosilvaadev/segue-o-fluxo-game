"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Sparkles } from "lucide-react";

import { GameCard } from "@/components/ui";

interface QuestionCardProps {
  questionId: string;
  text: string;
  category: string;
}

export function QuestionCard({
  questionId,
  text,
  category,
}: QuestionCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="grid min-h-[18rem] place-items-center py-4 [perspective:900px]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={questionId}
          initial={
            shouldReduceMotion ? false : { opacity: 0, x: 120, rotate: 5 }
          }
          animate={
            shouldReduceMotion ? undefined : { opacity: 1, x: 0, rotate: -0.7 }
          }
          exit={
            shouldReduceMotion ? undefined : { opacity: 0, x: -120, rotate: -5 }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.38, ease: [0.22, 1, 0.36, 1] }
          }
          className="w-full"
        >
          <GameCard
            tone="primary"
            className="relative flex min-h-[16.5rem] flex-col justify-between overflow-hidden p-7"
          >
            <div className="absolute -top-16 -right-16 size-40 rounded-full bg-secondary/20 blur-2xl" />
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-primary-soft">
                {category}
              </span>
              <Sparkles className="text-accent" size={24} aria-hidden="true" />
            </div>
            <h1 className="relative my-7 font-display text-[clamp(1.65rem,7vw,2.35rem)] leading-[1.12] font-black tracking-[-0.035em] text-foreground">
              {text}
            </h1>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
              Escrevam sem mostrar para ninguém
            </p>
          </GameCard>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
