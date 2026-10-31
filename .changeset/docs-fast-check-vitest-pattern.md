---
'agentic-nextjs-ts-starter': patch
---

docs: standardize property testing on `@fast-check/vitest`

- AGENTS.md, `docs/TESTING.md` and `docs/PATTERNS.md` now import `it` from `@fast-check/vitest` in every `it.prop` snippet (the `it` from `vitest` has no `.prop`); the raw `fc.assert(fc.property(...))` example in `docs/TESTING.md` is rewritten with `it.prop`
- the unused direct `fast-check` devDependency is removed (`@fast-check/vitest` brings it in) along with its `knip.json` ignore entry
- AGENTS.md "Key Patterns" numbering no longer skips from 1 to 3

Closes #59
