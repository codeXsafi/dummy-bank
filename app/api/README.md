# app/api/

This folder holds the mock backend for the app, implemented as Next.js Route
Handlers (`route.ts` files) rather than a separate server.

- No real database — each endpoint keeps its state in an in-memory `Map`
  that lives for the lifetime of the dev/prod server process. Restarting the
  server clears all state (rate limits, MFA attempt counters, issued secure
  words).
- Endpoints implemented here (see Phase 2 in `docs/WALKTHROUGH.md` for the
  full contract of each):
  - `POST /api/getSecureWord`
  - `POST /api/login`
  - `POST /api/verifyMfa`
  - `GET /api/transaction-history`

This is intentionally a stand-in for a real backend so the frontend has
something realistic to integrate against — it is not meant to demonstrate
production backend architecture (no persistence, no real auth tokens, no
database).
