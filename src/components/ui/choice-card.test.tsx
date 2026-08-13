import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ChoiceCard, SegmentedSelector } from "./choice-card";

afterEach(cleanup);

describe("controles de seleção", () => {
  it("entrega o valor do ChoiceCard e respeita o estado desabilitado", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <ChoiceCard name="tempo" value="30" checked={false} onChange={onChange} label="30 segundos" />,
    );

    await user.click(screen.getByRole("radio", { name: "30 segundos" }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith("30");

    rerender(
      <ChoiceCard name="tempo" value="30" checked onChange={onChange} label="30 segundos" disabled />,
    );
    expect(screen.getByRole("radio", { name: "30 segundos" })).toBeChecked();
    await user.click(screen.getByRole("radio", { name: "30 segundos" }));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("altera o segmento selecionado mantendo um único radio marcado", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SegmentedSelector
        label="Dificuldade"
        value="medio"
        options={[
          { value: "facil", label: "Fácil" },
          { value: "medio", label: "Médio" },
          { value: "dificil", label: "Difícil" },
        ]}
        onChange={onChange}
      />,
    );

    expect(screen.getByRole("radio", { name: "Médio" })).toBeChecked();
    await user.click(screen.getByRole("radio", { name: "Difícil" }));
    expect(onChange).toHaveBeenCalledWith("dificil");
    expect(screen.getAllByRole("radio").filter((radio) => (radio as HTMLInputElement).checked)).toHaveLength(1);
  });
});
