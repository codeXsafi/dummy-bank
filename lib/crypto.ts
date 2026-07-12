/*
 * lib/crypto.ts — client-side password hashing helper, used by the login
 * flow's secure-word step before POSTing to /api/login.
 */

export async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
