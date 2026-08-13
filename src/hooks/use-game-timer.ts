"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { calculateRemainingSeconds } from "@/lib/game";
import type { TimerStatus } from "@/types/game";

interface UseGameTimerOptions {
  status: TimerStatus;
  endsAt: number | null;
  durationSeconds: number;
  onFinished?: () => void;
}

export function useGameTimer({
  status,
  endsAt,
  durationSeconds,
  onFinished,
}: UseGameTimerOptions) {
  const getRemaining = useCallback(() => {
    if (status === "finished") return 0;
    if (status === "idle" || endsAt === null) return durationSeconds;
    return calculateRemainingSeconds(endsAt);
  }, [durationSeconds, endsAt, status]);
  const [runningTime, setRunningTime] = useState(() => ({
    endsAt,
    seconds: getRemaining(),
  }));
  const didFinish = useRef(status === "finished");

  useEffect(() => {
    didFinish.current = status === "finished";
  }, [status]);

  useEffect(() => {
    if (status !== "running" || endsAt === null) return;

    const update = () => {
      const next = calculateRemainingSeconds(endsAt);
      setRunningTime({ endsAt, seconds: next });
      if (next === 0 && !didFinish.current) {
        didFinish.current = true;
        onFinished?.();
      }
    };

    const interval = window.setInterval(update, 200);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", update);
    };
  }, [endsAt, onFinished, status]);

  const remainingSeconds =
    status === "finished"
      ? 0
      : status === "idle" || endsAt === null
        ? durationSeconds
        : runningTime.endsAt === endsAt
          ? runningTime.seconds
          : getRemaining();

  return {
    remainingSeconds,
    isUrgent: status === "running" && remainingSeconds <= 10,
    isFinished: status === "finished" || remainingSeconds === 0,
  };
}
