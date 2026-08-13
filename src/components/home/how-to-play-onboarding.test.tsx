import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { HowToPlayOnboarding } from "./how-to-play-onboarding";

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});

afterEach(cleanup);

describe("HowToPlayOnboarding", () => {
  it("explica o jogo em quatro passos e permite voltar", async () => {
    const user = userEvent.setup();
    render(<HowToPlayOnboarding />);

    await user.click(screen.getByRole("button", { name: "Como jogar?" }));
    expect(screen.getByRole("heading", { name: "Prepare a galera" })).toBeVisible();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");

    await user.click(screen.getByRole("button", { name: "Próximo" }));
    expect(screen.getByRole("heading", { name: "Pense rápido" })).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Próximo" }));
    expect(screen.getByText("Ana — Pizza")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Voltar para o passo anterior" }));
    expect(screen.getByRole("heading", { name: "Pense rápido" })).toBeVisible();
  });

  it("fecha pelo Escape e oferece início do jogo no último passo", async () => {
    const user = userEvent.setup();
    render(<HowToPlayOnboarding />);

    await user.click(screen.getByRole("button", { name: "Como jogar?" }));
    fireEvent(
      screen.getByRole("dialog"),
      new Event("cancel", { bubbles: false, cancelable: true }),
    );
    await waitFor(() =>
      expect(screen.getByRole("dialog", { hidden: true })).not.toHaveAttribute(
        "open",
      ),
    );

    await user.click(screen.getByRole("button", { name: "Como jogar?" }));
    await user.click(screen.getByRole("button", { name: "Próximo" }));
    await user.click(screen.getByRole("button", { name: "Próximo" }));
    await user.click(screen.getByRole("button", { name: "Próximo" }));

    expect(screen.getByRole("heading", { name: "Descubra quem fluiu" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Entendi, começar" })).toHaveAttribute(
      "href",
      "/setup",
    );
  });
});
