/*
 * POST /api/getSecureWord — step 1 of login. Issues a per-email "secure
 * word" the user should recognize on the next screen before entering their
 * password (see mockStore.ts for why this exists).
 *
 * Rate-limited to one issuance per 10s per email, and each word expires
 * 60s after issuance. Both limits exist for the same underlying reason:
 * this endpoint hands out a piece of trust ("here is your recognizable
 * word") and both the rate limit (anti-abuse — stops a script from hammering
 * this endpoint to enumerate valid emails or spam word generation) and the
 * expiry (anti-phishing window — an attacker who captured a word from a
 * cloned page has a shrinking, not permanent, window to reuse it) bound how
 * long/how often that trust can be exploited.
 */
import { NextResponse } from "next/server";
import { generateSecureWord, isRateLimited } from "../_lib/mockStore";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email) {
    return NextResponse.json(
      { error: "Email is required." },
      { status: 400 }
    );
  }

  const now = Date.now();
  if (isRateLimited(email, now)) {
    return NextResponse.json(
      {
        error: `Please wait a few seconds before requesting a new secure word.`,
      },
      { status: 429 }
    );
  }

  const entry = generateSecureWord(email);

  return NextResponse.json({ word: entry.word, expiresAt: entry.expiresAt });
}
