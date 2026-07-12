"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { EmailStep } from "@/components/login/EmailStep";
import { LoginShell } from "@/components/login/LoginShell";
import { SecureWordStep } from "@/components/login/SecureWordStep";
import { MfaStep } from "@/components/login/MfaStep";
import { initialLoginFlowState, loginFlowReducer } from "@/lib/authMachine";
import { sha256Hex } from "@/lib/crypto";
import { Role, useAuthStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const loginToStore = useAuthStore((s) => s.login);
  const [state, dispatch] = useReducer(loginFlowReducer, initialLoginFlowState);
  const [isLoading, setIsLoading] = useState(false);
  const [locked, setLocked] = useState(false);

  // The login token/role are known as soon as /api/login succeeds, but MFA
  // still has to pass before we treat the user as authenticated — so they're
  // held here rather than written straight into the Zustand store, and only
  // committed to the store once MFA_SUCCESS actually fires.
  const pendingSessionRef = useRef<{ token: string; role: Role } | null>(null);

  // "passwordSubmitted" is a deliberately transient state: as soon as we
  // arrive there, immediately advance to "mfaPending". Routing this through
  // an explicit intermediate step (rather than jumping wordFetched ->
  // mfaPending directly) is what the state machine's guard in
  // lib/authMachine.ts relies on to prove the flow went through every step
  // in order — see the Phase 6 test for this.
  useEffect(() => {
    if (state.step === "passwordSubmitted") {
      dispatch({ type: "GO_TO_MFA" });
    }
  }, [state.step]);

  async function handleEmailSubmit(email: string) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/getSecureWord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch({
          type: "WORD_FETCH_ERROR",
          error: data.error ?? "Something went wrong.",
        });
        return;
      }
      dispatch({
        type: "WORD_FETCHED",
        email,
        word: data.word,
        expiresAt: data.expiresAt,
      });
    } catch {
      dispatch({
        type: "WORD_FETCH_ERROR",
        error: "Network error. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePasswordSubmit(password: string) {
    if (!state.secureWord) return;
    setIsLoading(true);
    try {
      // Hash on the client so the plaintext password never leaves this tab
      // (see lib/crypto.ts for what this does and doesn't protect against).
      const hashedPassword = await sha256Hex(password);
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: state.email,
          secureWord: state.secureWord,
          hashedPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch({
          type: "LOGIN_ERROR",
          error: data.error ?? "Incorrect email or password.",
        });
        return;
      }
      pendingSessionRef.current = { token: data.token, role: data.role };
      dispatch({ type: "LOGIN_SUCCESS" });
    } catch {
      dispatch({
        type: "LOGIN_ERROR",
        error: "Network error. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleMfaSubmit(code: string) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/verifyMfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: state.email, code }),
      });
      const data = await res.json();

      if (data.locked) {
        setLocked(true);
        dispatch({
          type: "MFA_ERROR",
          error: data.error,
          attemptsRemaining: 0,
        });
        return;
      }
      if (!res.ok) {
        dispatch({
          type: "MFA_ERROR",
          error: data.error ?? "Incorrect code.",
          attemptsRemaining: Math.max(0, state.mfaAttemptsRemaining - 1),
        });
        return;
      }

      dispatch({ type: "MFA_SUCCESS" });
      const pending = pendingSessionRef.current;
      if (pending) {
        loginToStore(pending.token, pending.role, state.email);
      }
      router.push("/dashboard");
    } catch {
      dispatch({
        type: "MFA_ERROR",
        error: "Network error. Please try again.",
        attemptsRemaining: state.mfaAttemptsRemaining,
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleWordExpired() {
    dispatch({ type: "EXPIRED" });
  }

  return (
    <LoginShell step={state.step} onBack={() => dispatch({ type: "RESET" })}>
      {state.step === "idle" && (
        <EmailStep
          onSubmit={handleEmailSubmit}
          isLoading={isLoading}
          error={state.error}
        />
      )}

      {(state.step === "wordFetched" || state.step === "passwordSubmitted") &&
        state.secureWord &&
        state.secureWordExpiresAt && (
          <SecureWordStep
            email={state.email}
            secureWord={state.secureWord}
            expiresAt={state.secureWordExpiresAt}
            onSubmit={handlePasswordSubmit}
            onExpire={handleWordExpired}
            isLoading={isLoading}
            error={state.error}
          />
        )}

      {state.step === "mfaPending" && (
        <MfaStep
          email={state.email}
          attemptsRemaining={state.mfaAttemptsRemaining}
          locked={locked}
          isLoading={isLoading}
          error={state.error}
          onSubmit={handleMfaSubmit}
        />
      )}
    </LoginShell>
  );
}
