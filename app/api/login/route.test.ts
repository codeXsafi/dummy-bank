// @vitest-environment node
/*
 * app/api/login/route.test.ts — verifies the server rejects a secure word
 * once its 60s expiry has passed, even when the word value and password
 * are both otherwise correct. This is the anti-phishing-window guarantee
 * described in getSecureWord/route.ts: an attacker who captured a word has
 * a shrinking, not permanent, window to use it.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { EXPECTED_PASSWORD_HASH, secureWordStore } from "../_lib/mockStore";
import { POST } from "./route";

const EMAIL = "maker@dummybank.com";

function loginRequest(body: unknown) {
  return new Request("http://localhost/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/login — secure word expiry", () => {
  beforeEach(() => {
    secureWordStore.clear();
  });

  it("rejects a secure word that has expired, even with the correct word and password", async () => {
    secureWordStore.set(EMAIL, {
      word: "granite",
      expiresAt: Date.now() - 1, // already expired
      lastRequestAt: Date.now() - 61_000,
    });

    const response = await POST(
      loginRequest({ email: EMAIL, secureWord: "granite", hashedPassword: EXPECTED_PASSWORD_HASH })
    );

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toMatch(/expired/i);
  });

  it("accepts a secure word that has not yet expired", async () => {
    secureWordStore.set(EMAIL, {
      word: "granite",
      expiresAt: Date.now() + 60_000,
      lastRequestAt: Date.now(),
    });

    const response = await POST(
      loginRequest({ email: EMAIL, secureWord: "granite", hashedPassword: EXPECTED_PASSWORD_HASH })
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.role).toBe("maker");
  });
});
