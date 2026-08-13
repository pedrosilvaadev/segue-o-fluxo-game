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
