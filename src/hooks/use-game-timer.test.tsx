import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useGameTimer } from "./use-game-timer";

describe("useGameTimer", () => {
  it("shows zero immediately for an expired running timer", () => {
    const { result } = renderHook(() =>
      useGameTimer({
        status: "running",
        endsAt: Date.now() - 1_000,
        durationSeconds: 45,
      }),
    );

    expect(result.current.remainingSeconds).toBe(0);
    expect(result.current.isFinished).toBe(true);
  });

  it("synchronizes idle and finished status changes", () => {
    const { result, rerender } = renderHook(
      ({ status }: { status: "idle" | "finished" }) =>
        useGameTimer({ status, endsAt: null, durationSeconds: 45 }),
      { initialProps: { status: "idle" as "idle" | "finished" } },
    );

    expect(result.current.remainingSeconds).toBe(45);
    rerender({ status: "finished" });
    expect(result.current.remainingSeconds).toBe(0);
    rerender({ status: "idle" });
    expect(result.current.remainingSeconds).toBe(45);
  });
});
