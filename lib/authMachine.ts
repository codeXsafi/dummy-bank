/*
 * lib/authMachine.ts — the login flow's state machine. Owns the sequence of
 * screens the multi-step login can be in and the only legal transitions
 * between them.
 */

export type AuthStep =
  | "idle" // step 1: email entry, nothing requested yet
  | "wordFetched" // step 2: secure word + password entry
  | "passwordSubmitted" // transient: password accepted, about to show MFA
  | "mfaPending" // step 3: MFA code entry
  | "authenticated"; // flow complete

export interface LoginFlowState {
  step: AuthStep;
  email: string;
  secureWord: string | null;
  secureWordExpiresAt: number | null;
  // Client-side mirror of the server's remaining-attempts count, for
  // display only — see verifyMfa/route.ts for why the server, not this
  // value, is the actual source of truth for the lockout.
  mfaAttemptsRemaining: number;
  error: string | null;
}

export type LoginFlowEvent =
  | { type: "WORD_FETCHED"; email: string; word: string; expiresAt: number }
  | { type: "WORD_FETCH_ERROR"; error: string }
  | { type: "LOGIN_SUCCESS" }
  | { type: "LOGIN_ERROR"; error: string }
  | { type: "GO_TO_MFA" }
  | { type: "MFA_ERROR"; error: string; attemptsRemaining: number }
  | { type: "MFA_SUCCESS" }
  | { type: "EXPIRED" }
  | { type: "RESET" };

export const initialLoginFlowState: LoginFlowState = {
  step: "idle",
  email: "",
  secureWord: null,
  secureWordExpiresAt: null,
  mfaAttemptsRemaining: 3,
  error: null,
};

export function nextStep(
  current: AuthStep,
  eventType: LoginFlowEvent["type"],
): AuthStep {
  switch (current) {
    case "idle":
      return eventType === "WORD_FETCHED" ? "wordFetched" : current;
    case "wordFetched":
      if (eventType === "LOGIN_SUCCESS") return "passwordSubmitted";
      if (eventType === "EXPIRED" || eventType === "RESET") return "idle";
      return current;
    case "passwordSubmitted":
      if (eventType === "GO_TO_MFA") return "mfaPending";
      if (eventType === "RESET") return "idle";
      return current;
    case "mfaPending":
      if (eventType === "MFA_SUCCESS") return "authenticated";
      if (eventType === "RESET") return "idle";
      return current;
    case "authenticated":
      return current;
  }
}

export function loginFlowReducer(
  state: LoginFlowState,
  event: LoginFlowEvent,
): LoginFlowState {
  const step = nextStep(state.step, event.type);

  switch (event.type) {
    case "WORD_FETCHED":
      return {
        step,
        email: event.email,
        secureWord: event.word,
        secureWordExpiresAt: event.expiresAt,
        mfaAttemptsRemaining: 3,
        error: null,
      };
    case "WORD_FETCH_ERROR":
      return { ...state, error: event.error };
    case "LOGIN_SUCCESS":
      return { ...state, step, error: null };
    case "LOGIN_ERROR":
      return { ...state, error: event.error };
    case "GO_TO_MFA":
      return { ...state, step };
    case "MFA_ERROR":
      return {
        ...state,
        error: event.error,
        mfaAttemptsRemaining: event.attemptsRemaining,
      };
    case "MFA_SUCCESS":
      return { ...state, step, error: null };
    case "EXPIRED":
      return {
        ...initialLoginFlowState,
        error: "Your secure word expired — please start over.",
      };
    case "RESET":
      return { ...initialLoginFlowState };
    default:
      return state;
  }
}

export function stepIndexForAuthStep(step: AuthStep): 1 | 2 | 3 {
  switch (step) {
    case "idle":
      return 1;
    case "wordFetched":
    case "passwordSubmitted":
      return 2;
    case "mfaPending":
    case "authenticated":
      return 3;
  }
}
