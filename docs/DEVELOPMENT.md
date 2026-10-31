# Development Guide

> **Quick Start**: Run `pnpm install` to install dependencies, then `pnpm dev` to start the Next.js dev server on http://localhost:3000.

## Daily Development Workflow

### 🚀 Starting Development

```bash
# Start development
pnpm dev        # Next.js dev server with hot reload (Turbopack)
pnpm test:watch # Test watch mode
```

### 🔍 Quick Quality Checks

```bash
# Fast check before committing
pnpm quick-check  # typecheck + lint + test

# Full verification (what CI runs; run before pushing)
pnpm precommit    # All quality gates including audit, format, linting and coverage
```

### 🧪 Testing

```bash
# Watch mode (development)
pnpm test:watch

# Single run
pnpm test

# With coverage (90% minimum threshold enforced)
pnpm test:coverage

# Coverage in browser
pnpm coverage:open
```

> **📊 Coverage Requirements**: This project enforces **90% minimum coverage** for lines, branches, functions, and statements. The CI pipeline will fail if coverage drops below this threshold.

### 🏗️ Building

```bash
# Production build (standalone output in .next/)
pnpm build

# Serve the production build locally
pnpm start
```

## Development Tools

### 📦 Available Scripts

Run `pnpm run help` to see all available scripts, or check these key commands:

| Command              | Description                    | What it runs                                  |
| -------------------- | ------------------------------ | --------------------------------------------- |
| `pnpm dev`           | Next.js dev server             | `next dev`                                    |
| `pnpm build`         | Production build               | `next build`                                  |
| `pnpm start`         | Serve production build         | `next start`                                  |
| `pnpm test`          | Run tests once                 | `vitest run`                                  |
| `pnpm test:watch`    | Test watch mode                | `vitest`                                      |
| `pnpm test:coverage` | Tests with coverage report     | `vitest run --coverage` (90% threshold)       |
| `pnpm typecheck`     | Type check only                | `tsc --noEmit`                                |
| `pnpm lint`          | Check linting                  | `eslint .`                                    |
| `pnpm format`        | Check formatting               | `prettier --check .`                          |
| `pnpm quick-check`   | Fast quality check             | typecheck + lint + test                       |
| `pnpm precommit`     | Full verification (same as CI) | audit + check:static + check:deps + tests + … |
| `pnpm check:static`  | Static gates                   | format + spelling + yaml + md + workflows + … |
| `pnpm check:deps`    | Dependency/structure gates     | circular + cruise + duplication + dead code   |
| `pnpm ci:local`      | Simulate full CI locally       | Complete CI pipeline simulation               |
| `pnpm run doctor`    | Check environment health       | Node/pnpm version check                       |

## IDE Setup

### VS Code (Recommended)

The project includes VS Code configuration in `.vscode/`:

- **Auto-formatting** on save
- **ESLint integration** with auto-fix
- **TypeScript strict mode**
- **Vitest integration**
- **Debugging configuration**

**Recommended Extensions** (auto-suggested):

- ESLint
- Prettier
- Vitest Explorer
- TypeScript Importer

### Debugging

The launch configurations in `.vscode/launch.json` follow the [Next.js debugging guide](https://nextjs.org/docs/app/guides/debugging):

- **Next.js: debug server-side** - Starts `pnpm dev` with the Node.js inspector attached
- **Next.js: debug client-side** - Opens Chrome against http://localhost:3000
- **Next.js: debug full stack** - Both of the above
- **Debug Tests** - Runs Vitest with `--inspect-brk`

Set breakpoints directly in `.ts`/`.tsx` files (source maps enabled).

## Code Quality

### Type Safety

This project uses **strict TypeScript** with additional safety features:

```typescript
// ✅ Good - explicit types
function processUser(user: User): Promise<UserResult> {
  return validateAndProcess(user);
}

// ❌ Avoid - implicit any
function processUser(user) {
  return user.something;
}
```

### Testing Philosophy

1. **Unit and component tests** (`.spec.ts`, `.spec.tsx`) - Test Route Handlers and components in isolation
2. **Property-based tests** (`.property.spec.ts`) - Test invariants with fast-check

**Test Templates Available:**

- `tests/templates/unit-test.template.ts` - Standard unit test structure
- `tests/templates/property-test.template.ts` - Property-based test patterns

### Documentation & Config Quality

- **Markdown linting** with markdownlint-cli2 ensures consistent documentation
- **YAML validation** with yamllint catches config file issues early
- **Version drift check** (`scripts/check-version-drift.sh`) keeps Node/pnpm/TypeScript versions in docs aligned with `package.json`, and fails on predecessor-layout names (the old source and build folders, the old verify script) in docs, config files, scripts, workflows and hooks
- Run `pnpm format:fix` to automatically fix markdown and YAML formatting issues
- `pnpm precommit` and CI enforce these standards; the pre-commit hook fixes formatting and Markdown/YAML lint on staged files

### Code Organization

```
app/
├── layout.tsx         # Root layout and metadata
├── page.tsx           # Home page (Server Component)
├── globals.css        # Global styles
├── api/
│   └── health/
│       └── route.ts   # Route Handler: GET /api/health
└── [your-routes]/     # Additional pages, layouts and API routes

tests/
├── *.spec.ts(x)      # Unit and component tests
├── *.property.spec.ts # Property-based tests
├── setup.ts          # Vitest setup (Testing Library matchers)
└── templates/        # Test templates to copy
```

Import project files with the `@/` alias (configured in `tsconfig.json`), for example `import { GET } from '@/app/api/health/route'`.

## Performance & Debugging

### Route Handler Timing

Wrap expensive work inside a Route Handler with `console.time` during development, or use the Next.js dev overlay to inspect server timings:

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  console.time('expensive-operation');
  const result = await expensiveOperation();
  console.timeEnd('expensive-operation');
  return NextResponse.json(result);
}
```

### HTTP Benchmarking

```bash
pnpm build && pnpm start &   # Serve the production build
pnpm perf:bench              # autocannon: 100 connections for 10 seconds against localhost:3000
```

### Bundle Size

```bash
pnpm build
pnpm size   # Checks .next output against .size-limit.json
```

## CI/CD Integration

### Local CI Simulation

Before pushing, run CI checks locally:

```bash
# Full CI simulation (slow, thorough)
pnpm ci:local

# Fast CI simulation (skip security scans)
pnpm ci:local:fast

# Quick commands
pnpm precommit    # Full verification
pnpm quick-check  # Fast quality check
```

### Quality Gates and Git Hooks

#### What Runs on Every Commit

The Husky `pre-commit` hook runs `lint-staged`: Prettier, ESLint, markdownlint and yamllint on the staged files only,
so commits take seconds. The `commit-msg` hook runs commitlint.

#### What Runs Before Pushing and in CI

The full gate list is defined once in the `check:*` scripts in `package.json`. `pnpm precommit` runs it serially; CI
(`.github/workflows/reusable-validate.yml`) runs the same scripts in parallel jobs on every pull request and push to
main. In `pnpm precommit` order:

1. **Security audit** (`pnpm audit --audit-level critical`)
2. **`pnpm check:static`**: format check, spelling, YAML, Markdown and workflow linting, version drift check
   (`scripts/check-version-drift.sh`), type check, ESLint
3. **`pnpm check:deps`**: circular dependencies, dependency-cruiser rules, duplication in `app/` and `tests/`, dead code
4. **Tests with coverage** (`pnpm test:coverage`)
5. **Changeset status** (`pnpm changeset:status`)

CI additionally builds the app and checks bundle size, scans for secrets with gitleaks, runs the OSV scanner and, when
Docker releases are enabled, scans the container image. `pnpm ci:local` reproduces that sequence locally.

See [AGENTS.md](../AGENTS.md#development-commands) for the rationale behind the order. To add a gate, add it to
`check:static` or `check:deps` so the hook docs, `pnpm precommit` and CI cannot drift apart.

#### Important: No Bypass Allowed

> **🔒 Security Feature**: This project blocks the `--no-verify` flag via an OpenCode permission rule, so the AI agent cannot skip the commit hooks with `git commit --no-verify`. Because CI runs the same gates as `pnpm precommit`, skipping the hook can never get unchecked code merged.

If you encounter issues:

```bash
# Fix formatting issues
pnpm format:fix

# Fix linting issues
pnpm lint:fix

# Run full verification to debug
pnpm precommit
```

## Troubleshooting

### Common Issues

**TypeScript errors after pulling changes:**

```bash
pnpm reset  # Clean .next + coverage, then reinstall dependencies
```

**Tests failing randomly:**

```bash
pnpm test:watch  # Check for shared state between tests
```

**Stale dev server output:**

```bash
pnpm clean && pnpm dev  # Clear the .next cache
```

**Memory issues during development:**

```bash
# Monitor memory usage
node --max-old-space-size=4096 ./node_modules/.bin/vitest
```

### Getting Help

1. **Check documentation**: All guides are in `docs/`
2. **Run diagnostics**: `pnpm run doctor` (plain `pnpm doctor` is a pnpm built-in)
3. **View available commands**: Check package.json scripts or this documentation
4. **Check CI logs**: Compare local vs CI behavior with `pnpm ci:local`

## Environment Variables

Next.js loads `.env.local` (gitignored) on top of `.env.development`, `.env.test` and `.env.production`. Copy `.env.local.example` to get started.

- `NEXT_PUBLIC_*` variables are inlined into the browser bundle. Never put secrets there.
- Everything else is available only on the server (Server Components, Route Handlers, Server Actions).

### Development

```bash
# .env.local (not committed)
NEXT_PUBLIC_APP_NAME=my-app
```

### Testing

Vitest runs with `NODE_ENV=test`. Set test-only values in `tests/setup.ts` or inside the test with `vi.stubEnv`.

### Production

Provide variables through your hosting platform or the container environment, for example `docker run -e NEXT_PUBLIC_APP_NAME=my-app ...`. `NEXT_PUBLIC_*` values are baked in at `pnpm build` time, so set them before building.

## Release Process

### Creating a Release

1. **Create a changeset** for your changes:

   ```bash
   pnpm changeset
   ```

2. **Merge to main** - This triggers the release workflow

3. **Automatic release** happens if changesets exist:
   - Version bumps based on changesets
   - CHANGELOG.md generation
   - Git tags creation
   - GitHub release creation
   - Optional: Docker publishing (if enabled)

### Required Secrets for Releases

| Secret               | Required    | Purpose                                                     |
| -------------------- | ----------- | ----------------------------------------------------------- |
| `RELEASE_TOKEN`      | Recommended | GitHub PAT with repo/workflow scopes for protected branches |
| `DOCKERHUB_USERNAME` | Optional    | Required for Docker Hub publishing                          |
| `DOCKERHUB_TOKEN`    | Optional    | Required for Docker Hub publishing                          |

### Repository Variables

| Variable                | Purpose                                           |
| ----------------------- | ------------------------------------------------- |
| `ENABLE_RELEASE`        | Set to `true` to enable versioning and releases   |
| `ENABLE_DOCKER_RELEASE` | Set to `true` to enable Docker builds and publish |

> **Note**: Without `RELEASE_TOKEN`, the workflow uses `GITHUB_TOKEN` but may fail on protected branches.

## Next Steps

After setting up development:

1. **Read the architecture**: `docs/architecture/decisions/*.md`
2. **Understand the process**: `docs/PROCESS.md`
3. **Set up monitoring**: `docs/OBSERVABILITY.md`
4. **Check troubleshooting**: `docs/TROUBLESHOOTING.md`

Happy coding! 🚀
