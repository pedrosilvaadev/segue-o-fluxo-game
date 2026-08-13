import { expect, type Page, test } from "@playwright/test";

const GAME_STORAGE_KEY = "segue-o-fluxo:game";

async function createFiveRoundGame(page: Page) {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await page.getByRole("link", { name: /começar jogo/i }).click({ force: true });
  await expect(page).toHaveURL(/\/setup$/);

  const playerName = page.getByLabel("Nome do jogador");
  for (const name of ["Ana", "Bia", "Caio"]) {
    await playerName.fill(name);
    await page.getByRole("button", { name: "Adicionar jogador" }).click({ force: true });
  }

  await page.getByRole("button", { name: "Continuar" }).click({ force: true });
  await page.getByRole("radio", { name: /^5\s/ }).check({ force: true });
  await page.getByRole("button", { name: "Continuar" }).click({ force: true });
  await page.getByRole("radio", { name: /^30 segundos/ }).check({ force: true });
  await page.getByRole("button", { name: "Revisar partida" }).click({ force: true });

  await expect(page).toHaveURL(/\/ready$/);
  await expect(page.getByRole("heading", { name: "Tudo pronto?" })).toBeVisible();
  await page.getByRole("button", { name: "Começar jogo" }).click({ force: true });
  await expect(page).toHaveURL(/\/game$/);
}

async function expireTimer(page: Page) {
  await page.getByRole("button", { name: "Iniciar timer" }).click({ force: true });
  await page.clock.fastForward(31_000);
  await expect(page.getByRole("button", { name: "Revelar respostas" })).toBeVisible();
  await page.getByRole("button", { name: "Revelar respostas" }).click({ force: true });
  await expect(page).toHaveURL(/\/game\/score$/);
}

test("completa 5 rodadas com 3 jogadores e permite jogar novamente", async ({ page }) => {
  await createFiveRoundGame(page);
  await page.clock.install({ time: new Date("2026-08-13T15:00:00Z") });

  for (let round = 1; round <= 5; round += 1) {
    await expect(page.getByText(`Rodada ${round} de 5`, { exact: true })).toBeVisible();
    await expireTimer(page);

    await page.getByRole("button", { name: "Aumentar pontos de Ana" }).click({ force: true });
    const finishLabel = round === 5 ? "Ver resultado final" : "Confirmar rodada";
    await page.getByRole("button", { name: finishLabel }).click({ force: true });
    await page.getByRole("button", { name: "Pular transição" }).click({ force: true });
  }

  await expect(page).toHaveURL(/\/results$/);
  const skipReveal = page.getByRole("button", { name: /pular revelação/i });
  if (await skipReveal.isVisible()) await skipReveal.click({ force: true });
  await expect(page.getByRole("heading", { name: "Ana" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Ranking final" })).toBeVisible();

  await page.getByRole("button", { name: "Jogar novamente" }).click();
  await expect(page).toHaveURL(/\/ready$/);
  await expect(page.getByText("5", { exact: true })).toBeVisible();
  await expect(page.getByText("30", { exact: true })).toBeVisible();

  const restartedGame = await page.evaluate((key) => {
    const persisted = window.localStorage.getItem(key);
    return persisted ? JSON.parse(persisted).state.game : null;
  }, GAME_STORAGE_KEY);
  expect(restartedGame.players).toEqual([
    expect.objectContaining({ name: "Ana", score: 0, roundWins: 0 }),
    expect.objectContaining({ name: "Bia", score: 0, roundWins: 0 }),
    expect.objectContaining({ name: "Caio", score: 0, roundWins: 0 }),
  ]);
  expect(restartedGame.settings).toEqual({ rounds: 5, timerSeconds: 30 });
  expect(restartedGame.roundResults).toEqual([]);
});

test("recupera rodada e timer em andamento após refresh", async ({ page }) => {
  await createFiveRoundGame(page);
  await page.clock.install({ time: new Date("2026-08-13T15:00:00Z") });
  await page.getByRole("button", { name: "Iniciar timer" }).click({ force: true });
  await page.clock.fastForward(5_000);
  await expect(page.getByText("00:25", { exact: true })).toBeVisible();

  await page.reload();

  await expect(page).toHaveURL(/\/game$/);
  await expect(page.getByText("Rodada 1 de 5", { exact: true })).toBeVisible();
  await expect(page.getByText("00:25", { exact: true })).toBeVisible();

  await page.clock.fastForward(26_000);
  await expect(page.getByRole("button", { name: "Revelar respostas" })).toBeVisible();
});

test("reinicia uma partida ativa do zero somente após confirmação", async ({
  page,
}) => {
  await createFiveRoundGame(page);

  await page.getByRole("button", { name: "Reiniciar jogo do zero" }).click();
  await expect(
    page.getByRole("alertdialog", { name: "Reiniciar do zero?" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Continuar partida" }).click();
  await expect(page).toHaveURL(/\/game$/);

  await page.getByRole("button", { name: "Reiniciar jogo do zero" }).click();
  await page.getByRole("button", { name: "Sim, reiniciar tudo" }).click();

  await expect(page).toHaveURL(/\/setup$/);
  await expect(page.getByLabel("Nome do jogador")).toBeVisible();
  await expect(page.getByText("0/10 jogadores")).toBeVisible();
  expect(
    await page.evaluate(() =>
      window.localStorage.getItem("segue-o-fluxo:used-questions"),
    ),
  ).toBeNull();
});
