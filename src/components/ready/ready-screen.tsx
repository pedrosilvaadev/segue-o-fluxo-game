"use client";

import { ArrowLeft, Clock3, Play, Target, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  BottomActionBar,
  PageContainer,
  PageShell,
  ScreenHeader,
} from "@/components/layout";
import { Button, InlineError, StatPill } from "@/components/ui";
import { hydrateGameStore, useGameStore } from "@/store/game-store";

export function ReadyScreen() {
  const router = useRouter();
  const game = useGameStore((state) => state.game);
  const hasHydrated = useGameStore((state) => state.hasHydrated);
  const startGame = useGameStore((state) => state.startGame);
  const reopenSetup = useGameStore((state) => state.reopenSetup);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void hydrateGameStore();
  }, []);
  useEffect(() => {
    if (!hasHydrated) return;
    if (!game) router.replace("/setup");
    else if (game.status === "playing" || game.status === "scoring")
      router.replace("/game");
    else if (game.status === "finished") router.replace("/results");
  }, [game, hasHydrated, router]);

  function handleStart() {
    try {
      startGame();
      router.push("/game");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Não foi possível iniciar a partida.",
      );
    }
  }

  function handleBack() {
    if (game?.status === "ready") reopenSetup();
    router.push("/setup");
  }

  if (
    !hasHydrated ||
    !game ||
    (game.status !== "setup" && game.status !== "ready")
  ) {
    return (
      <PageShell centered>
        <p role="status" className="text-center font-bold text-muted">
          Conferindo a partida…
        </p>
      </PageShell>
    );
  }

  return (
    <PageShell className="isolate">
      <PageContainer>
        <div
          aria-hidden="true"
          className="absolute inset-x-12 top-24 h-52 rounded-full bg-primary/15 blur-3xl"
        />
        <ScreenHeader
          eyebrow="A galera está no fluxo"
          title="Tudo pronto?"
          description="Separem papel e caneta. O gerente controla o celular e ninguém espia a resposta dos outros!"
          leading={
            <button
              type="button"
              onClick={handleBack}
              aria-label="Voltar à configuração"
              className="grid size-11 place-items-center rounded-full border border-border bg-surface"
            >
              <ArrowLeft size={21} />
            </button>
          }
        />

        <section className="relative rotate-[-0.6deg] rounded-card border border-border-strong bg-surface p-5 shadow-card">
          <div className="grid grid-cols-1 gap-2 min-[390px]:grid-cols-3">
            <StatPill
              label="Jogadores"
              value={String(game.players.length)}
              icon={<UsersRound size={18} />}
            />
            <StatPill
              label="Rodadas"
              value={String(game.settings.rounds)}
              icon={<Target size={18} />}
            />
            <StatPill
              label="Segundos"
              value={String(game.settings.timerSeconds)}
              icon={<Clock3 size={18} />}
            />
          </div>
          <div className="my-5 h-px bg-border" />
          <h2 className="mb-3 font-display text-lg font-black">
            Time do fluxo
          </h2>
          <ul className="flex flex-wrap gap-2">
            {game.players.map((player, index) => (
              <li
                key={player.id}
                style={{ animationDelay: `${index * 70}ms` }}
                className="animate-game-float rounded-full border border-primary/35 bg-primary/15 px-3 py-2 text-sm font-extrabold text-primary-soft"
              >
                {player.name}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-6 rounded-control border border-accent/30 bg-accent/10 px-4 py-3 text-center text-sm font-semibold text-accent">
          ⚡ As respostas iguais colocam vocês no fluxo.
        </div>
        {error ? <InlineError className="mt-4">{error}</InlineError> : null}
      </PageContainer>

      <BottomActionBar>
        <Button
          fullWidth
          onClick={handleStart}
          leadingIcon={<Play size={21} fill="currentColor" />}
          className="animate-game-pulse"
        >
          Começar jogo
        </Button>
      </BottomActionBar>
    </PageShell>
  );
}
