"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui";
import type { RankingEntry } from "@/types/game";

interface RevealStep {
  id: string;
  eyebrow?: string;
  title: string;
  detail?: string;
  duration: number;
}

interface ResultsRevealProps {
  ranking: readonly RankingEntry[];
  onComplete: () => void;
}

export function ResultsReveal({ ranking, onComplete }: ResultsRevealProps) {
  const reduceMotion = useReducedMotion();
  const [stepIndex, setStepIndex] = useState(0);
  const steps = useMemo<RevealStep[]>(() => {
    const podiumSteps = [3, 2, 1].flatMap((position) => {
      const names = ranking
        .filter((entry) => entry.position === position)
        .map((entry) => entry.player.name);

      if (names.length === 0) return [];

      return [{
        id: `position-${position}`,
        eyebrow: `${position}º lugar${names.length > 1 ? " — empate" : ""}`,
        title: names.join(" & "),
        detail: `${ranking.find((entry) => entry.position === position)?.player.score ?? 0} pontos`,
        duration: position === 1 ? 850 : 620,
      }];
    });

    return [
      { id: "end", title: "Fim de jogo!", detail: "As respostas estão na mesa.", duration: 560 },
      { id: "calculate", title: "Calculando o fluxo…", detail: "Quem pensou mais parecido?", duration: 650 },
      ...podiumSteps,
    ];
  }, [ranking]);

  useEffect(() => {
    if (reduceMotion) {
      onComplete();
      return;
    }

    const step = steps[stepIndex];
    if (!step) {
      onComplete();
      return;
    }

    const timeout = window.setTimeout(() => setStepIndex((current) => current + 1), step.duration);
    return () => window.clearTimeout(timeout);
  }, [onComplete, reduceMotion, stepIndex, steps]);

  if (reduceMotion || !steps[stepIndex]) return null;

  const step = steps[stepIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex min-h-dvh items-center justify-center bg-background-deep/96 px-6 text-center backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-label="Revelação do resultado"
      onClick={onComplete}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, scale: 0.9, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.04, y: -12 }}
          transition={{ duration: 0.22 }}
          className="max-w-sm"
          aria-live="polite"
        >
          {step.eyebrow ? (
            <p className="mb-3 font-display text-sm font-extrabold tracking-[0.18em] text-accent uppercase">
              {step.eyebrow}
            </p>
          ) : null}
          <p className="text-balance font-display text-4xl leading-tight font-extrabold tracking-tight">
            {step.title}
          </p>
          {step.detail ? <p className="mt-3 text-base font-semibold text-muted">{step.detail}</p> : null}
        </motion.div>
      </AnimatePresence>

      <Button
        variant="quiet"
        size="compact"
        className="absolute right-4 bottom-[max(1rem,env(safe-area-inset-bottom))]"
        onClick={onComplete}
      >
        Pular revelação
      </Button>
    </div>
  );
}
