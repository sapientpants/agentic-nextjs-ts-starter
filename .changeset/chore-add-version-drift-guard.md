---
'agentic-nextjs-ts-starter': patch
---

chore: add version-drift guard to precommit

- Added scripts/check-version-drift.sh to scan docs/configs for pnpm/Node/TS version strings and diff against package.json (packageManager, engines, typescript dep)
- Wired script into precommit after pnpm lint:workflows
