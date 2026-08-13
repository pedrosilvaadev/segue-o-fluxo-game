import { expect, test } from "@playwright/test";

const viewports = [
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
] as const;

for (const viewport of viewports) {
  test(`home sem overflow ou erros em ${viewport.width}x${viewport.height}`, async ({ page }) => {
    const runtimeErrors: string[] = [];
    page.on("pageerror", (error) => runtimeErrors.push(`pageerror: ${error.message}`));
    page.on("console", (message) => {
      if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
    });

    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /segue\s+o\s+fluxo/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /começar jogo/i })).toBeVisible();
    await page.waitForLoadState("networkidle");

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
    expect(runtimeErrors, runtimeErrors.join("\n")).toEqual([]);
  });
}

test("apresenta o onboarding completo de como jogar", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Como jogar?" }).click();
  await expect(
    page.getByRole("heading", { name: "Prepare a galera" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Próximo" }).click();
  await expect(
    page.getByRole("heading", { name: "Pense rápido" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Próximo" }).click();
  await expect(page.getByText("Ana — Pizza")).toBeVisible();
  await page.getByRole("button", { name: "Próximo" }).click();

  await expect(
    page.getByRole("heading", { name: "Descubra quem fluiu" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Entendi, começar" }).click();
  await expect(page).toHaveURL(/\/setup$/);
});
