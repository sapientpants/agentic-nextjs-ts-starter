---
'agentic-nextjs-ts-starter': patch
---

fix: version drift checker now catches prose references and scans README, CONTRIBUTING, scripts/, .github/ and app/

- `scripts/check-version-drift.sh` matches `pnpm 10`, `Node.js 22+`, `node-version: 24`, mise.toml pins and `coverage below 80%` style prose, not just `pnpm@X.Y.Z` / `node@X`
- Coverage threshold is read from `vitest.config.ts` so docs cannot drift from it
- Homepage renders Next.js, React, TypeScript, Node and pnpm versions from `package.json` instead of hardcoding them
- Workflow comments now state the real 90% coverage threshold; metrics extractor no longer falls back to a stale Node version
