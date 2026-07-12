// @vitest-environment node
/*
 * app/api/verifyMfa/route.test.ts — verifies the server-side lockout after
 * 3 wrong attempts: the 4th attempt must be rejected as locked EVEN WHEN
 * it uses the correct code, since a client-side-only counter would be
 * defeated just by retrying (see verifyMfa/route.ts for the full
 * rationale).
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mfaAttemptStore } from "../_lib/mockStore";
import { POST } from "./route";

const EMAIL = "maker@dummybank.com";

function mfaRequest(code: string) {
  return new Request("http://localhost/api/verifyMfa", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, code }),
  });
}

describe("POST /api/verifyMfa — lockout after 3 failed attempts", () => {
  beforeEach(() => {
    mfaAttemptStore.clear();
  });

  it("locks the account after 3 wrong attempts and rejects a 4th attempt even with the correct code", async () => {
    for (let attempt = 0; attempt < 3; attempt++) {
      const response = await POST(mfaRequest("000000"));
      const isThirdAttempt = attempt === 2;
      expect(response.status).toBe(isThirdAttempt ? 423 : 401);
    }

    const fourthAttempt = await POST(mfaRequest("473829")); // the actually-correct code
    const body = await fourthAttempt.json();
    expect(fourthAttempt.status).toBe(423);
    expect(body.locked).toBe(true);
  });

  it("accepts the correct code and reports verified when there is no prior lockout", async () => {
    const response = await POST(mfaRequest("473829"));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.verified).toBe(true);
  });

  it("clears the attempt counter on success, so a later login isn't closer to lockout", async () => {
    await POST(mfaRequest("000000")); // 1 wrong attempt
    await POST(mfaRequest("473829")); // then succeed
    expect(mfaAttemptStore.has(EMAIL)).toBe(false);
  });
});
