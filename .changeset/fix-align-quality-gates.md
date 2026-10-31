---
'agentic-nextjs-ts-starter': patch
---

fix: make the pre-commit hook, CI and docs agree on one quality-gate list (#58)

- `package.json` now defines the gates once as `check:static` and `check:deps`; `pnpm precommit` runs them serially and CI (`reusable-validate.yml`) runs the same scripts in parallel jobs, so `deps:cruise`, `dead-code`, `lint:spelling`, `lint:yaml`, `lint:markdown` and the version-drift check are now enforced on every PR
- The Husky `pre-commit` hook runs `lint-staged` only (fast); the full suite is `pnpm precommit` before pushing, and CI
- CI installs a pinned actionlint (1.7.12) and a pinned gitleaks (8.30.1) release with SHA-256 verification instead of `curl | bash` from `main`; `scripts/actionlint.sh` fails instead of silently skipping when actionlint is missing in CI
- Secret scanning (`pnpm scan:secrets`) now runs in CI in `reusable-security.yml`; `scripts/scan-secrets.sh` uses the
  `gitleaks git` command, neutralizes user-level `color.ui = always` (which made gitleaks silently scan 0 commits), fails
  when nothing was scanned, and redacts secrets in logs. `.gitleaks.toml` moves to the `[[allowlists]]` syntax and
  allowlists Next.js build output that was committed once in history plus placeholder tokens from deleted examples
- `tests/**` is linted with the same plugin set as `app/**` (only the complexity limits are relaxed); the property-test template now uses `it.prop` from `@fast-check/vitest`
- `scripts/ci-local.sh`, AGENTS.md, README, CONTRIBUTING, docs/DEVELOPMENT.md, docs/TROUBLESHOOTING.md, docs/PROCESS.md and .github/WORKFLOWS.md describe the single gate list
