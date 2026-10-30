---
'agentic-nextjs-ts-starter': patch
---

fix: extract the default app name into `app/lib/app-config.ts` and make jscpd match its docs

- `getAppName()` is now the single source of the `NEXT_PUBLIC_APP_NAME` fallback, used by both the home page and the health route
- `.jscpd.json` threshold raised from 0% to the documented 2%, and `tsx` files are now scanned (`app/page.tsx` was previously skipped)
- New `pnpm duplication:tests` script scans `tests/` with a looser 5% threshold; runs in `pnpm precommit` and CI
