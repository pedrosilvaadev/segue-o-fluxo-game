"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Trophy } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";

import {
  GameRouteLoading,
  PlayerScoreRow,
  ResetGameButton,
} from "@/components/game";
import {
  BottomActionBar,
  PageContainer,
  PageShell,
  ScreenHeader,
} from "@/components/layout";
import { Button, InlineError } from "@/components/ui";
import { useHaptics } from "@/hooks/use-haptics";
import { hydrateGameStore, useGameStore } from "@/store/game-store";

export default function ScorePage() {
  const router = useRouter();
  const game = useGameStore((state) => state.game);
  const roundScores = useGameStore((state) => state.roundScores);
  const hasHydrated = useGameStore((state) => state.hasHydrated);
  const addScore = useGameStore((state) => state.addScore);
  const completeRound = useGameStore((state) => state.completeRound);
  const nextRound = useGameStore((state) => state.nextRound);
  const finishGame = useGameStore((state) => state.finishGame);
  const { tap, success } = useHaptics();
  const shouldReduceMotion = useReducedMotion();
  const [error, setError] = useState("");
  const [transition, setTransition] = useState(false);
  const transitionTimer = useRef<number | null>(null);

  useEffect(() => {
    void hydrateGameStore();
    return () => {
      if (transitionTimer.current !== null) {
        window.clearTimeout(transitionTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!game || game.status === "setup") router.replace("/setup");
    else if (game.status === "ready") router.replace("/ready");
    else if (game.status === "playing") router.replace("/game");
    else if (game.status === "finished") router.replace("/results");
  }, [game, hasHydrated, router]);

  if (!hasHydrated || !game || game.status !== "scoring") {
    return <GameRouteLoading />;
  }

  const isLastRound = game.currentRound >= game.settings.rounds;
  const wasSubmitted = game.roundResults.some(
    (result) => result.round === game.currentRound,
  );

  const goToNextScreen = () => {
    if (transitionTimer.current !== null) {
      window.clearTimeout(transitionTimer.current);
      transitionTimer.current = null;
    }
    if (isLastRound) {
      finishGame();
      router.replace("/results");
    } else {
      nextRound();
      router.replace("/game");
    }
  };

  const advance = () => {
    setError("");
    try {
      if (!wasSubmitted) completeRound();
      success();
      setTransition(true);
      transitionTimer.current = window.setTimeout(goToNextScreen, 850);
    } catch (caught) {
      setTransition(false);
      setError(
        caught instanceof Error
          ? caught.message
          : "Não foi possível concluir a rodada.",
      );
    }
  };

  return (
    <PageShell>
      <PageContainer className="pb-5">
        <ScreenHeader
          eyebrow={`Rodada ${game.currentRound} de ${game.settings.rounds}`}
          title="Quem pontuou?"
          description="O grupo decide. Registre de 0 a 3 pontos para cada pessoa."
          trailing={<ResetGameButton />}
        />

        <ul className="space-y-3" aria-label="Pontuação da rodada">
          {game.players.map((player) => (
            <PlayerScoreRow
              key={player.id}
              player={player}
              roundPoints={roundScores[player.id] ?? 0}
              onChange={(points) => {
                addScore(player.id, points);
                tap();
              }}
            />
          ))}
        </ul>
        {error ? <InlineError className="mt-4">{error}</InlineError> : null}
      </PageContainer>

      <BottomActionBar>
        <Button
          fullWidth
          disabled={transition}
          leadingIcon={
            isLastRound ? (
              <Trophy size={20} />
            ) : wasSubmitted ? (
              <ArrowRight size={20} />
            ) : (
              <Check size={20} />
            )
          }
          onClick={advance}
        >
          {transition
            ? "Rodada concluída!"
            : isLastRound
              ? "Ver resultado final"
              : wasSubmitted
                ? "Próxima rodada"
                : "Confirmar rodada"}
        </Button>
      </BottomActionBar>

      <AnimatePresence>
        {transition ? (
          <motion.button
            type="button"
            aria-label="Pular transição"
            onClick={goToNextScreen}
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-background/95 px-6 text-center backdrop-blur-lg"
          >
            <motion.div
              initial={shouldReduceMotion ? false : { scale: 0.75, rotate: -4 }}
              animate={shouldReduceMotion ? undefined : { scale: 1, rotate: 0 }}
            >
              <Check
                className="mx-auto mb-5 rounded-full bg-success p-3 text-background"
                size={64}
                strokeWidth={4}
              />
              <p className="font-display text-4xl font-black text-foreground">
                Rodada concluída!
              </p>
              <p className="mt-3 font-bold text-muted">
                {isLastRound
                  ? "Hora de descobrir quem mais seguiu o fluxo."
                  : `Preparando a rodada ${game.currentRound + 1}…`}
              </p>
            </motion.div>
          </motion.button>
        ) : null}
      </AnimatePresence>
    </PageShell>
  );
}
