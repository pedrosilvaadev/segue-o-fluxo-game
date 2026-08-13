import type {
  GameState,
  Player,
  RankingEntry,
  TimerStatus,
} from "../types/game";
import type { Question } from "../types/question";
import { fisherYatesShuffle, type RandomSource } from "./shuffle";

export const DEFAULT_MAX_QUESTION_HISTORY = 100;

export interface QuestionSelectionOptions {
  questions: readonly Question[];
  rounds: number;
  usedQuestionIds?: readonly string[];
  maxHistory?: number;
  random?: RandomSource;
}

export interface QuestionSelectionResult {
  questions: Question[];
  usedQuestionIds: string[];
  historyWasReset: boolean;
}

function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError(`${label} must be a positive integer.`);
  }
}

function assertUniqueQuestionIds(questions: readonly Question[]): void {
  const ids = new Set<string>();

  for (const question of questions) {
    if (ids.has(question.id)) {
      throw new Error(`Duplicate question id: ${question.id}`);
    }

    ids.add(question.id);
  }
}

function appendQuestionHistory(
  history: readonly string[],
  selectedIds: readonly string[],
  maxHistory: number,
): string[] {
  const orderedUniqueIds = new Map<string, true>();

  for (const id of [...history, ...selectedIds]) {
    orderedUniqueIds.delete(id);
    orderedUniqueIds.set(id, true);
  }

  return [...orderedUniqueIds.keys()].slice(-maxHistory);
}

/**
 * Selects enabled questions without repetition. When recent history leaves too
 * few candidates, old history is discarded automatically as required by the
 * product rules. The returned history is already capped for persistence.
 */
export function selectQuestions({
  questions,
  rounds,
  usedQuestionIds = [],
  maxHistory = DEFAULT_MAX_QUESTION_HISTORY,
  random = Math.random,
}: QuestionSelectionOptions): QuestionSelectionResult {
  assertPositiveInteger(rounds, "Rounds");
  assertPositiveInteger(maxHistory, "Maximum history");
  assertUniqueQuestionIds(questions);

  const enabledQuestions = questions.filter((question) => question.enabled);

  if (enabledQuestions.length < rounds) {
    throw new RangeError(
      `Not enough enabled questions: ${rounds} requested, ${enabledQuestions.length} available.`,
    );
  }

  const usedIds = new Set(usedQuestionIds);
  const freshQuestions = enabledQuestions.filter(
    (question) => !usedIds.has(question.id),
  );
  const historyWasReset = freshQuestions.length < rounds;
  const candidates = historyWasReset ? enabledQuestions : freshQuestions;
  const selected = fisherYatesShuffle(candidates, random).slice(0, rounds);
  const previousHistory = historyWasReset ? [] : usedQuestionIds;

  return {
    questions: selected,
    usedQuestionIds: appendQuestionHistory(
      previousHistory,
      selected.map((question) => question.id),
      maxHistory,
    ),
    historyWasReset,
  };
}

/**
 * Produces a stable competition ranking. Equal scores share the same position,
 * and the following position is skipped (for example: 1, 1, 3).
 */
export function calculateRanking(players: readonly Player[]): RankingEntry[] {
  const sortedPlayers = players
    .map((player, originalIndex) => ({ player, originalIndex }))
    .sort(
      (left, right) =>
        right.player.score - left.player.score ||
        left.originalIndex - right.originalIndex,
    );
  const lowestScore = sortedPlayers.at(-1)?.player.score;
  let previousScore: number | undefined;
  let previousPosition = 0;

  return sortedPlayers.map(({ player }, index) => {
    const position =
      previousScore === player.score ? previousPosition : index + 1;

    previousScore = player.score;
    previousPosition = position;

    return {
      player: { ...player },
      position,
      isWinner: position === 1,
      isLastPlace: player.score === lowestScore,
    };
  });
}

export const getRanking = calculateRanking;

export function createTimerEnd(
  durationSeconds: number,
  now: number = Date.now(),
): number {
  assertPositiveInteger(durationSeconds, "Timer duration");

  if (!Number.isFinite(now)) {
    throw new RangeError("Current time must be a finite timestamp.");
  }

  return now + durationSeconds * 1_000;
}

/** Calculates a drift-resistant display value from an absolute end timestamp. */
export function calculateRemainingSeconds(
  endsAt: number,
  now: number = Date.now(),
): number {
  if (!Number.isFinite(endsAt) || !Number.isFinite(now)) {
    throw new RangeError("Timer timestamps must be finite numbers.");
  }

  return Math.max(0, Math.ceil((endsAt - now) / 1_000));
}

export const getRemainingSeconds = calculateRemainingSeconds;

/** Derives the persisted timer state, including recovery after a refresh. */
export function getTimerStatus(
  endsAt: number | null,
  now: number = Date.now(),
): TimerStatus {
  if (endsAt === null) {
    return "idle";
  }

  return calculateRemainingSeconds(endsAt, now) > 0
    ? "running"
    : "finished";
}

/**
 * Creates the state used by “Play again”: configuration and players are kept,
 * while scores, round progress and timer state are reset. Questions are passed
 * in so selection/history remains an independently testable concern.
 */
export function restartGame(
  game: Readonly<GameState>,
  questions: readonly Question[],
  id: string = game.id,
): GameState {
  if (questions.length !== game.settings.rounds) {
    throw new RangeError(
      `Restart requires exactly ${game.settings.rounds} questions.`,
    );
  }

  assertUniqueQuestionIds(questions);

  return {
    id,
    status: "ready",
    players: game.players.map((player) => ({
      ...player,
      score: 0,
      roundWins: 0,
    })),
    settings: { ...game.settings },
    questions: [...questions],
    currentRound: 0,
    currentQuestionId: null,
    roundResults: [],
    timer: {
      status: "idle",
      endsAt: null,
    },
  };
}
