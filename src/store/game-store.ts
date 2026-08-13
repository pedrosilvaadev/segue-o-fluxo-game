import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { questions as questionBank } from "../data/questions";
import {
  createTimerEnd,
  getTimerStatus,
  restartGame as createRestartedGame,
  selectQuestions,
} from "../lib/game";
import {
  browserStorage,
  readStorageJson,
  removeStorageItem,
  STORAGE_KEYS,
  writeStorageJson,
} from "../lib/storage";
import {
  ROUND_OPTIONS,
  TIMER_OPTIONS,
  type GameState,
  type Player,
  type PlayerRoundScore,
  type RoundCount,
  type TimerSeconds,
} from "../types/game";

const STORE_VERSION = 1;
const MIN_PLAYERS = 3;
const MAX_PLAYERS = 10;
const MAX_PLAYER_NAME_LENGTH = 20;
const MIN_ROUND_POINTS = 0;
const MAX_ROUND_POINTS = 3;

type RoundScores = Record<string, number>;

interface PersistedGameStore {
  game: GameState | null;
  roundScores: RoundScores;
}

export interface GameStore extends PersistedGameStore {
  usedQuestionIds: string[];
  hasHydrated: boolean;
  createGame: () => GameState;
  addPlayer: (name: string) => Player;
  removePlayer: (playerId: string) => void;
  updatePlayer: (playerId: string, name: string) => void;
  configureRounds: (rounds: RoundCount) => void;
  configureTimer: (timerSeconds: TimerSeconds) => void;
  setRounds: (rounds: RoundCount) => void;
  setTimer: (timerSeconds: TimerSeconds) => void;
  startGame: () => void;
  startRound: () => void;
  startTimer: (now?: number) => void;
  changeQuestion: () => void;
  beginScoring: () => void;
  addScore: (playerId: string, points: number) => void;
  submitRoundScore: (scores?: readonly PlayerRoundScore[]) => void;
  completeRound: (scores?: readonly PlayerRoundScore[]) => void;
  nextRound: () => void;
  finishGame: () => void;
  restartGame: () => void;
  reopenSetup: () => void;
  resetGame: () => void;
  recoverTimer: (now?: number) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

function newId(): string {
  return crypto.randomUUID();
}

function normalizePlayerName(name: string): string {
  const normalized = name.trim();

  if (!normalized) {
    throw new Error("O nome do jogador é obrigatório.");
  }

  if (normalized.length > MAX_PLAYER_NAME_LENGTH) {
    throw new Error(
      `O nome deve ter no máximo ${MAX_PLAYER_NAME_LENGTH} caracteres.`,
    );
  }

  return normalized;
}

function requireGame(game: GameState | null): GameState {
  if (!game) {
    throw new Error("Nenhuma partida foi criada.");
  }

  return game;
}

function assertSetup(game: GameState): void {
  if (game.status !== "setup") {
    throw new Error("A configuração não pode ser alterada após o início.");
  }
}

function assertUniqueName(
  players: readonly Player[],
  name: string,
  ignoredPlayerId?: string,
): void {
  const comparableName = name.toLocaleLowerCase("pt-BR");
  const duplicate = players.some(
    (player) =>
      player.id !== ignoredPlayerId &&
      player.name.toLocaleLowerCase("pt-BR") === comparableName,
  );

  if (duplicate) {
    throw new Error("Os jogadores precisam ter nomes diferentes.");
  }
}

function assertPlayerCount(players: readonly Player[]): void {
  if (players.length < MIN_PLAYERS || players.length > MAX_PLAYERS) {
    throw new Error(
      `A partida precisa ter entre ${MIN_PLAYERS} e ${MAX_PLAYERS} jogadores.`,
    );
  }
}

function assertPoints(points: number): void {
  if (
    !Number.isInteger(points) ||
    points < MIN_ROUND_POINTS ||
    points > MAX_ROUND_POINTS
  ) {
    throw new RangeError(
      `A pontuação da rodada deve ser um inteiro entre ${MIN_ROUND_POINTS} e ${MAX_ROUND_POINTS}.`,
    );
  }
}

function scoresFromDraft(
  players: readonly Player[],
  roundScores: Readonly<RoundScores>,
): PlayerRoundScore[] {
  return players.map((player) => ({
    playerId: player.id,
    points: roundScores[player.id] ?? 0,
  }));
}

function validateScores(
  players: readonly Player[],
  scores: readonly PlayerRoundScore[],
): PlayerRoundScore[] {
  const playerIds = new Set(players.map((player) => player.id));
  const receivedIds = new Set<string>();

  for (const score of scores) {
    if (!playerIds.has(score.playerId)) {
      throw new Error("A pontuação contém um jogador desconhecido.");
    }
    if (receivedIds.has(score.playerId)) {
      throw new Error("A pontuação de um jogador foi informada duas vezes.");
    }

    assertPoints(score.points);
    receivedIds.add(score.playerId);
  }

  if (receivedIds.size !== playerIds.size) {
    throw new Error("Informe a pontuação de todos os jogadores.");
  }

  return scores.map((score) => ({ ...score }));
}

function readUsedQuestionIds(): string[] {
  const stored = readStorageJson<unknown>(STORAGE_KEYS.usedQuestions, []);

  if (!Array.isArray(stored)) {
    return [];
  }

  return stored.filter(
    (id, index): id is string =>
      typeof id === "string" && stored.indexOf(id) === index,
  );
}

function migratePersistedState(
  persistedState: unknown,
  version: number,
): PersistedGameStore {
  if (!persistedState || typeof persistedState !== "object") {
    return { game: null, roundScores: {} };
  }

  const state = persistedState as Partial<PersistedGameStore>;

  if (version < 1) {
    return {
      game: state.game ?? null,
      roundScores: state.roundScores ?? {},
    };
  }

  return {
    game: state.game ?? null,
    roundScores: state.roundScores ?? {},
  };
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => {
      const configureRounds = (rounds: RoundCount): void => {
        if (!ROUND_OPTIONS.includes(rounds)) {
          throw new RangeError("Quantidade de rodadas inválida.");
        }

        set((state) => {
          const game = requireGame(state.game);
          assertSetup(game);
          return { game: { ...game, settings: { ...game.settings, rounds } } };
        });
      };

      const configureTimer = (timerSeconds: TimerSeconds): void => {
        if (!TIMER_OPTIONS.includes(timerSeconds)) {
          throw new RangeError("Duração do timer inválida.");
        }

        set((state) => {
          const game = requireGame(state.game);
          assertSetup(game);
          return {
            game: {
              ...game,
              settings: { ...game.settings, timerSeconds },
            },
          };
        });
      };

      const submitRoundScore = (
        suppliedScores?: readonly PlayerRoundScore[],
      ): void => {
        set((state) => {
          const game = requireGame(state.game);

          if (game.status !== "scoring" || !game.currentQuestionId) {
            throw new Error("A rodada ainda não está pronta para pontuar.");
          }
          if (
            game.roundResults.some(
              (result) => result.round === game.currentRound,
            )
          ) {
            throw new Error("Esta rodada já foi pontuada.");
          }

          const scores = validateScores(
            game.players,
            suppliedScores ?? scoresFromDraft(game.players, state.roundScores),
          );
          const highestRoundScore = Math.max(
            ...scores.map((score) => score.points),
          );
          const winningIds = new Set(
            highestRoundScore > 0
              ? scores
                  .filter((score) => score.points === highestRoundScore)
                  .map((score) => score.playerId)
              : [],
          );

          return {
            game: {
              ...game,
              players: game.players.map((player) => ({
                ...player,
                score:
                  player.score +
                  (scores.find((score) => score.playerId === player.id)
                    ?.points ?? 0),
                roundWins:
                  player.roundWins + (winningIds.has(player.id) ? 1 : 0),
              })),
              roundResults: [
                ...game.roundResults,
                {
                  round: game.currentRound,
                  questionId: game.currentQuestionId,
                  scores,
                },
              ],
            },
            roundScores: {},
          };
        });
      };

      return {
        game: null,
        roundScores: {},
        usedQuestionIds: [],
        hasHydrated: false,

        createGame() {
          const game: GameState = {
            id: newId(),
            status: "setup",
            players: [],
            settings: { rounds: 10, timerSeconds: 45 },
            questions: [],
            currentRound: 0,
            currentQuestionId: null,
            roundResults: [],
            timer: { status: "idle", endsAt: null },
          };

          set({ game, roundScores: {} });
          return game;
        },

        addPlayer(name) {
          const normalizedName = normalizePlayerName(name);
          let createdPlayer: Player | undefined;

          set((state) => {
            const game = requireGame(state.game);
            assertSetup(game);
            if (game.players.length >= MAX_PLAYERS) {
              throw new Error(`O limite é de ${MAX_PLAYERS} jogadores.`);
            }
            assertUniqueName(game.players, normalizedName);

            createdPlayer = {
              id: newId(),
              name: normalizedName,
              score: 0,
              roundWins: 0,
            };
            return {
              game: { ...game, players: [...game.players, createdPlayer] },
            };
          });

          if (!createdPlayer) {
            throw new Error("Não foi possível criar o jogador.");
          }
          return createdPlayer;
        },

        removePlayer(playerId) {
          set((state) => {
            const game = requireGame(state.game);
            assertSetup(game);
            if (!game.players.some((player) => player.id === playerId)) {
              throw new Error("Jogador não encontrado.");
            }
            return {
              game: {
                ...game,
                players: game.players.filter(
                  (player) => player.id !== playerId,
                ),
              },
            };
          });
        },

        updatePlayer(playerId, name) {
          const normalizedName = normalizePlayerName(name);
          set((state) => {
            const game = requireGame(state.game);
            assertSetup(game);
            if (!game.players.some((player) => player.id === playerId)) {
              throw new Error("Jogador não encontrado.");
            }
            assertUniqueName(game.players, normalizedName, playerId);
            return {
              game: {
                ...game,
                players: game.players.map((player) =>
                  player.id === playerId
                    ? { ...player, name: normalizedName }
                    : player,
                ),
              },
            };
          });
        },

        configureRounds,
        configureTimer,
        setRounds: configureRounds,
        setTimer: configureTimer,

        startGame() {
          set((state) => {
            const game = requireGame(state.game);
            if (game.status !== "setup" && game.status !== "ready") {
              throw new Error("A partida já foi iniciada.");
            }
            assertPlayerCount(game.players);

            const selection =
              game.status === "setup"
                ? selectQuestions({
                    questions: questionBank,
                    rounds: game.settings.rounds,
                    usedQuestionIds: state.usedQuestionIds,
                  })
                : {
                    questions: game.questions,
                    usedQuestionIds: state.usedQuestionIds,
                  };

            if (selection.questions.length !== game.settings.rounds) {
              throw new Error("A partida não possui perguntas suficientes.");
            }
            if (game.status === "setup") {
              writeStorageJson(
                STORAGE_KEYS.usedQuestions,
                selection.usedQuestionIds,
              );
            }

            return {
              usedQuestionIds: selection.usedQuestionIds,
              roundScores: {},
              game: {
                ...game,
                status: "playing",
                questions: selection.questions,
                currentRound: 1,
                currentQuestionId: selection.questions[0]?.id ?? null,
                roundResults: [],
                timer: { status: "idle", endsAt: null },
                startedAt: new Date().toISOString(),
                completedAt: undefined,
              },
            };
          });
        },

        startRound() {
          set((state) => {
            const game = requireGame(state.game);
            if (game.status !== "playing") {
              throw new Error("A partida não está em andamento.");
            }
            const question = game.questions[game.currentRound - 1];
            if (!question) {
              throw new Error("Não há pergunta para esta rodada.");
            }
            return {
              game: {
                ...game,
                currentQuestionId: question.id,
                timer: { status: "idle", endsAt: null },
              },
              roundScores: {},
            };
          });
        },

        startTimer(now = Date.now()) {
          set((state) => {
            const game = requireGame(state.game);
            if (game.status !== "playing" || !game.currentQuestionId) {
              throw new Error("Nenhuma rodada ativa para iniciar o timer.");
            }
            return {
              game: {
                ...game,
                timer: {
                  status: "running",
                  endsAt: createTimerEnd(game.settings.timerSeconds, now),
                },
              },
            };
          });
        },

        changeQuestion() {
          set((state) => {
            const game = requireGame(state.game);
            if (game.status !== "playing" || game.timer.status !== "idle") {
              throw new Error(
                "A pergunta só pode ser trocada antes de iniciar o timer.",
              );
            }

            const unavailableIds = new Set([
              ...game.questions.map((question) => question.id),
              ...game.roundResults.map((result) => result.questionId),
              ...state.usedQuestionIds,
            ]);
            const candidates = questionBank.filter(
              (question) =>
                question.enabled && !unavailableIds.has(question.id),
            );
            const replacement =
              candidates[Math.floor(Math.random() * candidates.length)];

            if (!replacement) {
              throw new Error("Não há outra pergunta disponível.");
            }

            const questions = [...game.questions];
            questions[game.currentRound - 1] = replacement;
            const usedQuestionIds = [
              ...state.usedQuestionIds.filter((id) => id !== replacement.id),
              replacement.id,
            ].slice(-100);
            writeStorageJson(STORAGE_KEYS.usedQuestions, usedQuestionIds);

            return {
              game: {
                ...game,
                questions,
                currentQuestionId: replacement.id,
              },
              usedQuestionIds,
            };
          });
        },

        beginScoring() {
          set((state) => {
            const game = requireGame(state.game);
            if (game.status !== "playing" || !game.currentQuestionId) {
              throw new Error("Nenhuma rodada ativa para pontuar.");
            }
            return {
              game: {
                ...game,
                status: "scoring",
                timer: { status: "finished", endsAt: game.timer.endsAt },
              },
              roundScores: Object.fromEntries(
                game.players.map((player) => [player.id, 0]),
              ),
            };
          });
        },

        addScore(playerId, points) {
          assertPoints(points);
          set((state) => {
            const game = requireGame(state.game);
            if (game.status !== "scoring") {
              throw new Error("A partida não está na etapa de pontuação.");
            }
            if (!game.players.some((player) => player.id === playerId)) {
              throw new Error("Jogador não encontrado.");
            }
            return {
              roundScores: { ...state.roundScores, [playerId]: points },
            };
          });
        },

        submitRoundScore,
        completeRound: submitRoundScore,

        nextRound() {
          set((state) => {
            const game = requireGame(state.game);
            const wasSubmitted = game.roundResults.some(
              (result) => result.round === game.currentRound,
            );
            if (!wasSubmitted) {
              throw new Error("Confirme a pontuação antes da próxima rodada.");
            }
            if (game.currentRound >= game.settings.rounds) {
              throw new Error("A última rodada já foi concluída.");
            }

            const nextRound = game.currentRound + 1;
            const nextQuestion = game.questions[nextRound - 1];
            if (!nextQuestion) {
              throw new Error("Não há pergunta para a próxima rodada.");
            }
            return {
              game: {
                ...game,
                status: "playing",
                currentRound: nextRound,
                currentQuestionId: nextQuestion.id,
                timer: { status: "idle", endsAt: null },
              },
              roundScores: {},
            };
          });
        },

        finishGame() {
          set((state) => {
            const game = requireGame(state.game);
            if (game.roundResults.length !== game.settings.rounds) {
              throw new Error("Ainda existem rodadas pendentes.");
            }
            return {
              game: {
                ...game,
                status: "finished",
                timer: { status: "finished", endsAt: game.timer.endsAt },
                completedAt: new Date().toISOString(),
              },
              roundScores: {},
            };
          });
        },

        restartGame() {
          set((state) => {
            const game = requireGame(state.game);
            const selection = selectQuestions({
              questions: questionBank,
              rounds: game.settings.rounds,
              usedQuestionIds: state.usedQuestionIds,
            });
            const restarted = createRestartedGame(
              game,
              selection.questions,
              newId(),
            );
            writeStorageJson(
              STORAGE_KEYS.usedQuestions,
              selection.usedQuestionIds,
            );

            return {
              game: restarted,
              usedQuestionIds: selection.usedQuestionIds,
              roundScores: {},
            };
          });
        },

        reopenSetup() {
          set((state) => {
            const game = requireGame(state.game);
            if (game.status !== "ready") {
              throw new Error("A partida não está pronta para reconfiguração.");
            }
            return {
              game: {
                ...game,
                status: "setup",
                questions: [],
                currentRound: 0,
                currentQuestionId: null,
                roundResults: [],
                timer: { status: "idle", endsAt: null },
              },
              roundScores: {},
            };
          });
        },

        resetGame() {
          set({ game: null, roundScores: {} });
        },

        recoverTimer(now = Date.now()) {
          set((state) => {
            if (!state.game || state.game.timer.status !== "running") {
              return state;
            }
            const status = getTimerStatus(state.game.timer.endsAt, now);
            return {
              game: {
                ...state.game,
                timer: { ...state.game.timer, status },
              },
            };
          });
        },

        setHasHydrated(hasHydrated) {
          set({ hasHydrated });
        },
      };
    },
    {
      name: STORAGE_KEYS.game,
      version: STORE_VERSION,
      storage: createJSONStorage(() => browserStorage),
      skipHydration: true,
      partialize: (state): PersistedGameStore => ({
        game: state.game,
        roundScores: state.roundScores,
      }),
      migrate: migratePersistedState,
      onRehydrateStorage: () => (state) => {
        if (!state) {
          useGameStore.setState({ hasHydrated: true });
          return;
        }

        useGameStore.setState({
          usedQuestionIds: readUsedQuestionIds(),
          hasHydrated: true,
        });
        state.recoverTimer();
      },
    },
  ),
);

/** Call once from a client provider before rendering route-dependent game UI. */
export async function hydrateGameStore(): Promise<void> {
  if (useGameStore.getState().hasHydrated) {
    return;
  }

  await useGameStore.persist.rehydrate();
}

export function clearGamePersistence(): void {
  removeStorageItem(STORAGE_KEYS.game);
  removeStorageItem(STORAGE_KEYS.usedQuestions);
}
