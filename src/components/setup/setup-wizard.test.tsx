import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { clearGamePersistence, useGameStore } from "@/store/game-store";

import { SetupWizard } from "./setup-wizard";

const router = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => router,
}));

describe("SetupWizard", () => {
  beforeEach(() => {
    clearGamePersistence();
    router.push.mockReset();
    router.replace.mockReset();
    useGameStore.setState({
      game: null,
      roundScores: {},
      usedQuestionIds: [],
      hasHydrated: true,
    });
    useGameStore.getState().createGame();
  });

  afterEach(cleanup);

  it("valida jogadores e salva as escolhas antes de revisar a partida", async () => {
    const user = userEvent.setup();
    render(<SetupWizard />);

    const nameInput = screen.getByLabelText("Nome do jogador");
    const addButton = screen.getByRole("button", { name: "Adicionar jogador" });
    expect(screen.getByRole("button", { name: "Continuar" })).toBeDisabled();

    await user.type(nameInput, "Ana");
    await user.click(addButton);
    await user.type(nameInput, " ana ");
    await user.click(addButton);
    expect(screen.getByRole("alert")).toHaveTextContent(/nomes diferentes/i);

    await user.clear(nameInput);
    await user.type(nameInput, "Bia");
    await user.click(addButton);
    await user.type(nameInput, "Caio");
    await user.click(addButton);

    await user.click(screen.getByRole("button", { name: "Continuar" }));
    expect(screen.getByRole("heading", { name: "Quantas rodadas?" })).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "Voltar uma etapa" }),
    ).not.toBeInTheDocument();

    const continueButton = screen.getByRole("button", { name: "Continuar" });
    const backButton = screen.getByRole("button", { name: "Voltar" });
    expect(
      continueButton.compareDocumentPosition(backButton) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    await user.click(backButton);
    expect(screen.getByRole("heading", { name: "Quem vai jogar?" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Continuar" }));
    expect(screen.getByRole("list", { name: "Etapas da configuração" }).children[1]).toHaveAttribute("aria-current", "step");

    await user.click(screen.getByRole("radio", { name: /^5Rápido$/ }));
    expect(useGameStore.getState().game?.settings.rounds).toBe(5);
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    await user.click(screen.getByRole("radio", { name: /^30 segundos/ }));
    expect(useGameStore.getState().game?.settings.timerSeconds).toBe(30);
    await user.click(screen.getByRole("button", { name: "Revisar partida" }));

    await waitFor(() => expect(router.push).toHaveBeenCalledWith("/ready"));
    expect(useGameStore.getState().game?.players.map(({ name }) => name)).toEqual([
      "Ana",
      "Bia",
      "Caio",
    ]);
  });
});
