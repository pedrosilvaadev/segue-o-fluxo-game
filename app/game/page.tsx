"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, Play, RefreshCw, Square } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  GameRouteLoading,
  GameTimer,
  QuestionCard,
  ResetGameButton,
  RoundProgress,
} from "@/components/game";
import { BottomActionBar, PageContainer, PageShell } from "@/components/layout";
import { Button, InlineError } from "@/components/ui";
import { useGameTimer } from "@/hooks/use-game-timer";
import { useHaptics } from "@/hooks/use-haptics";
import { hydrateGameStore, useGameStore } from "@/store/game-store";

export default function GamePage() {
  const router = useRouter();
  const game = useGameStore((state) => state.game);
  const hasHydrated = useGameStore((state) => state.hasHydrated);
  const startTimer = useGameStore((state) => state.startTimer);
  const finishTimer = useGameStore((state) => state.finishTimer);
  const changeQuestion = useGameStore((state) => state.changeQuestion);
  const beginScoring = useGameStore((state) => state.beginScoring);
  const recoverTimer = useGameStore((state) => state.recoverTimer);
  const { tap, warning, timerEnd } = useHaptics();
  const [error, setError] = useState("");
  const lastWarningSecond = useRef<number | null>(null);
  const didSignalEnd = useRef(false);

  useEffect(() => {
    void hydrateGameStore();
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!game || game.status === "setup") router.replace("/setup");
    else if (game.status === "ready") router.replace("/ready");
    else if (game.status === "scoring") router.replace("/game/score");
    else if (game.status === "finished") router.replace("/results");
  }, [game, hasHydrated, router]);

  const timer = useGameTimer({
    status: game?.timer.status ?? "idle",
    endsAt: game?.timer.endsAt ?? null,
    durationSeconds: game?.settings.timerSeconds ?? 45,
    onFinished: recoverTimer,
  });

  useEffect(() => {
    if (
      game?.timer.status === "running" &&
      timer.remainingSeconds > 0 &&
      timer.remainingSeconds <= 5 &&
      lastWarningSecond.current !== timer.remainingSeconds
    ) {
      lastWarningSecond.current = timer.remainingSeconds;
      warning();
    }
    if (timer.isFinished && game?.timer.status !== "idle" && !didSignalEnd.current) {
      didSignalEnd.current = true;
      timerEnd();
    }
  }, [game?.timer.status, timer.isFinished, timer.remainingSeconds, timerEnd, warning]);

  if (!hasHydrated || !game || game.status !== "playing") {
    return <GameRouteLoading />;
  }

  const question = game.questions.find(
    (candidate) => candidate.id === game.currentQuestionId,
  );
  if (!question) {
    return (
      <PageShell centered>
        <PageContainer className="items-center justify-center text-center">
          <h1 className="font-display text-3xl font-black">Pergunta perdida no fluxo</h1>
          <p className="mt-3 text-muted">Volte à configuração para iniciar uma nova partida.</p>
          <Button className="mt-8" onClick={() => router.replace("/setup")}>Ir para configuração</Button>
        </PageContainer>
      </PageShell>
    );
  }

  const handleChangeQuestion = () => {
    setError("");
    try {
      changeQuestion();
      tap();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível trocar a pergunta.");
    }
  };

  const revealAnswers = () => {
    beginScoring();
    tap();
    router.push("/game/score");
  };

  return (
    <PageShell>
      <PageContainer className="pb-4">
        <RoundProgress
          current={game.currentRound}
          total={game.settings.rounds}
          action={<ResetGameButton />}
        />
        <QuestionCard
          questionId={question.id}
          text={question.text}
          category={question.category}
        />
        <GameTimer
          seconds={timer.remainingSeconds}
          status={timer.isFinished ? "finished" : game.timer.status}
          urgent={timer.isUrgent}
        />
        <div className="mt-3 min-h-12 text-center">
          <Button
            variant="quiet"
            size="compact"
            leadingIcon={<RefreshCw size={17} />}
            onClick={handleChangeQuestion}
            disabled={game.timer.status !== "idle"}
          >
            Trocar pergunta
          </Button>
        </div>
        {error ? <InlineError className="mt-2">{error}</InlineError> : null}
      </PageContainer>

      <BottomActionBar>
        {game.timer.status === "idle" ? (
          <Button
            fullWidth
            leadingIcon={<Play fill="currentColor" size={19} />}
            onClick={() => {
              startTimer();
              tap();
            }}
          >
            Iniciar timer
          </Button>
        ) : timer.isFinished ? (
          <Button
            fullWidth
            leadingIcon={<Eye size={20} />}
            onClick={revealAnswers}
          >
            Revelar respostas
          </Button>
        ) : (
          <div className="grid gap-2">
            <p className="text-center text-xs font-bold text-muted">
              Todo mundo já respondeu?
            </p>
            <Button
              fullWidth
              variant="secondary"
              leadingIcon={<Square size={18} fill="currentColor" />}
              onClick={() => {
                finishTimer();
                tap();
              }}
            >
              Finalizar timer
            </Button>
          </div>
        )}
      </BottomActionBar>
    </PageShell>
  );
}
