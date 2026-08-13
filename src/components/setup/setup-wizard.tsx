"use client";

import { ArrowLeft, ArrowRight, Clock3, Plus, Target, Trash2, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { BottomActionBar, PageContainer, PageShell, ScreenHeader } from "@/components/layout";
import { Button, ChoiceCard, InlineError, StepIndicator } from "@/components/ui";
import { hydrateGameStore, useGameStore } from "@/store/game-store";
import { ROUND_OPTIONS, TIMER_OPTIONS, type RoundCount, type TimerSeconds } from "@/types/game";

const steps = ["Jogadores", "Rodadas", "Tempo"] as const;
const roundLabels: Record<RoundCount, string> = { 5: "Rápido", 10: "Normal", 15: "Longo", 20: "Épico" };
const timerLabels: Record<TimerSeconds, string> = { 30: "Rápido", 45: "Recomendado", 60: "Relaxado" };

export function SetupWizard() {
  const router = useRouter();
  const game = useGameStore((state) => state.game);
  const hasHydrated = useGameStore((state) => state.hasHydrated);
  const createGame = useGameStore((state) => state.createGame);
  const addPlayer = useGameStore((state) => state.addPlayer);
  const removePlayer = useGameStore((state) => state.removePlayer);
  const configureRounds = useGameStore((state) => state.configureRounds);
  const configureTimer = useGameStore((state) => state.configureTimer);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void hydrateGameStore();
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!game) {
      createGame();
      return;
    }
    if (game.status === "ready") router.replace("/ready");
    if (game.status === "playing" || game.status === "scoring") router.replace("/game");
    if (game.status === "finished") router.replace("/results");
  }, [createGame, game, hasHydrated, router]);

  function handleAddPlayer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      addPlayer(name);
      setName("");
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível adicionar o jogador.");
    }
  }

  function goForward() {
    if (!game) return;
    if (step === 1 && game.players.length < 3) {
      setError("Adicione pelo menos 3 jogadores para continuar.");
      return;
    }
    setError(null);
    if (step < 3) setStep((current) => current + 1);
    else router.push("/ready");
  }

  if (!hasHydrated || !game || game.status !== "setup") {
    return <SetupLoading />;
  }

  return (
    <PageShell>
      <PageContainer className="pb-2">
        <ScreenHeader
          eyebrow="Nova partida"
          title={step === 1 ? "Quem vai jogar?" : step === 2 ? "Quantas rodadas?" : "Tempo para responder"}
          description={step === 1 ? "Adicione de 3 a 10 pessoas. Nomes diferentes ajudam na hora de pontuar." : step === 2 ? "Escolha o tamanho ideal para o ritmo da galera." : "O cronômetro vale para todas as perguntas."}
        />
        <StepIndicator steps={steps} currentStep={step} className="mb-8" />

        {step === 1 ? (
          <section aria-label="Cadastro de jogadores" className="space-y-4">
            <form onSubmit={handleAddPlayer} className="flex gap-2">
              <label className="sr-only" htmlFor="player-name">Nome do jogador</label>
              <input id="player-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={20} autoComplete="off" placeholder="Nome do jogador" className="min-h-14 min-w-0 flex-1 rounded-control border-2 border-border bg-surface px-4 font-bold text-foreground placeholder:text-subtle focus:border-primary focus:outline-none" />
              <Button type="submit" size="compact" aria-label="Adicionar jogador" disabled={game.players.length >= 10 || !name.trim()} className="size-14 shrink-0 px-0"><Plus size={24} /></Button>
            </form>
            <p className="text-right text-xs font-semibold text-subtle">{game.players.length}/10 jogadores</p>
            <ul className="space-y-2" aria-live="polite">
              {game.players.map((player, index) => (
                <li key={player.id} className="flex min-h-14 items-center gap-3 rounded-control border border-border bg-surface px-3 shadow-[0_3px_0_rgb(0_0_0/0.24)]">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/20 font-display font-black text-primary-soft">{index + 1}</span>
                  <span className="min-w-0 flex-1 truncate font-bold">{player.name}</span>
                  <button type="button" aria-label={`Remover ${player.name}`} onClick={() => { removePlayer(player.id); setError(null); }} className="grid size-11 place-items-center rounded-full text-muted hover:bg-danger/15 hover:text-danger"><Trash2 size={19} /></button>
                </li>
              ))}
            </ul>
            {game.players.length === 0 ? <div className="grid min-h-36 place-items-center rounded-card border-2 border-dashed border-border text-center text-sm text-muted"><div><UserRound className="mx-auto mb-2 text-primary-soft" /><p>A turma aparece aqui.</p></div></div> : null}
          </section>
        ) : null}

        {step === 2 ? (
          <fieldset className="grid grid-cols-2 gap-3"><legend className="sr-only">Número de rodadas</legend>
            {ROUND_OPTIONS.map((rounds) => <ChoiceCard key={rounds} name="rounds" value={String(rounds)} checked={game.settings.rounds === rounds} onChange={() => configureRounds(rounds)} label={String(rounds)} description={roundLabels[rounds]} icon={<Target size={22} />} badge={rounds === 10 ? "Favorito" : undefined} />)}
          </fieldset>
        ) : null}

        {step === 3 ? (
          <fieldset className="space-y-3"><legend className="sr-only">Tempo para responder</legend>
            {TIMER_OPTIONS.map((seconds) => <ChoiceCard key={seconds} name="timer" value={String(seconds)} checked={game.settings.timerSeconds === seconds} onChange={() => configureTimer(seconds)} label={`${seconds} segundos`} description={timerLabels[seconds]} icon={<Clock3 size={22} />} badge={seconds === 45 ? "Ideal" : undefined} className="min-h-20 flex-row items-center" />)}
          </fieldset>
        ) : null}
        {error ? <InlineError className="mt-4">{error}</InlineError> : null}
      </PageContainer>

      <BottomActionBar className="space-y-2">
        <Button fullWidth onClick={goForward} trailingIcon={<ArrowRight size={20} />} disabled={step === 1 && game.players.length < 3}>
          {step === 3 ? "Revisar partida" : "Continuar"}
        </Button>
        {step > 1 ? (
          <Button
            fullWidth
            variant="quiet"
            leadingIcon={<ArrowLeft size={20} />}
            onClick={() => {
              setError(null);
              setStep((current) => current - 1);
            }}
          >
            Voltar
          </Button>
        ) : null}
      </BottomActionBar>
    </PageShell>
  );
}

function SetupLoading() {
  return <PageShell centered><div role="status" className="px-6 text-center"><div className="mx-auto mb-4 size-12 animate-pulse rounded-2xl bg-primary/30" /><p className="font-bold text-muted">Preparando a mesa…</p></div></PageShell>;
}
