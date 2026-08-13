import { beforeEach, describe, expect, it } from "vitest";

import { STORAGE_KEYS } from "../lib/storage";
import {
  clearGamePersistence,
  hydrateGameStore,
  useGameStore,
} from "./game-store";

function createConfiguredGame(): void {
  const store = useGameStore.getState();
  store.createGame();
  store.addPlayer(" Ana ");
  store.addPlayer("Bia");
  store.addPlayer("Caio");
  store.setRounds(5);
  store.setTimer(30);
}

describe("game store", () => {
  beforeEach(() => {
    clearGamePersistence();
    useGameStore.setState({
      game: null,
      roundScores: {},
      usedQuestionIds: [],
      hasHydrated: false,
    });
  });

  it("normalizes names and rejects empty or duplicate players", () => {
    useGameStore.getState().createGame();
    const player = useGameStore.getState().addPlayer("  Ana  ");

    expect(player.name).toBe("Ana");
    expect(() => useGameStore.getState().addPlayer(" ")).toThrow("obrigatório");
    expect(() => useGameStore.getState().addPlayer("ana")).toThrow(
      "nomes diferentes",
    );
  });

  it("requires at least three players and starts with unique questions", () => {
    useGameStore.getState().createGame();
    useGameStore.getState().addPlayer("Ana");
    useGameStore.getState().addPlayer("Bia");

    expect(() => useGameStore.getState().startGame()).toThrow("entre 3 e 10");

    useGameStore.getState().addPlayer("Caio");
    useGameStore.getState().setRounds(5);
    useGameStore.getState().startGame();

    const game = useGameStore.getState().game;
    expect(game?.status).toBe("playing");
    expect(game?.questions).toHaveLength(5);
    expect(new Set(game?.questions.map((question) => question.id)).size).toBe(
      5,
    );
    expect(localStorage.getItem(STORAGE_KEYS.usedQuestions)).not.toBeNull();
  });

  it("validates and commits one score per player", () => {
    createConfiguredGame();
    useGameStore.getState().startGame();
    useGameStore.getState().beginScoring();

    const players = useGameStore.getState().game?.players ?? [];
    expect(() => useGameStore.getState().addScore(players[0].id, 4)).toThrow(
      "entre 0 e 3",
    );

    useGameStore.getState().addScore(players[0].id, 2);
    useGameStore.getState().completeRound();

    const game = useGameStore.getState().game;
    expect(game?.players[0].score).toBe(2);
    expect(game?.players[0].roundWins).toBe(1);
    expect(game?.roundResults).toHaveLength(1);
    expect(() => useGameStore.getState().completeRound()).toThrow(
      "já foi pontuada",
    );
  });

  it("changes only an idle question without repeating the game selection", () => {
    createConfiguredGame();
    useGameStore.getState().startGame();

    const before = useGameStore.getState().game;
    const previousIds = new Set(
      before?.questions.map((question) => question.id),
    );
    const previousCurrentId = before?.currentQuestionId;

    useGameStore.getState().changeQuestion();

    const after = useGameStore.getState().game;
    expect(after?.currentQuestionId).not.toBe(previousCurrentId);
    expect(previousIds.has(after?.currentQuestionId ?? "")).toBe(false);
    expect(new Set(after?.questions.map((question) => question.id)).size).toBe(
      5,
    );
    expect(localStorage.getItem(STORAGE_KEYS.usedQuestions)).toContain(
      after?.currentQuestionId,
    );

    useGameStore.getState().startTimer();
    expect(() => useGameStore.getState().changeQuestion()).toThrow(
      "antes de iniciar o timer",
    );
  });

  it("marks a persisted running timer as finished after hydration", async () => {
    createConfiguredGame();
    useGameStore.getState().startGame();
    useGameStore.getState().startTimer(1_000);

    useGameStore.setState({ hasHydrated: false });
    await hydrateGameStore();

    expect(useGameStore.getState().hasHydrated).toBe(true);
    expect(useGameStore.getState().game?.timer.status).toBe("finished");
  });

  it("reopens setup from a restarted ready game", () => {
    createConfiguredGame();
    useGameStore.getState().startGame();
    useGameStore.getState().beginScoring();

    const players = useGameStore.getState().game?.players ?? [];
    useGameStore
      .getState()
      .completeRound(
        players.map((player) => ({ playerId: player.id, points: 0 })),
      );
    useGameStore.setState((state) => ({
      game: state.game ? { ...state.game, status: "finished" } : null,
    }));
    useGameStore.getState().restartGame();
    useGameStore.getState().reopenSetup();

    const game = useGameStore.getState().game;
    expect(game?.status).toBe("setup");
    expect(game?.players).toHaveLength(3);
    expect(game?.questions).toEqual([]);
  });
});
