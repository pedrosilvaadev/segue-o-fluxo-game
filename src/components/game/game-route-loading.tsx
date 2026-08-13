export function GameRouteLoading() {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-6">
      <div className="text-center" role="status">
        <div className="mx-auto mb-4 size-12 animate-spin rounded-full border-4 border-primary/25 border-t-primary" />
        <p className="font-display font-black text-foreground">Retomando o fluxo…</p>
      </div>
    </main>
  );
}
