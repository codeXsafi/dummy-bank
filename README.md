# Dummy Bank

A secure banking web app assessment build: multi-step login (email →
secure word → hashed password → MFA), role-based route guards, an idle
session timeout, and a responsive transaction dashboard.

## Setup

```bash
git clone <this-repo>
cd dummy-bank
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects
straight to `/login`.

### Demo credentials

| Field       | Value                                                                        |
| ----------- | ---------------------------------------------------------------------------- |
| Email       | `maker@dummybank.com` (role: maker) or `viewer@dummybank.com` (role: viewer) |
| Password    | `password123`                                                                |
| Secure word | shown on screen — read it, don't type it                                     |
| MFA code    | `123456`                                                                     |

The "maker" role can see `/transactions`; the "viewer" role is redirected
away from it.

## Other scripts

```bash
npm run build   # production build
npm run lint     # eslint
npm test         # vitest — 25 tests over the security-critical logic
npm run test:watch
```
