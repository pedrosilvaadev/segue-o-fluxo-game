import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { RoundProgress } from "./round-progress";

afterEach(cleanup);

describe("RoundProgress", () => {
  it("sincroniza texto, porcentagem e atributos acessíveis da rodada", () => {
    const { rerender } = render(<RoundProgress current={3} total={5} />);

    expect(screen.getByText("Rodada 3 de 5")).toBeVisible();
    expect(screen.getByText("60%")).toBeVisible();
    expect(screen.getByRole("progressbar", { name: "Rodada 3 de 5" })).toHaveAttribute("aria-valuenow", "3");

    rerender(<RoundProgress current={5} total={5} />);
    expect(screen.getByText("100%")).toBeVisible();
    expect(screen.getByRole("progressbar", { name: "Rodada 5 de 5" })).toHaveAttribute("aria-valuemax", "5");
  });
});
