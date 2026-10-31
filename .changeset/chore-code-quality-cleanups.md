---
'agentic-nextjs-ts-starter': patch
---

chore: small code quality cleanups from the 2026-10-30 review (#60)

- **Dockerfile**: the `@swc/helpers` workaround no longer hardcodes a pnpm store path; the builder stage copies whichever version is installed into the standalone output, and the comment documents the upstream report and the condition for removing it
- **Dockerfile**: Node.js 25+ images no longer bundle Corepack, so `corepack enable` failed with "command not found" on `node:26-alpine`; the builder stage now installs a pinned Corepack first
- **Stryker**: `page.tsx` and `layout.tsx` are now mutated (`app/**/*.{ts,tsx}`)
- **README**: the mutation badge reads a new `mutation.display` field (`N/A` until the weekly job produces a score) instead of rendering `null%`
- **Coverage**: `app/layout.tsx` is no longer excluded; `tests/layout.spec.tsx` covers it
- **package.json**: every dependency is an exact pin (`saveExact` was already set), `coverage:report` (a duplicate of `test:coverage`) is removed, `deps:update:latest` sits with its siblings, and `doctor`/`help` moved from inline `node -e` one-liners to `scripts/doctor.js` and `scripts/help.js` (use `pnpm run doctor` / `pnpm run help`; the bare forms are pnpm built-ins)
- **eslint.config.js**: `Linter.FlatConfig[]` replaced by `Linter.Config[]`
- **eslint.config.js**: JSDoc rules now use the `flat/recommended-typescript` preset (types come from the TypeScript signatures), and the redundant `{Type}` annotations in `app/lib` and tests are removed
- **Health route**: reads `package.json` through a JSON import instead of `createRequire`, and the JSDoc no longer repeats the TypeScript return type
- **cspell.json**: `vercel` allow-listed for the upstream issue link in the Dockerfile comment
- **docs**: references to the removed script updated; `docs/TESTING.md` title fixed
