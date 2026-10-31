---
'agentic-nextjs-ts-starter': patch
---

chore: extend the stale-layout scan to config files and drop the last `dist/` ignore entries

- `scripts/check-version-drift.sh` now checks every top-level file, `scripts/`, `.github/`, `.husky/` and `.opencode/` for predecessor Node starter references (`src/`, `dist/`, `pnpm verify`, old project name), not just the docs, so tool configs such as the removed `api-extractor.json` cannot point at a layout that no longer exists
- Remove the vestigial `dist/` ignore entries from `.prettierignore`, `.markdownlintignore`, `.yamllintignore`, `.yaml-lint.yml`, `cspell.json` and `eslint.config.js`; Next.js builds to `.next/` and never produces `dist/`
- Closes #65
