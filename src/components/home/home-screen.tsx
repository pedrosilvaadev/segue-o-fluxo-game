import { ArrowRight, Bolt, CircleHelp, Sparkles, Users } from "lucide-react";
import Link from "next/link";

import { PageContainer, PageShell } from "@/components/layout";
import { HowToPlayOnboarding } from "@/components/home/how-to-play-onboarding";

const primaryLink =
  "inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-control border border-primary-strong bg-primary-strong px-6 py-3 font-display text-base font-extrabold text-white shadow-[var(--shadow-button)] transition-[transform,background-color,box-shadow] hover:bg-primary active:translate-y-[5px] active:shadow-[var(--shadow-button-active)] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent";

export function HomeScreen() {
  return (
    <PageShell centered className="isolate">
      <PageContainer className="justify-between py-8 sm:py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="animate-game-float absolute -left-6 top-24 grid size-24 -rotate-12 place-items-center rounded-[2rem] border border-primary/40 bg-primary/15 text-primary-soft shadow-card">
            <CircleHelp size={42} strokeWidth={3} />
          </div>
          <div className="animate-game-float absolute -right-7 top-40 grid size-20 rotate-12 place-items-center rounded-full border border-secondary/40 bg-secondary/15 text-secondary [animation-delay:-1.2s]">
            <Sparkles size={34} strokeWidth={3} />
          </div>
          <div className="absolute inset-x-10 top-1/3 h-48 rounded-full bg-primary/15 blur-3xl" />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-muted">
            Jogo de galera
          </span>
          <span className="grid size-11 place-items-center rounded-full bg-accent text-[#251f08] shadow-[0_5px_0_#9e8420]">
            <Bolt size={23} fill="currentColor" aria-hidden="true" />
          </span>
        </div>

        <div className="relative z-10 my-10 text-center">
          <p className="mb-3 font-display text-sm font-black uppercase tracking-[0.22em] text-accent">
            Pense igual. Marque pontos.
          </p>
          <h1 className="font-display text-[clamp(4rem,20vw,6.4rem)] leading-[0.73] font-black tracking-[-0.08em] text-foreground">
            <span className="block -rotate-2">SEGUE</span>
            <span className="my-3 block text-[0.45em] tracking-[0.08em] text-secondary">
              O
            </span>
            <span className="block rotate-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text pb-3 text-transparent">
              FLUXO
            </span>
          </h1>
          <div className="mx-auto mt-7 flex w-fit items-center gap-2 rounded-full border border-border bg-surface/85 px-4 py-2 text-sm font-bold text-muted shadow-card">
            <Users size={18} className="text-primary-soft" aria-hidden="true" />
            3 a 10 jogadores • 1 celular
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          <Link href="/setup" className={`${primaryLink} animate-game-pulse`}>
            Começar jogo <ArrowRight size={21} aria-hidden="true" />
          </Link>

          <HowToPlayOnboarding />
        </div>
      </PageContainer>
    </PageShell>
  );
}
