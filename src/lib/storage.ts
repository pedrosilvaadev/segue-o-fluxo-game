import type { StateStorage } from "zustand/middleware";

export const STORAGE_KEYS = {
  game: "segue-o-fluxo:game",
  usedQuestions: "segue-o-fluxo:used-questions",
  preferences: "segue-o-fluxo:preferences",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

function getLocalStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * SSR-safe storage adapter shared by Zustand and the small persisted values
 * that do not belong in the game snapshot.
 */
export const browserStorage: StateStorage = {
  getItem(name) {
    try {
      return getLocalStorage()?.getItem(name) ?? null;
    } catch {
      return null;
    }
  },
  setItem(name, value) {
    try {
      getLocalStorage()?.setItem(name, value);
    } catch {
      // Storage may be disabled or full. The in-memory game remains usable.
    }
  },
  removeItem(name) {
    try {
      getLocalStorage()?.removeItem(name);
    } catch {
      // Removing persisted state is best-effort for the same reason as writes.
    }
  },
};

export function readStorageJson<T>(key: StorageKey, fallback: T): T {
  const value = browserStorage.getItem(key);

  if (typeof value !== "string") {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function writeStorageJson<T>(key: StorageKey, value: T): void {
  browserStorage.setItem(key, JSON.stringify(value));
}

export function removeStorageItem(key: StorageKey): void {
  browserStorage.removeItem?.(key);
}
