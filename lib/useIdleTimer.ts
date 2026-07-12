/*
 * lib/useIdleTimer.ts — tracks user activity (mouse/keyboard) and fires
 * callbacks after two thresholds of inactivity: a warning, then a hard
 * timeout.
 */
"use client";

import { useCallback, useEffect, useRef } from "react";

const WARNING_AFTER_MS = 50_000; // show the warning modal
const TIMEOUT_AFTER_MS = 100_000; // total inactivity before forced logout

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

    return () => {
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
      window.removeEventListener("mousemove", resetTimers);
      window.removeEventListener("keydown", resetTimers);
    };
  }, [resetTimers]);

  return { resetTimers };
}
