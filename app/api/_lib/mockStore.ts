/*
 * app/api/_lib/mockStore.ts — shared in-memory "database" for the mock
 * backend.
 */

// ── Demo accounts ──────────────────────────────────────────────────────
// Role is derived from email for this mock
export const ROLE_BY_EMAIL: Record<string, "maker" | "viewer"> = {
  "maker@dummybank.com": "maker",
  "viewer@dummybank.com": "viewer",
};

// SHA-256("password123")
export const EXPECTED_PASSWORD_HASH =
  "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f";

// The MFA code
export const VALID_MFA_CODE = "123456";

// Two word lists a "secure word" phrase is drawn from (one adjective, one
// noun, e.g. "silver crane")
const ADJECTIVES = [
  "amber",
  "silver",
  "granite",
  "cobalt",
  "quartz",
  "tundra",
  "opal",
  "cedar",
  "violet",
  "copper",
  "arctic",
  "golden",
];

const NOUNS = [
  "willow",
  "harbor",
  "meadow",
  "falcon",
  "ember",
  "crane",
  "summit",
  "brook",
  "canyon",
  "ridge",
  "otter",
  "compass",
];

export interface SecureWordEntry {
  word: string;
  expiresAt: number;
  lastRequestAt: number;
}

// email -> issued secure word + timing metadata.
export const secureWordStore = new Map<string, SecureWordEntry>();

// email -> number of consecutive failed MFA attempts. Kept server-side
// (see verifyMfa/route.ts) because a client-side counter can be reset by
// simply refreshing the page, which would make the lockout meaningless.
export const mfaAttemptStore = new Map<string, number>();

const SECURE_WORD_TTL_MS = 60_000; // matches the 60s countdown shown in the UI
const SECURE_WORD_RATE_LIMIT_MS = 10_000; // anti-abuse: min gap between requests

export function generateSecureWord(email: string): SecureWordEntry {
  const now = Date.now();
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const word = `${adjective} ${noun}`;
  const entry: SecureWordEntry = {
    word,
    expiresAt: now + SECURE_WORD_TTL_MS,
    lastRequestAt: now,
  };
  secureWordStore.set(email, entry);
  return entry;
}

export function isRateLimited(email: string, now: number): boolean {
  const existing = secureWordStore.get(email);
  if (!existing) return false;
  return now - existing.lastRequestAt < SECURE_WORD_RATE_LIMIT_MS;
}

export const SECURE_WORD_TTL = SECURE_WORD_TTL_MS;
export const SECURE_WORD_RATE_LIMIT = SECURE_WORD_RATE_LIMIT_MS;
export const MAX_MFA_ATTEMPTS = 3;
