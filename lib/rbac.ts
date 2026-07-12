/*
 * lib/rbac.ts — the one decision the role-based route redirect makes,
 * pulled out as a pure function so it's testable without rendering the
 * layout or mocking Next's router (see Phase 6 tests).
 *
 * IMPORTANT: this function only decides what the UI shows. It is NOT a
 * security boundary — see the usage site in app/(dashboard)/layout.tsx for
 * why a real backend must reject the underlying API calls independently.
 */
import { Role } from "./store";

export function viewerBlockedFromTransactions(
  role: Role | null,
  pathname: string
): boolean {
  return role === "viewer" && pathname === "/transactions";
}
