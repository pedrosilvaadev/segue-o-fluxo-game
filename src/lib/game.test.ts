import { describe, expect, it } from "vitest";

import type { GameState, Player } from "../types/game";
import type { Question } from "../types/question";
import {
  calculateRanking,
  calculateRemainingSeconds,
  createTimerEnd,
  getTimerStatus,
  restartGame,
  selectQuestions,
} from "./game";

function question(id: string, enabled = true): Question {
  return { id, text: `Question ${id}?`, category: "geral", enabled };
}

function player(id: string, score: number, roundWins = 0): Player {
  return { id, name: id.toUpperCase(), score, roundWins };
}

function readyGame(overrides: Partial<GameState> = {}): GameState {
  return {
    id: "game-1",
    status: "finished",
    players: [player("ana", 8, 2), player("bia", 3, 1)],
    settings: { rounds: 5, timerSeconds: 45 },
    questions: Array.from({ length: 5 }, (_, index) =>
      question(`old-${index + 1}`),
    ),
    currentRound: 5,
    currentQuestionId: "old-5",
    roundResults: [
      {
        round: 1,
        questionId: "old-1",
        scores: [{ playerId: "ana", points: 2 }],
      },
    ],
    timer: { status: "finished", endsAt: 1_000 },
    startedAt: "2026-01-01T00:00:00.000Z",
    completedAt: "2026-01-01T00:10:00.000Z",
    ...overrides,
  };
}

describe("selectQuestions", () => {
  it("selects only enabled, unique questions without mutating the catalog", () => {
    const catalog = [question("q1"), question("off", false), question("q2")];
    const snapshot = structuredClone(catalog);

    const result = selectQuestions({
      questions: catalog,
      rounds: 2,
      random: () => 0,
    });

    expect(result.questions.map(({ id }) => id)).toEqual(["q2", "q1"]);
    expect(new Set(result.questions.map(({ id }) => id)).size).toBe(2);
    expect(result.questions.every(({ enabled }) => enabled)).toBe(true);
    expect(result.usedQuestionIds).toEqual(["q2", "q1"]);
    expect(result.historyWasReset).toBe(false);
    expect(catalog).toEqual(snapshot);
  });

  it("avoids recently used questions when enough fresh ones exist", () => {
    const result = selectQuestions({
      questions: [question("used"), question("fresh-1"), question("fresh-2")],
      rounds: 2,
      usedQuestionIds: ["used"],
      random: () => 0,
    });

    expect(result.questions.map(({ id }) => id)).toEqual([
      "fresh-2",
      "fresh-1",
    ]);
    expect(result.usedQuestionIds).toEqual(["used", "fresh-2", "fresh-1"]);
    expect(result.historyWasReset).toBe(false);
  });

  it("resets stale history when it would leave too few candidates", () => {
    const result = selectQuestions({
      questions: [question("q1"), question("q2"), question("q3")],
      rounds: 2,
      usedQuestionIds: ["q1", "q2", "unknown-old-id"],
      random: () => 0,
    });

    expect(result.historyWasReset).toBe(true);
    expect(result.questions.map(({ id }) => id)).toEqual(["q2", "q3"]);
    expect(result.usedQuestionIds).toEqual(["q2", "q3"]);
  });

  it("deduplicates history and caps oldest entries", () => {
    const result = selectQuestions({
      questions: [question("q1"), question("q2"), question("q3")],
      rounds: 1,
      usedQuestionIds: ["old", "q1", "old"],
      maxHistory: 3,
      random: () => 0.99,
    });

    expect(result.questions[0].id).toBe("q2");
    expect(result.usedQuestionIds).toEqual(["q1", "old", "q2"]);
  });

  it("reports invalid configuration and catalog errors", () => {
    const catalog = [question("q1"), question("q2", false)];

    expect(() => selectQuestions({ questions: catalog, rounds: 0 })).toThrow(
      "Rounds must be a positive integer",
    );
    expect(() =>
      selectQuestions({ questions: catalog, rounds: 1, maxHistory: 1.5 }),
    ).toThrow("Maximum history must be a positive integer");
    expect(() => selectQuestions({ questions: catalog, rounds: 2 })).toThrow(
      "Not enough enabled questions: 2 requested, 1 available",
    );
    expect(() =>
      selectQuestions({
        questions: [question("same"), question("same")],
        rounds: 1,
      }),
    ).toThrow("Duplicate question id: same");
  });
});

describe("calculateRanking", () => {
  it("uses competition positions for ties and preserves source order within them", () => {
    const players = [
      player("ana", 10),
      player("bia", 4),
      player("caio", 10),
      player("duda", 1),
      player("eli", 1),
    ];

    const ranking = calculateRanking(players);

    expect(
      ranking.map(({ player: rankedPlayer, position }) => [
        rankedPlayer.id,
        position,
      ]),
    ).toEqual([
      ["ana", 1],
      ["caio", 1],
      ["bia", 3],
      ["duda", 4],
      ["eli", 4],
    ]);
    expect(ranking.map(({ isWinner }) => isWinner)).toEqual([
      true,
      true,
      false,
      false,
      false,
    ]);
    expect(ranking.map(({ isLastPlace }) => isLastPlace)).toEqual([
      false,
      false,
      false,
      true,
      true,
    ]);
  });

  it("returns cloned players and leaves the original order untouched", () => {
    const players = [player("low", 1), player("high", 2)];

    const ranking = calculateRanking(players);

    expect(players.map(({ id }) => id)).toEqual(["low", "high"]);
    expect(ranking.map(({ player: rankedPlayer }) => rankedPlayer.id)).toEqual([
      "high",
      "low",
    ]);
    expect(ranking[0].player).not.toBe(players[1]);
    expect(calculateRanking([])).toEqual([]);
  });
});

describe("timer helpers", () => {
  it("creates an absolute deadline from a duration", () => {
    expect(createTimerEnd(45, 10_000)).toBe(55_000);
  });

  it("rounds partial seconds up and never returns a negative value", () => {
    expect(calculateRemainingSeconds(10_001, 10_000)).toBe(1);
    expect(calculateRemainingSeconds(11_000, 10_000)).toBe(1);
    expect(calculateRemainingSeconds(11_001, 10_000)).toBe(2);
    expect(calculateRemainingSeconds(9_999, 10_000)).toBe(0);
  });

  it("derives idle, running and finished statuses for recovery", () => {
    expect(getTimerStatus(null, 10_000)).toBe("idle");
    expect(getTimerStatus(10_001, 10_000)).toBe("running");
    expect(getTimerStatus(10_000, 10_000)).toBe("finished");
    expect(getTimerStatus(1, 10_000)).toBe("finished");
  });

  it("rejects invalid durations and timestamps", () => {
    expect(() => createTimerEnd(0)).toThrow(RangeError);
    expect(() => createTimerEnd(2.5)).toThrow(RangeError);
    expect(() => createTimerEnd(30, Number.NaN)).toThrow(RangeError);
    expect(() => calculateRemainingSeconds(Number.POSITIVE_INFINITY)).toThrow(
      RangeError,
    );
    expect(() => calculateRemainingSeconds(1, Number.NaN)).toThrow(RangeError);
  });
});

describe("restartGame", () => {
  it("keeps players and settings while resetting match progress", () => {
    const game = readyGame();
    const sourceSnapshot = structuredClone(game);
    const newQuestions = Array.from({ length: 5 }, (_, index) =>
      question(`new-${index + 1}`),
    );

    const restarted = restartGame(game, newQuestions, "game-2");

    expect(restarted).toEqual({
      id: "game-2",
      status: "ready",
      players: [player("ana", 0), player("bia", 0)],
      settings: { rounds: 5, timerSeconds: 45 },
      questions: newQuestions,
      currentRound: 0,
      currentQuestionId: null,
      roundResults: [],
      timer: { status: "idle", endsAt: null },
    });
    expect(game).toEqual(sourceSnapshot);
    expect(restarted.players).not.toBe(game.players);
    expect(restarted.settings).not.toBe(game.settings);
    expect(restarted.questions).not.toBe(newQuestions);
  });

  it("uses the current game ID by default", () => {
    const game = readyGame();
    const newQuestions = Array.from({ length: 5 }, (_, index) =>
      question(`new-${index}`),
    );

    expect(restartGame(game, newQuestions).id).toBe(game.id);
  });

  it("requires the configured amount of unique questions", () => {
    const game = readyGame();

    expect(() => restartGame(game, [question("only-one")])).toThrow(
      "Restart requires exactly 5 questions",
    );
    expect(() =>
      restartGame(game, [
        question("same"),
        question("same"),
        question("q3"),
        question("q4"),
        question("q5"),
      ]),
    ).toThrow("Duplicate question id: same");
  });
});
