import { describe, expect, it, vi } from "vitest";

import { fisherYatesShuffle, shuffle } from "./shuffle";

describe("fisherYatesShuffle", () => {
  it("returns a deterministically shuffled copy with Fisher-Yates", () => {
    const source = ["a", "b", "c", "d"] as const;
    const values = [0.5, 0, 0.75];
    let call = 0;

    const result = fisherYatesShuffle(source, () => values[call++]);

    expect(result).toEqual(["d", "b", "a", "c"]);
    expect(call).toBe(source.length - 1);
  });

  it("does not mutate the input and always returns another array", () => {
    const source = Object.freeze([1, 2, 3, 4]);

    const result = shuffle(source, () => 0);

    expect(source).toEqual([1, 2, 3, 4]);
    expect(result).toEqual([2, 3, 4, 1]);
    expect(result).not.toBe(source);
  });

  it("does not request randomness when no swap is possible", () => {
    const random = vi.fn(() => 0.5);

    expect(fisherYatesShuffle([], random)).toEqual([]);
    expect(fisherYatesShuffle(["only"], random)).toEqual(["only"]);
    expect(random).not.toHaveBeenCalled();
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, -0.01, 1])(
    "rejects an invalid random value: %s",
    (value) => {
      expect(() => fisherYatesShuffle([1, 2], () => value)).toThrow(
        RangeError,
      );
    },
  );
});
