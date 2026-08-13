"use client";

import { useEffect } from "react";

import { hydrateGameStore } from "@/store/game-store";

export function GameStoreHydrator() {
  useEffect(() => {
    void hydrateGameStore();
  }, []);

  return null;
}
