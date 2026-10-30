---
'agentic-nextjs-ts-starter': patch
---

chore: remove vestigial library-publishing tooling inherited from the Node starter

- Drop TypeDoc, API Extractor, publint, arethetypeswrong and ts-prune (devDependencies, scripts, `typedoc.json`, `api-extractor.json`); Knip already covers dead code, so `pnpm precommit` no longer runs ts-prune
- Delete `tsconfig.build.json`, the stale committed `build-manifest.json` and the placeholder `.npmrc`
- Remove the npm and GitHub Packages publishing jobs from `main.yml` and `publish.yml`; the release workflow no longer globs or uploads a `dist/` directory and attaches only the SBOM to the GitHub release
- Drop the unused `**/logger.ts` barrel-file exemption from the ESLint config
- Update AGENTS.md, README and the docs to match. Closes #55
