/*
 * POST /api/login — step 2 of login. Confirms the secure word issued by
 * /api/getSecureWord is still valid, then checks the (already-hashed)
 * password.
 *
 * The client hashes the password with Web Crypto (SHA-256) before it ever
 * leaves the browser (see the login form in Phase 3) — this route only ever
 * sees and compares hashes, never a plaintext password. That hashing is
 * defense-in-depth, not a substitute for TLS: this mock server has no TLS
 * termination of its own, and a real deployment would still need
 * server-side salted hashing (bcrypt/argon2) at rest — client-side SHA-256
 * alone is fast to brute-force and unsalted, so it only helps against a
 * network observer seeing the raw password, not against a compromised
 * server's user table.
 */
import { NextResponse } from "next/server";
import {
  EXPECTED_PASSWORD_HASH,
  ROLE_BY_EMAIL,
  secureWordStore,
} from "../_lib/mockStore";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const secureWord =
    typeof body?.secureWord === "string" ? body.secureWord : "";
  const hashedPassword =
    typeof body?.hashedPassword === "string" ? body.hashedPassword : "";

  if (!email || !secureWord || !hashedPassword) {
    return NextResponse.json(
      { error: "Email, secure word, and hashed password are all required." },
      { status: 400 }
    );
  }

  const issuedWord = secureWordStore.get(email);
  if (!issuedWord) {
    return NextResponse.json(
      { error: "No secure word was issued for this email. Start over." },
      { status: 401 }
    );
  }

  if (Date.now() > issuedWord.expiresAt) {
    return NextResponse.json(
      { error: "Your secure word has expired. Request a new one." },
      { status: 401 }
    );
  }

  if (issuedWord.word !== secureWord) {
    // Should only happen if the client sent back a stale/tampered value —
    // the UI never lets the user edit the displayed word.
    return NextResponse.json(
      { error: "Secure word does not match." },
      { status: 401 }
    );
  }

  const role = ROLE_BY_EMAIL[email];
  if (!role || hashedPassword !== EXPECTED_PASSWORD_HASH) {
    return NextResponse.json(
      { error: "Incorrect email or password." },
      { status: 401 }
    );
  }

  // The secure word is single-use: once it's been spent on a successful
  // password check, remove it so it can't be replayed against /api/login
  // again without going through /api/getSecureWord first.
  secureWordStore.delete(email);

  // A real backend would issue a signed, short-lived session token here
  // (e.g. a JWT or opaque session id backed by a session store). This mock
  // returns a fixed placeholder string — it is NOT a real credential, only
  // enough for the frontend's Zustand auth store to treat as "logged in
  // pending MFA".
  return NextResponse.json({ token: `mock-token-${email}`, role });
}
