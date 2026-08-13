export type RandomSource = () => number;

function nextRandom(random: RandomSource): number {
  const value = random();

  if (!Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError("Random source must return a number from 0 up to 1.");
  }

  return value;
}

/**
 * Returns a shuffled copy using Fisher-Yates. The input is never mutated.
 * A random source can be injected to make domain tests deterministic.
 */
export function fisherYatesShuffle<T>(
  items: readonly T[],
  random: RandomSource = Math.random,
): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(nextRandom(random) * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

export const shuffle = fisherYatesShuffle;
