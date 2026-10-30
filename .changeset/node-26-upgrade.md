---
'agentic-nextjs-ts-starter': patch
---

chore: upgrade runtime to Node.js 26

Bumps the pinned Node.js version from 24 to 26 everywhere it is declared:
`mise.toml`, `package.json` (`engines.node` → `>=26.0.0`), the `Dockerfile`
base images (`node:26-alpine`), all GitHub workflow `node-version` pins and
reusable-workflow defaults, `quality-metrics.json`, and the docs.

Verified locally on Node 26.13.0: install, typecheck, lint, format, yaml and
workflow lint, build, and tests with 100% coverage all pass.
