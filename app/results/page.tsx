"use client";

import { RotateCcw, Sparkles, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { BottomActionBar, PageContainer, PageShell } from "@/components/layout";
import { Confetti, Reveal } from "@/components/motion";
import { Leaderboard, ResultsReveal, WinnerCard } from "@/components/results";
import { Button } from "@/components/ui";
import { calculateRanking } from "@/lib/game";
import { useGameStore } from "@/store/game-store";
import type { GameStatus } from "@/types/game";

const ROUTE_BY_STATUS: Record<Exclude<GameStatus, "finished">, string> = {
  setup: "/setup",
  ready: "/ready",
  playing: "/game",
  scoring: "/game/score",
};

export default function ResultsPage() {
  const router = useRouter();
  const game = useGameStore((state) => state.game);
  const hasHydrated = useGameStore((state) => state.hasHydrated);
  const restartGame = useGameStore((state) => state.restartGame);
  const resetGame = useGameStore((state) => state.resetGame);
  const [isRevealing, setIsRevealing] = useState(true);

  const ranking = useMemo(() => calculateRanking(game?.players ?? []), [game?.players]);
  const winners = useMemo(() => ranking.filter((entry) => entry.isWinner), [ranking]);
  const finishReveal = useCallback(() => setIsRevealing(false), []);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!game) {
      router.replace("/");
      return;
    }
    if (game.status !== "finished") router.replace(ROUTE_BY_STATUS[game.status]);
  }, [game, hasHydrated, router]);

  const handlePlayAgain = () => {
    restartGame();
    router.replace("/ready");
  };

  const handleNewGame = () => {
    resetGame();
    router.replace("/setup");
  };

  if (!hasHydrated || !game || game.status !== "finished" || winners.length === 0) {
    return (
      <PageShell centered>
        <PageContainer className="items-center justify-center text-center" aria-live="polite">
          <Sparkles className="mb-4 text-accent" size={32} aria-hidden="true" />
          <p className="font-display text-xl font-extrabold">Preparando o resultado…</p>
        </PageContainer>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {isRevealing ? <ResultsReveal ranking={ranking} onComplete={finishReveal} /> : null}
      {!isRevealing ? <Confetti /> : null}

      <PageContainer className="gap-7 pt-7 pb-8">
        <Reveal>
          <div className="text-center">
            <p className="font-display text-xs font-extrabold tracking-[0.2em] text-secondary uppercase">
              Partida encerrada
            </p>
            <p className="mt-1 text-sm font-medium text-muted">
              {game.settings.rounds} rodadas · muito assunto para depois
            </p>
          </div>
        </Reveal>

        <WinnerCard winners={winners} />
        <Leaderboard ranking={ranking} />
      </PageContainer>

      <BottomActionBar className="space-y-2.5">
        <Button fullWidth leadingIcon={<RotateCcw size={19} />} onClick={handlePlayAgain}>
          Jogar novamente
        </Button>
        <Button
          fullWidth
          variant="quiet"
          leadingIcon={<UsersRound size={19} />}
          onClick={handleNewGame}
        >
          Nova partida
        </Button>
      </BottomActionBar>
    </PageShell>
  );
}
