---
'agentic-nextjs-ts-starter': patch
---

chore: update dependencies (October 2026)

**Production:** react / react-dom 19.3.0 → 19.3.1.

**Tooling majors:**

- pnpm 10.34.5 → 12.16.1. pnpm ≥ 11 no longer reads the `pnpm` field in
  `package.json` nor non-auth settings from `.npmrc`, so the security
  `overrides`, `engineStrict` and `saveExact` moved to `pnpm-workspace.yaml`.
  `ignoredBuiltDependencies` was replaced by `allowBuilds` (esbuild and
  unrs-resolver explicitly denied, as before). The Dockerfile now copies
  `pnpm-workspace.yaml` so the overrides apply inside the image. Version pins
  updated in mise.toml, CI workflows, README and docs.
- eslint-plugin-unicorn 76 → 79 (no rule changes required).

**Held back:** TypeScript stays on ^6.0.3. typescript-eslint 8.72 refuses to
load under TypeScript 7.0; revisit once typescript-eslint ships TS ≥ 7.1
support (typescript-eslint/typescript-eslint#10940).

**Minor/patch:** eslint, @typescript-eslint/*, knip, cspell, dependency-cruiser,
Stryker 10.1, api-extractor, size-limit, jsdom, prettier, and others.
