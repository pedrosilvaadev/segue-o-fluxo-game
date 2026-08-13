import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ScoreStepper } from "./score-stepper";

afterEach(cleanup);

describe("ScoreStepper", () => {
  it("incrementa e decrementa sem ultrapassar os limites", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<ScoreStepper value={0} onChange={onChange} label="Ana" />);

    expect(screen.getByRole("button", { name: "Diminuir pontos de Ana" })).toBeDisabled();
    expect(screen.getByLabelText("0 pontos para Ana")).toHaveTextContent("0");
    await user.click(screen.getByRole("button", { name: "Aumentar pontos de Ana" }));
    expect(onChange).toHaveBeenLastCalledWith(1);

    rerender(<ScoreStepper value={3} onChange={onChange} label="Ana" />);
    expect(screen.getByRole("button", { name: "Aumentar pontos de Ana" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Diminuir pontos de Ana" }));
    expect(onChange).toHaveBeenLastCalledWith(2);
  });
});
