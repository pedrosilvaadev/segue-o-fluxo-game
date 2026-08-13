"use client";

import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button, IconButton } from "@/components/ui";
import { useGameStore } from "@/store/game-store";

export function ResetGameButton() {
  const router = useRouter();
  const resetGameFromScratch = useGameStore(
    (state) => state.resetGameFromScratch,
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  const confirmReset = () => {
    resetGameFromScratch();
    router.replace("/setup");
  };

  return (
    <>
      <IconButton
        label="Reiniciar jogo do zero"
        icon={<RotateCcw size={19} />}
        tone="danger"
        onClick={() => setIsOpen(true)}
      />

      {isOpen ? (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-black/75 p-5 backdrop-blur-sm"
          role="presentation"
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="reset-game-title"
            aria-describedby="reset-game-description"
            className="w-full max-w-sm rounded-card border border-danger/60 bg-surface-raised p-6 shadow-card"
          >
            <span
              aria-hidden="true"
              className="mb-4 grid size-12 place-items-center rounded-2xl bg-danger/15 text-danger"
            >
              <RotateCcw size={24} />
            </span>
            <h2 id="reset-game-title" className="font-display text-2xl font-black">
              Reiniciar do zero?
            </h2>
            <p id="reset-game-description" className="mt-2 text-sm leading-relaxed text-muted">
              Jogadores, configurações, pontos e o progresso desta partida serão
              apagados. Essa ação não pode ser desfeita.
            </p>
            <div className="mt-6 grid gap-3">
              <Button fullWidth variant="danger" onClick={confirmReset}>
                Sim, reiniciar tudo
              </Button>
              <Button
                autoFocus
                fullWidth
                variant="quiet"
                onClick={() => setIsOpen(false)}
              >
                Continuar partida
              </Button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
