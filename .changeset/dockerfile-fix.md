---
'agentic-nextjs-ts-starter': patch
---

fix(Dockerfile): corepack + copy complete @swc/helpers to production

Fixes two Docker build/runtime issues:

1. **Corepack version mismatch (L5)**: Replaced hardcoded
   `corepack prepare pnpm@10.22.0 --activate` with `corepack enable`, which
   reads the exact pnpm version from `package.json`'s `packageManager` field.

2. **Missing `@swc/helpers/esm/` files (L42-45)**: Added a
   `COPY --from=builder` to copy the complete `@swc/helpers` (including
   `esm/` directory) from the builder's pnpm store into the production image.
   Next.js's nft file tracer silently drops ESM subpaths in pnpm's isolated
   node_modules layout, causing a runtime `MODULE_NOT_FOUND` crash.
