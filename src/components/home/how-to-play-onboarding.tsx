"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  Clock3,
  Crown,
  FilePenLine,
  Smartphone,
  UsersRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Button, IconButton, ProgressBar } from "@/components/ui";

const steps = [
  {
    eyebrow: "Antes de começar",
    title: "Prepare a galera",
    description:
      "Juntem de 3 a 10 pessoas. Uma pessoa controla o celular e todo mundo pega papel e caneta.",
    visual: "prepare",
  },
  {
    eyebrow: "A cada rodada",
    title: "Pense rápido",
    description:
      "Uma pergunta aparece e o timer começa. Cada pessoa escreve a primeira resposta que vier à cabeça, sem mostrar aos outros.",
    visual: "question",
  },
  {
    eyebrow: "Quando o tempo acabar",
    title: "Revelem juntos",
    description:
      "Compare as respostas. O grupo decide quem entrou no fluxo e o gerente registra de 0 a 3 pontos para cada pessoa.",
    visual: "answers",
  },
  {
    eyebrow: "No fim da partida",
    title: "Descubra quem fluiu",
    description:
      "Depois da última rodada, o jogo soma os pontos e revela o ranking. Quem tiver mais pontos vira o Rei ou a Rainha do Fluxo!",
    visual: "winner",
  },
] as const;

export function HowToPlayOnboarding() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) headingRef.current?.focus();
  }, [currentStep, isOpen]);

  const open = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);
  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-card border border-border bg-surface/80 px-4 font-bold text-muted transition-colors hover:bg-surface-raised hover:text-foreground focus-visible:outline-3 focus-visible:outline-accent"
      >
        <CircleHelp size={19} aria-hidden="true" /> Como jogar?
      </button>

      <dialog
        ref={dialogRef}
        onCancel={close}
        onClose={() => setIsOpen(false)}
        aria-labelledby="onboarding-title"
        aria-describedby="onboarding-description"
        className="m-auto max-h-[min(760px,calc(100dvh-2rem))] w-[min(440px,calc(100%-2rem))] overflow-y-auto rounded-card border border-border-strong bg-surface p-0 text-foreground shadow-card backdrop:bg-black/80 backdrop:backdrop-blur-sm"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface/95 px-5 py-4 backdrop-blur-xl">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-accent">
              Como jogar
            </p>
            <p className="mt-0.5 text-sm font-bold text-muted">
              Passo {currentStep + 1} de {steps.length}
            </p>
          </div>
          <IconButton label="Fechar como jogar" icon={<X size={20} />} onClick={close} />
        </div>

        <div className="p-5 sm:p-6">
          <ProgressBar
            value={currentStep + 1}
            max={steps.length}
            label={`Etapa ${currentStep + 1} de ${steps.length}`}
            tone="accent"
            className="mb-6"
          />

          <div aria-live="polite">
            <StepVisual visual={step.visual} />
            <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-secondary">
              {step.eyebrow}
            </p>
            <h2
              ref={headingRef}
              tabIndex={-1}
              id="onboarding-title"
              className="mt-1 font-display text-3xl font-black outline-none"
            >
              {step.title}
            </h2>
            <p id="onboarding-description" className="mt-3 leading-relaxed text-muted">
              {step.description}
            </p>
          </div>

          <div className="mt-7 grid grid-cols-[auto_1fr] gap-3">
            {currentStep > 0 ? (
              <Button
                variant="secondary"
                aria-label="Voltar para o passo anterior"
                onClick={() => setCurrentStep((value) => value - 1)}
                className="px-4"
              >
                <ArrowLeft size={20} aria-hidden="true" />
              </Button>
            ) : (
              <Button variant="quiet" onClick={close} className="px-4">
                Agora não
              </Button>
            )}

            {isLastStep ? (
              <Link
                href="/setup"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-control border border-primary-strong bg-primary-strong px-5 py-3 font-display font-extrabold text-white shadow-[var(--shadow-button)] transition-transform active:translate-y-1"
              >
                Entendi, começar <ArrowRight size={20} aria-hidden="true" />
              </Link>
            ) : (
              <Button
                fullWidth
                trailingIcon={<ArrowRight size={20} />}
                onClick={() => setCurrentStep((value) => value + 1)}
              >
                Próximo
              </Button>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}

function StepVisual({ visual }: { visual: (typeof steps)[number]["visual"] }) {
  if (visual === "prepare") {
    return (
      <div className="grid min-h-44 grid-cols-3 place-items-center gap-2 rounded-card border border-primary/35 bg-primary/10 p-4 text-primary-soft">
        <UsersRound size={42} aria-hidden="true" />
        <Smartphone size={42} aria-hidden="true" />
        <FilePenLine size={42} aria-hidden="true" />
        <span className="col-span-3 text-center text-sm font-extrabold text-foreground">
          Galera + 1 celular + papel e caneta
        </span>
      </div>
    );
  }

  if (visual === "question") {
    return (
      <div className="min-h-44 rotate-[-1deg] rounded-card border border-secondary/45 bg-gradient-to-br from-primary/25 to-secondary/15 p-5 shadow-card">
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-accent">
          <span>Pergunta</span>
          <span className="inline-flex items-center gap-1"><Clock3 size={15} /> 00:45</span>
        </div>
        <p className="mt-7 font-display text-2xl leading-tight font-black">
          Qual comida quase todo mundo gosta?
        </p>
      </div>
    );
  }

  if (visual === "answers") {
    return (
      <div className="min-h-44 rounded-card border border-border bg-background p-4">
        <p className="mb-4 text-center text-sm font-extrabold text-muted">Respostas reveladas</p>
        <div className="grid gap-2">
          {["Ana — Pizza", "Bia — Pizza", "Caio — Sushi"].map((answer, index) => (
            <div
              key={answer}
              className={`flex items-center justify-between rounded-control border px-4 py-3 font-bold ${index < 2 ? "border-success/50 bg-success/10" : "border-border bg-surface"}`}
            >
              {answer}
              {index < 2 ? <Check size={19} className="text-success" aria-label="Entrou no fluxo" /> : null}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-44 place-items-center rounded-card border border-accent/45 bg-accent/10 p-5 text-center">
      <div>
        <Crown size={58} className="mx-auto text-accent" aria-hidden="true" />
        <p className="mt-3 font-display text-xl font-black">Rei do Fluxo</p>
        <p className="text-sm font-bold text-muted">Quem somar mais pontos vence</p>
      </div>
    </div>
  );
}
