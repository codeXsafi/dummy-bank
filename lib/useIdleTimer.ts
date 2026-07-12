/*
 * lib/useIdleTimer.ts — tracks user activity (mouse/keyboard) and fires
 * callbacks after two thresholds of inactivity: a warning, then a hard
 * timeout. Used by the dashboard route group's layout (Phase 4) to show an
 * "are you still there?" modal and eventually force a logout.
 */
"use client";

import { useCallback, useEffect, useRef } from "react";

const WARNING_AFTER_MS = 10_000; // show the warning modal
const TIMEOUT_AFTER_MS = 30_000; // total inactivity before forced logout

interface UseIdleTimerOptions {
  onWarning: () => void;
  onTimeout: () => void;
}

export function useIdleTimer({ onWarning, onTimeout }: UseIdleTimerOptions) {
  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Re-arms both timers from "now" — called on mount and on every tracked
  // activity event, and exposed so the layout can also call it explicitly
  // when the user dismisses the warning modal.
  const resetTimers = useCallback(() => {
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
    warningTimeoutRef.current = setTimeout(onWarning, WARNING_AFTER_MS);
    logoutTimeoutRef.current = setTimeout(onTimeout, TIMEOUT_AFTER_MS);
  }, [onWarning, onTimeout]);

  useEffect(() => {
    resetTimers();
    window.addEventListener("mousemove", resetTimers);
    window.addEventListener("keydown", resetTimers);

    // Cleanup has to tear down BOTH the two pending timeouts AND the two
    // event listeners together. Miss the timeouts and a stale one fires
    // onTimeout (forcing a logout) against a layout that already
    // unmounted; miss the listeners and every remount (e.g. React strict
    // mode, or navigating between authenticated routes if this hook were
    // ever moved to a page instead of the shared layout) stacks another
    // pair of listeners, each independently resetting/firing timers.
    return () => {
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
      window.removeEventListener("mousemove", resetTimers);
      window.removeEventListener("keydown", resetTimers);
    };
  }, [resetTimers]);

  return { resetTimers };
}
