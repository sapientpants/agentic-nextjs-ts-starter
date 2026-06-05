---
---

chore(ci): upgrade to Node 24 and bump deprecated GitHub Actions

Resolve the Node.js 20 deprecation warnings in CI by upgrading the actions that
still ran on the Node 20 runtime to their first Node 24 major release:

- actions/checkout v4 → v5
- actions/setup-node v4 → v5
- actions/upload-artifact v4 → v6
- actions/download-artifact v4 → v7
- pnpm/action-setup v4 → v5
- github/codeql-action/\* v3 → v4

Also bump the project's Node.js baseline from 22 to 24 across `mise.toml`,
`package.json` (`engines.node` → `>=24.0.0`), the `Dockerfile` base images,
all workflow `node-version` pins / reusable-workflow defaults, and the docs.

Verified locally on Node 24.16.0: typecheck, lint, format, build, and tests
(100% coverage) all pass; actionlint is clean.

Note: this change does not touch the `update-metrics` job's `RELEASE_TOKEN`
auth, which is a separate repository-secret configuration issue.
