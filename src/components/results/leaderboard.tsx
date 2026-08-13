import { Medal } from "lucide-react";

import { Reveal } from "@/components/motion";
import { cn } from "@/lib/cn";
import type { RankingEntry } from "@/types/game";

function positionLabel(position: number): string {
  return `${position}º`;
}

export function Leaderboard({ ranking }: { ranking: readonly RankingEntry[] }) {
  const allPlayersTied =
    ranking.length > 1 && ranking.every((entry) => entry.position === 1);

  return (
    <section aria-labelledby="ranking-title">
      <div className="mb-3 flex items-center justify-between gap-4 px-1">
        <h2 id="ranking-title" className="font-display text-xl font-extrabold">
          Ranking final
        </h2>
        <span className="text-xs font-bold tracking-wide text-muted uppercase">
          {ranking.length} jogadores
        </span>
      </div>

      <ol className="space-y-2.5">
        {ranking.map((entry, index) => {
          const isFriendlyLast =
            entry.isLastPlace && !entry.isWinner && !allPlayersTied;

          return (
            <li key={entry.player.id}>
              <Reveal delay={Math.min(index * 0.045, 0.28)}>
                <div
                  className={cn(
                    "flex min-h-16 items-center gap-3 rounded-control border bg-surface px-4 py-3 shadow-[0_8px_22px_rgb(0_0_0/0.18)]",
                    entry.isWinner ? "border-accent/45" : "border-border",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-xl font-display text-base font-extrabold",
                      entry.position === 1
                        ? "bg-accent/15 text-accent"
                        : entry.position === 2
                          ? "bg-white/10 text-foreground"
                          : entry.position === 3
                            ? "bg-[#d88b55]/15 text-[#f2aa75]"
                            : "bg-white/5 text-muted",
                    )}
                    aria-label={`${entry.position}º lugar`}
                  >
                    {entry.position <= 3 ? (
                      <Medal size={20} aria-hidden="true" />
                    ) : (
                      positionLabel(entry.position)
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-base font-extrabold text-foreground">
                      {entry.player.name}
                    </p>
                    {isFriendlyLast ? (
                      <p className="text-xs font-medium text-muted">
                        Pensou diferente 😅
                      </p>
                    ) : entry.position === 1 ? (
                      <p className="text-xs font-medium text-accent">
                        Mandou muito no fluxo
                      </p>
                    ) : null}
                  </div>

                  <p className="shrink-0 text-right font-display text-lg font-extrabold">
                    {entry.player.score}
                    <span className="ml-1 text-xs font-semibold text-muted">
                      pts
                    </span>
                  </p>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
