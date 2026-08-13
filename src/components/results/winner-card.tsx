import { Crown, Sparkles, Trophy } from "lucide-react";

import { CountUp, PopIn } from "@/components/motion";
import { GameCard } from "@/components/ui";
import type { RankingEntry } from "@/types/game";

interface WinnerCardProps {
  winners: readonly RankingEntry[];
}

export function WinnerCard({ winners }: WinnerCardProps) {
  const topScore = winners[0]?.player.score ?? 0;
  const hasTie = winners.length > 1;

  return (
    <PopIn>
      <GameCard
        tone="primary"
        className="overflow-hidden border-accent/50 px-5 py-7 text-center shadow-[0_24px_70px_rgb(139_108_255/0.32)]"
      >
        <div className="absolute -top-14 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative mx-auto mb-3 flex size-16 items-center justify-center rounded-full border border-accent/50 bg-accent/15 text-accent shadow-[0_0_32px_rgb(248_212_72/0.3)]">
          {hasTie ? <Crown size={34} aria-hidden="true" /> : <Trophy size={34} aria-hidden="true" />}
        </div>

        <p className="font-display text-sm font-extrabold tracking-[0.18em] text-accent uppercase">
          {hasTie ? "No topo do fluxo" : "Mestre do fluxo"}
        </p>
        <h1 className="mt-2 text-balance font-display text-4xl leading-none font-extrabold tracking-tight text-foreground">
          {winners.map(({ player }) => player.name).join(" & ")}
        </h1>
        <p className="mt-4 flex items-center justify-center gap-2 text-lg font-bold text-primary-soft">
          <Sparkles size={18} aria-hidden="true" />
          <span>
            <CountUp value={topScore} /> {topScore === 1 ? "ponto" : "pontos"}
          </span>
        </p>
      </GameCard>
    </PopIn>
  );
}
