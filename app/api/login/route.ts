/*
 * POST /api/login — step 2 of login. Confirms the secure word issued by
 * /api/getSecureWord is still valid, then checks the (already-hashed) password.
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
      { status: 400 },
    );
  }

  const issuedWord = secureWordStore.get(email);
  if (!issuedWord) {
    return NextResponse.json(
      { error: "No secure word was issued for this email. Start over." },
      { status: 401 },
    );
  }

  if (Date.now() > issuedWord.expiresAt) {
    return NextResponse.json(
      { error: "Your secure word has expired. Request a new one." },
      { status: 401 },
    );
  }

  if (issuedWord.word !== secureWord) {
    // Should only happen if the client sent back a stale/tampered value —
    // the UI never lets the user edit the displayed word.
    return NextResponse.json(
      { error: "Secure word does not match." },
      { status: 401 },
    );
  }

  const role = ROLE_BY_EMAIL[email];
  if (!role || hashedPassword !== EXPECTED_PASSWORD_HASH) {
    return NextResponse.json(
      { error: "Incorrect email or password." },
      { status: 401 },
    );
  }

  // The secure word is single-use: once it's been spent on a successful
  // password check, remove it so it can't be replayed against /api/login
  // again without going through /api/getSecureWord first.
  secureWordStore.delete(email);

  return NextResponse.json({ token: `mock-token-${email}`, role });
}
