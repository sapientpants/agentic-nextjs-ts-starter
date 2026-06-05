---
---

chore: update all dependencies to latest versions (2026-06)

Updated production and dev dependencies to their latest releases, including
several major version bumps:

- TypeScript 5.9 → 6.0
- ESLint 9 → 10
- Vite 7 → 8, Vitest 4.0 → 4.1
- jsdom 27 → 29
- Knip 5 → 6
- Next.js / eslint-config-next 16.0 → 16.2, React/React-DOM 19.2.0 → 19.2.7
- Various ESLint plugins (unicorn, sonarjs, security, n, regexp, jsdoc, jsonc), commitlint,
  lint-staged, npm-check-updates, size-limit, cdxgen, and more.

Required code changes:

- `eslint.config.js`: `jsonc-eslint-parser` v3 switched to named exports — updated to a
  namespace import.
- `.prettierignore`: ignore Next.js-generated `next-env.d.ts` and `.next/` (regenerated on build).
- `knip.json`: bumped schema to v6 and removed a now-unnecessary `ignoreDependencies` entry.

All quality checks pass (typecheck, lint, format, tests at 100% coverage, build,
circular/dead-code/duplication). Remaining `pnpm audit` findings are non-critical and
confined to deep transitive dev-dependencies.
