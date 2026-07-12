import { NextResponse } from "next/server";
import { generateSecureWord, isRateLimited } from "../_lib/mockStore";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const now = Date.now();
  if (isRateLimited(email, now)) {
    return NextResponse.json(
      {
        error: `Please wait a few seconds before requesting a new secure word.`,
      },
      { status: 429 },
    );
  }

  const entry = generateSecureWord(email);

  return NextResponse.json({ word: entry.word, expiresAt: entry.expiresAt });
}
