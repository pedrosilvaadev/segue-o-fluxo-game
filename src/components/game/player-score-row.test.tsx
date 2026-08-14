import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PlayerScoreRow } from "./player-score-row";

afterEach(cleanup);

describe("PlayerScoreRow", () => {
  it("limita a pontuação da rodada a dois pontos", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const player = { id: "ana", name: "Ana", score: 0, roundWins: 0 };
    const { rerender } = render(
      <PlayerScoreRow player={player} roundPoints={1} onChange={onChange} />,
    );

    await user.click(
      screen.getByRole("button", { name: "Aumentar pontos de Ana" }),
    );
    expect(onChange).toHaveBeenLastCalledWith(2);

    rerender(
      <PlayerScoreRow player={player} roundPoints={2} onChange={onChange} />,
    );
    expect(
      screen.getByRole("button", { name: "Aumentar pontos de Ana" }),
    ).toBeDisabled();
  });
});
