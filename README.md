# Agentic Next.js + TypeScript Starter

## 📊 Build Status & Quality Metrics

### CI/CD Workflows

[![Main](https://github.com/sapientpants/agentic-nextjs-ts-starter/actions/workflows/main.yml/badge.svg)](https://github.com/sapientpants/agentic-nextjs-ts-starter/actions/workflows/main.yml)
[![PR](https://github.com/sapientpants/agentic-nextjs-ts-starter/actions/workflows/pr.yml/badge.svg)](https://github.com/sapientpants/agentic-nextjs-ts-starter/actions/workflows/pr.yml)
[![CodeQL](https://github.com/sapientpants/agentic-nextjs-ts-starter/actions/workflows/codeql.yml/badge.svg)](https://github.com/sapientpants/agentic-nextjs-ts-starter/actions/workflows/codeql.yml)

### Test Coverage & Quality

[![Lines Coverage](<https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsapientpants%2Fagentic-nextjs-ts-starter%2Fmain%2Fquality-metrics.json&query=%24.coverage.lines&suffix=%25&label=Coverage%20(Lines)&color=brightgreen>)](https://github.com/sapientpants/agentic-nextjs-ts-starter/actions)
[![Branches Coverage](<https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsapientpants%2Fagentic-nextjs-ts-starter%2Fmain%2Fquality-metrics.json&query=%24.coverage.branches&suffix=%25&label=Coverage%20(Branches)&color=brightgreen>)](https://github.com/sapientpants/agentic-nextjs-ts-starter/actions)
[![Functions Coverage](<https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsapientpants%2Fagentic-nextjs-ts-starter%2Fmain%2Fquality-metrics.json&query=%24.coverage.functions&suffix=%25&label=Coverage%20(Functions)&color=brightgreen>)](https://github.com/sapientpants/agentic-nextjs-ts-starter/actions)

### Code Quality Metrics

[![Code Duplication](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsapientpants%2Fagentic-nextjs-ts-starter%2Fmain%2Fquality-metrics.json&query=%24.duplication.percentage&suffix=%25&label=Duplication&color=brightgreen)](https://github.com/sapientpants/agentic-nextjs-ts-starter/actions)
[![Mutation Score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsapientpants%2Fagentic-nextjs-ts-starter%2Fmain%2Fquality-metrics.json&query=%24.mutation.score&suffix=%25&label=Mutation%20Score)](https://github.com/sapientpants/agentic-nextjs-ts-starter/actions)

### Meta

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsapientpants%2Fagentic-nextjs-ts-starter%2Fmain%2Fquality-metrics.json&query=%24.nodeVersion&label=Node.js&color=339933&logo=node.js)](https://nodejs.org)
[![Package Manager](https://img.shields.io/badge/pnpm-12.16.1-orange.svg?logo=pnpm)](https://pnpm.io)
[![Version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsapientpants%2Fagentic-nextjs-ts-starter%2Fmain%2Fquality-metrics.json&query=%24.version&label=Version)](https://github.com/sapientpants/agentic-nextjs-ts-starter/releases)

A **batteries-included** Next.js + TypeScript starter template with comprehensive testing, code quality automation, and security scanning. Built for modern Next.js development with AI-assisted (agentic) coding workflow.

> **Note:** This template includes example code to demonstrate its capabilities. These example files are clearly marked with header comments and should be removed when starting your project. See [Getting Started](./docs/GETTING_STARTED.md#clean-up-example-code) for details.

## 🤔 What is Agentic Development?

**"Agentic" in this context refers to AI-assisted development workflow**, not AI agent runtime. This template is designed to work seamlessly with AI development tools like [OpenCode](https://opencode.ai) to enhance your productivity through:

- 🤖 **AI-powered code generation** - Let AI assistants help write boilerplate and tests
- 🔄 **Automated refactoring** - AI tools can safely refactor with comprehensive test coverage
- 📝 **Documentation assistance** - AI can help maintain docs in sync with code
- 🎯 **Issue-to-implementation workflows** - Custom commands for AI-driven development

> **Important:** This is a template repository for starting new projects. No AI agents or chatbots are included - the "agentic" aspect comes from using AI development tools (like OpenCode) to assist you in building your application faster and with higher quality.

## 🛠️ Tech Stack

**Core:** Next.js 16 (App Router) • React 19 • Node.js 26+ • TypeScript ^6.0.3 (strict) • pnpm 12.16.1  
**Testing:** Vitest • React Testing Library • fast-check (property testing) • 90% coverage minimum  
**Quality:** ESLint 10 • Prettier • Husky • Commitlint  
**Security:** CodeQL • OSV Scanner • SBOM • SLSA attestations  
**CI/CD:** GitHub Actions • Changesets • Automated releases

## 📖 Documentation

**[Full Documentation →](./docs/README.md)**

- **[Getting Started](./docs/GETTING_STARTED.md)** - Setup and installation
- **[Development](./docs/DEVELOPMENT.md)** - Workflows and commands
- **[Testing](./docs/TESTING.md)** - Test patterns and coverage
- **[Docker](./docs/DOCKER.md)** - Docker configuration and healthchecks
- **[Patterns](./docs/PATTERNS.md)** - Copy-paste code examples
- **[Troubleshooting](./docs/TROUBLESHOOTING.md)** - Common issues

## 🚀 Quick Start

```bash
# Clone and setup
git clone https://github.com/sapientpants/agentic-nextjs-ts-starter.git my-project
cd my-project

# Install dependencies (requires Node.js 26+ and pnpm 12.16.1)
pnpm install

# Set up environment variables (optional, defaults work out of the box)
cp .env.local.example .env.local

# Verify everything works
pnpm test
pnpm precommit  # Full quality check (same as the pre-commit hook)

# Start developing
pnpm dev        # Next.js dev server on http://localhost:3000
```

**Prerequisites:** Node.js 26+, pnpm 12.16.1, GitHub repo (for CI/CD)  
**Full setup guide:** [docs/GETTING_STARTED.md](./docs/GETTING_STARTED.md)

## 📚 Key Commands

```bash
# Development
pnpm dev          # Next.js dev server (http://localhost:3000)
pnpm build        # Production build to .next/ (standalone output)
pnpm start        # Serve the production build
pnpm precommit    # Run all quality checks (what the pre-commit hook runs)
pnpm quick-check  # Fast check: typecheck + lint + test

# Testing (90% coverage required)
pnpm test         # Run tests
pnpm test:watch   # Watch mode
pnpm test:coverage # With coverage report

# Quality
pnpm lint         # Check linting
pnpm lint:fix     # Fix linting issues
pnpm format       # Check formatting
pnpm format:fix   # Fix formatting
pnpm typecheck    # Type check only

# Releases
pnpm changeset    # Create changeset
pnpm sbom         # Generate SBOM
```

**Full command reference:** [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md)

## 📊 Code Quality Dashboard

Quality metrics are collected automatically on every push to `main` and published through the badges at the top of this README. The source of truth is `quality-metrics.json`, which the `update-metrics` job in `.github/workflows/main.yml` commits after validation completes. Run `pnpm metrics:update` to refresh it locally.

### Tools & Analyzers Used

- **Coverage:** Vitest with V8 coverage provider (`pnpm test:coverage`)
- **Mutation Testing:** Stryker Mutator (`pnpm mutation-test`, weekly in CI)
- **Duplication:** jscpd (`pnpm duplication`)
- **Complexity:** ESLint with complexity rules (`pnpm lint`)
- **Circular Deps:** madge (`pnpm deps:circular`) + dependency-cruiser (`pnpm deps:cruise`)
- **Dead Code:** Knip (`pnpm dead-code`) + ts-prune (`pnpm ts-prune`)
- **Security:** pnpm audit, OSV Scanner, CodeQL, Trivy (`pnpm scan:container`)
- **Type Safety:** TypeScript strict mode + type-aware ESLint rules (`pnpm typecheck`)

## 🎯 Quality Standards

This project enforces strict quality standards to ensure maintainability, security, and reliability:

### Why These Standards?

**90% Coverage Minimum** - Ensures comprehensive test coverage without requiring 100% (which can lead to diminishing returns)

**Low Complexity Limits** - Functions with cyclomatic complexity >10 are harder to understand, test, and maintain

**Zero Duplication Target** - DRY principle reduces maintenance burden and bugs

**No Circular Dependencies** - Prevents tight coupling and enables better modularity

**No Dead Code** - Keeps codebase lean and maintainable

**Zero Critical/High Vulnerabilities** - Security-first approach protects users and infrastructure

### Complexity Rationale

| Limit                     | Rationale                                                         |
| ------------------------- | ----------------------------------------------------------------- |
| Cyclomatic Complexity ≤10 | Industry standard for maintainable code (NIST, IEEE)              |
| Max 50 Lines/Function     | Single screen view improves comprehension                         |
| Max 4 Parameters          | Reduces cognitive load, encourages better abstractions            |
| Max 3 Nesting Depth       | Prevents deeply nested code that's hard to reason about           |
| Max 15 Statements         | Forces function decomposition, improves testability               |
| Code Duplication <2%      | Minimal threshold allowing for small necessary repetition         |
| Mutation Score ≥90%       | Ensures tests actually verify behavior, not just achieve coverage |

### Test File Exceptions

Test files (`tests/**/*.ts`) have relaxed limits:

- Cyclomatic complexity: ≤15 (vs 10)
- Max lines per function: ≤600 (vs 50) - allows large describe blocks with many test cases

### Pre-commit Quality Gates

The `pnpm precommit` command runs checks in optimized order for fast feedback:

1. **Security** (`pnpm audit`) - Blocks commits with critical vulnerabilities
2. **Formatting** (`pnpm format`) - Fast, easy to fix
3. **YAML/Markdown Linting** - Fast file validation
4. **Workflow Validation** - Prevents broken GitHub Actions
5. **Type Checking** (`pnpm typecheck`) - Required for type-aware lint rules
6. **Linting** (`pnpm lint`) - Comprehensive quality checks
7. **Structural Analysis** - Circular deps, duplication, dead code
8. **Tests with Coverage** (`pnpm test:coverage`) - Slowest check runs last

**Mutation testing** is excluded from pre-commit due to performance - run it periodically (weekly/monthly).

## 🤖 OpenCode Integration

This project includes special configurations for [OpenCode](https://opencode.ai):

### Custom Commands

- `/spec-feature` - Create a feature specification in Gherkin format as a GitHub issue
- `/implement-github-issue` - Implement a GitHub issue with full workflow
- `/update-dependencies` - Update all dependencies to latest versions with PR workflow

### Verification Guardrails

- Blocks `git --no-verify` so the AI agent can't skip quality checks
- Husky pre-commit hooks run the full verification suite

See [AGENTS.md](./AGENTS.md) for detailed OpenCode guidance.

## 📁 Project Structure

```
.
├── .opencode/         # OpenCode configurations
│   └── commands/      # Custom slash commands
├── .github/           # GitHub Actions workflows
├── app/               # Next.js App Router (pages, layouts, API routes)
│   ├── api/health/    # Example Route Handler: GET /api/health
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Home page
├── docs/              # Documentation
├── tests/             # Test files
│   ├── *.spec.ts(x)   # Unit and component tests
│   └── *.property.spec.ts # Property-based tests
├── .next/             # Build output (gitignored)
├── mise.toml          # Tool version management
├── next.config.ts     # Next.js configuration (standalone output, typed routes)
├── package.json       # Dependencies and scripts
└── tsconfig.json      # TypeScript configuration
```

## 🔄 Features

### Framework & Configuration

- ⚡ **Next.js 16 App Router** with React 19 Server Components and typed routes
- 🔌 **Route Handlers** for backend endpoints (example: `GET /api/health`)
- 🔐 **Environment variables** via `.env.local`; only `NEXT_PUBLIC_*` values reach the browser
- 🐳 **Standalone build output** ready for the included Dockerfile

### Testing & Quality

- ✅ **Vitest** + React Testing Library with property-based testing (fast-check)
- ✅ **90% coverage minimum** enforced
- ✅ **Strict TypeScript** with type-aware linting
- ✅ **Pre-commit hooks** with Husky & lint-staged
- ✅ **Markdown and YAML linting** for docs/config consistency

### Security & Supply Chain

- 🔒 **CodeQL** static analysis
- 🔒 **OSV Scanner** for dependencies
- 🔒 **SBOM generation** (CycloneDX)
- 🔒 **SLSA attestations** for artifacts

### Automation

- 🚀 **GitHub Actions** CI/CD pipeline
- 🚀 **Changesets** for versioning
- 🚀 **Automated releases** with changelog
- 🚀 **OpenCode** integration

## ⚙️ Required Setup

### GitHub Repository Settings

**Actions permissions** (Settings → Actions → General):

- ✅ Read and write permissions
- ✅ Allow GitHub Actions to create and approve pull requests

**Auto-merge** (Settings → General → Pull Requests):

- ✅ Allow auto-merge
- ✅ Automatically delete head branches

**For automated releases**, add secrets:

- `RELEASE_TOKEN` - GitHub PAT with repo/workflow scopes (triggers publish workflow)
- `NPM_TOKEN` - For npm publishing (optional)

## 📦 Release Distribution Setup

### NPM Publishing

To enable npm publishing:

1. Add `NPM_TOKEN` secret in repository settings
2. Remove `"private": true` from package.json
3. Use a scoped package name: `@yourorg/package-name`

### Docker Publishing

> **Note**: The Dockerfile builds the Next.js standalone output and includes a healthcheck that polls `GET /api/health` on port 3000. See the [Docker Configuration Guide](./docs/DOCKER.md) if you rename the endpoint or change the port.

To enable Docker builds:

1. Set repository variable `ENABLE_DOCKER_RELEASE` to `true`
2. Add secrets for Docker Hub (optional):
   - `DOCKERHUB_USERNAME`
   - `DOCKERHUB_TOKEN`
3. Images are automatically pushed to GitHub Container Registry

## 🔒 Security Features

- **Dependency Auditing**: Critical vulnerability checks on every CI run
- **SBOM Generation**: CycloneDX format for supply chain transparency
- **CodeQL Analysis**: Static security analysis
- **OSV Scanning**: Open Source Vulnerability detection
- **SLSA Provenance**: Build attestations
- **Container Attestations**: SBOM and provenance for Docker images

## 📚 Additional Resources

- [Contributing Guide](./CONTRIBUTING.md) - How to contribute to this project
- [Development Process](./docs/PROCESS.md) - End-to-end workflow and checklists
- [Architecture Decisions](./docs/architecture/decisions/) - ADR records

## 📄 License

This is a template repository. Feel free to use it for your projects.
