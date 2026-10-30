---
'agentic-nextjs-ts-starter': patch
---

test: make tests independent and non-brittle — compare the health route version against `package.json`, stub env vars with `vi.stubEnv`, enable `restoreMocks`/`unstubEnvs` in Vitest, use a distinct `NEXT_PUBLIC_APP_NAME` in test setup, and export `HealthCheckResponse` from the route instead of duplicating it
