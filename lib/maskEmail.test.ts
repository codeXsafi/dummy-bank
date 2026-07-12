import { describe, expect, it } from "vitest";
import { maskEmail } from "./maskEmail";

describe("maskEmail", () => {
  it("masks the middle of the local-part, keeping first and last char", () => {
    expect(maskEmail("maker@dummybank.com")).toBe("m***r@dummybank.com");
  });

  it("keeps the domain untouched", () => {
    expect(maskEmail("viewer@dummybank.com")).toBe("v****r@dummybank.com");
  });

  it("returns short local-parts unchanged rather than over-masking", () => {
    expect(maskEmail("ab@dummybank.com")).toBe("ab@dummybank.com");
  });

  it("returns the input unchanged if it isn't a well-formed email", () => {
    expect(maskEmail("not-an-email")).toBe("not-an-email");
  });
});
