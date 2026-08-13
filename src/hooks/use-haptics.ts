"use client";

import { useCallback, useMemo } from "react";

function vibrate(pattern: number | number[]): void {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;

  try {
    navigator.vibrate(pattern);
  } catch {
    // Haptics are enhancement-only and may be blocked by the browser.
  }
}

export function useHaptics() {
  const tap = useCallback(() => vibrate(20), []);
  const success = useCallback(() => vibrate([45, 35, 70]), []);
  const warning = useCallback(() => vibrate(50), []);
  const timerEnd = useCallback(() => vibrate([100, 50, 100]), []);

  return useMemo(
    () => ({ tap, success, warning, timerEnd }),
    [success, tap, timerEnd, warning],
  );
}
