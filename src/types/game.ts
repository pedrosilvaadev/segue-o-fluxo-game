import type { Question } from "./question";

export const ROUND_OPTIONS = [5, 10, 15, 20] as const;
export const TIMER_OPTIONS = [30, 45, 60] as const;

export type RoundCount = (typeof ROUND_OPTIONS)[number];
export type TimerSeconds = (typeof TIMER_OPTIONS)[number];
export type GameStatus =
  | "setup"
  | "ready"
  | "playing"
  | "scoring"
  | "finished";
export type TimerStatus = "idle" | "running" | "finished";

export interface Player {
  id: string;
  name: string;
  score: number;
  roundWins: number;
}

export interface GameSettings {
  rounds: RoundCount;
  timerSeconds: TimerSeconds;
}

export interface PlayerRoundScore {
  playerId: string;
  points: number;
}

export interface RoundResult {
  round: number;
  questionId: string;
  scores: PlayerRoundScore[];
}

export interface GameTimer {
  status: TimerStatus;
  /** Absolute Unix timestamp in milliseconds. */
  endsAt: number | null;
}

export interface GameState {
  id: string;
  status: GameStatus;
  players: Player[];
  settings: GameSettings;
  questions: Question[];
  currentRound: number;
  currentQuestionId: string | null;
  roundResults: RoundResult[];
  timer: GameTimer;
  startedAt?: string;
  completedAt?: string;
}

export interface RankingEntry {
  player: Player;
  /** Competition ranking: tied players share a position (1, 1, 3). */
  position: number;
  isWinner: boolean;
  isLastPlace: boolean;
}
