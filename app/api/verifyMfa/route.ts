/*
 * POST /api/verifyMfa — step 3 of login. Checks the 6-digit MFA code and
 * enforces a server-side lockout after too many wrong attempts.
 *
 * The failed-attempt counter lives in mockStore's mfaAttemptStore — i.e.
 * server memory keyed by email — specifically because a client-side counter
 * (e.g. React state or localStorage) would be trivially bypassed by
 * refreshing the page or clearing storage. Whoever is guessing the code
 * doesn't control the server's memory, so the count can't be reset except
 * by the server's own logic (here: never, until process restart — a real
 * system would add a time-based unlock window).
 */
import { NextResponse } from "next/server";
import { MAX_MFA_ATTEMPTS, VALID_MFA_CODE, mfaAttemptStore } from "../_lib/mockStore";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const code = typeof body?.code === "string" ? body.code : "";

  if (!email || !code) {
    return NextResponse.json(
      { error: "Email and code are required." },
      { status: 400 }
    );
  }

  const attempts = mfaAttemptStore.get(email) ?? 0;
  if (attempts >= MAX_MFA_ATTEMPTS) {
    return NextResponse.json(
      { locked: true, error: "Too many incorrect attempts. Account locked." },
      { status: 423 } // 423 Locked
    );
  }

  if (code !== VALID_MFA_CODE) {
    const nextAttempts = attempts + 1;
    mfaAttemptStore.set(email, nextAttempts);
    const locked = nextAttempts >= MAX_MFA_ATTEMPTS;
    return NextResponse.json(
      {
        locked,
        error: locked
          ? "Too many incorrect attempts. Account locked."
          : `Incorrect code. ${MAX_MFA_ATTEMPTS - nextAttempts} attempt(s) remaining.`,
      },
      { status: locked ? 423 : 401 }
    );
  }

  // Success clears the counter — a legitimate user who fat-fingered the
  // code once shouldn't be closer to lockout on their next, unrelated login.
  mfaAttemptStore.delete(email);

  return NextResponse.json({ verified: true });
}
