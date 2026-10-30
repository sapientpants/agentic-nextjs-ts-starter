# Contributing to Agentic Next.js + TypeScript Starter

Thank you for your interest in contributing! This guide will help you get started with contributing to this project.

## 📋 Prerequisites

- Node.js 26+ (managed via [mise](https://mise.jdx.dev/))
- pnpm 12.16.1 (managed via mise)
- Git

## 🚀 Getting Started

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/agentic-nextjs-ts-starter.git
   cd agentic-nextjs-ts-starter
   ```

2. **Install tools via mise**

   ```bash
   mise install
   ```

3. **Install dependencies**

   ```bash
   pnpm install
   ```

4. **Run tests to verify setup**

   ```bash
   pnpm test
   ```

5. **Start the dev server**

   ```bash
   pnpm dev   # http://localhost:3000
   ```

## 🔄 Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/your-fix-name
```

Branch names are validated: `<type>/<description>` where type is one of `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `revert`.

### 2. Make Your Changes

- Write your code following the existing patterns in `app/`
- Add tests for new functionality in `tests/`
- Update documentation as needed

### 3. Where Code Lives

- **Pages and layouts**: `app/**/page.tsx`, `app/**/layout.tsx` (Server Components by default)
- **API endpoints**: `app/api/**/route.ts` (Route Handlers)
- **Shared logic**: colocate under `app/` or add a top-level folder such as `lib/` and import it with the `@/` alias

Validate everything that crosses a trust boundary (request bodies, search params, environment variables) at the edge, inside the Route Handler or Server Action. See [docs/PATTERNS.md](./docs/PATTERNS.md) for copy-paste examples.

### 4. Run Quality Checks

Before committing, you can manually run all checks:

```bash
pnpm quick-check  # Fast: typecheck + lint + test
pnpm precommit    # Everything the pre-commit hook runs
```

Note: The pre-commit hook runs `pnpm precommit` automatically when you commit.

Individual checks:

- `pnpm typecheck` - Type checking
- `pnpm lint` - ESLint
- `pnpm format` - Prettier formatting check
- `pnpm test:coverage` - Run tests with coverage (90% minimum)

### 5. Add a Changeset

**Required:** Every PR must include a changeset. The CI will fail without one.

```bash
pnpm changeset
```

This will prompt you to:

1. Select the type of change (patch/minor/major)
2. Provide a description of the change

The changeset will be used to:

- Generate changelog entries
- Determine version bumps
- Create release notes

#### Types of Changes

- **patch**: Bug fixes, documentation updates, internal changes
- **minor**: New features, non-breaking improvements
- **major**: Breaking changes

#### When NOT to Add a Changeset

For changes that don't affect users (like CI updates, tests, internal refactoring):

```bash
pnpm changeset --empty
```

### 6. Commit Your Changes

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Test additions or changes
- `chore:` Maintenance tasks
- `perf:` Performance improvements

Example:

```bash
git add .
git commit -m "feat: add new validation for user input"
```

Pre-commit hooks will automatically run `pnpm precommit`, which includes:

- Security audit
- Formatting, spelling, YAML, Markdown and workflow linting
- Documentation version-drift check
- Type checking and ESLint
- Circular dependency, duplication and dead-code analysis
- All tests with coverage
- Changeset validation

The `commit-msg` hook validates the commit message format with commitlint.

Note: `pnpm precommit` executes ALL quality checks. This ensures code quality but may take longer than typical pre-commit hooks.

### 7. Push and Create a Pull Request

```bash
git push origin your-branch-name
```

Then create a PR on GitHub with:

- Clear title following conventional commit format
- Description of what changed and why
- Link to any related issues

## 📦 Changesets Guide

### What are Changesets?

Changesets help us:

- Track what changes in each PR
- Automatically generate changelogs
- Manage version bumps
- Create release notes

### Creating a Changeset

```bash
# Interactive mode - recommended
pnpm changeset

# For empty changeset (no release needed)
pnpm changeset --empty
```

### Changeset File Format

Changesets are stored in `.changeset/` as markdown files:

```markdown
---
'agentic-nextjs-ts-starter': patch
---

Fixed issue with validation logic in user input handler
```

### Examples

#### Bug Fix (Patch)

```bash
pnpm changeset
# Select: patch
# Summary: "Fixed memory leak in event handler"
```

#### New Feature (Minor)

```bash
pnpm changeset
# Select: minor
# Summary: "Added support for custom validators"
```

#### Breaking Change (Major)

```bash
pnpm changeset
# Select: major
# Summary: "Changed API response format - returns array instead of object"
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Generate coverage report
pnpm coverage:report
```

### Writing Tests

- Unit and component tests: `tests/*.spec.ts` / `tests/*.spec.tsx`
- Property-based tests: `tests/*.property.spec.ts`

Example Route Handler test:

```typescript
import { describe, it, expect } from 'vitest';
import { GET } from '../app/api/health/route';

describe('GET /api/health', () => {
  it('returns a healthy status', async () => {
    const response = GET();
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.status).toBe('healthy');
  });
});
```

Example component test:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HomePage from '../app/page';

describe('HomePage', () => {
  it('renders the main heading', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
```

## 🏗️ Project Structure

```
app/          # Next.js App Router (pages, layouts, API routes)
tests/        # Test files
  *.spec.ts   # Unit tests
  *.spec.tsx  # Component tests
  *.property.spec.ts # Property-based tests
docs/         # Documentation
.changeset/   # Changeset files
.next/        # Build output (gitignored)
```

## 📝 Code Style

- TypeScript with strict mode
- ESLint for linting (type-aware rules for `app/` and `tests/`)
- Prettier for formatting
- ES modules; Turbopack resolves imports without `.js` extensions

## 🔍 PR Review Process

1. CI checks must pass
2. Changeset must be included (or explicitly empty)
3. Tests must cover new functionality
4. Documentation must be updated if needed
5. Code review approval required

## 🚢 Release Process

Releases are fully automated with zero manual intervention:

1. **You merge your PR** with a changeset to main
2. **Version PR is created** automatically by changesets
3. **Auto-merge is enabled** on the version PR
4. **CI runs and passes** → PR merges automatically
5. **Release is created** with:
   - Git tag for the version
   - GitHub release with changelog
   - SBOM attached as release asset
   - Build attestations for verification

### What You Need to Do

Just merge your PR! The rest is automatic. The release will happen without any manual steps.

### Monitoring Releases

You can watch the progress:

- Check the [Actions tab](../../actions) to see workflows running
- The version PR will show "Auto-merge enabled" status
- Once merged, a GitHub release will appear in [Releases](../../releases)

### Stopping a Release

If you need to prevent an automatic release:

```bash
# Find the version PR number and disable auto-merge
gh pr merge --disable-auto PR_NUMBER
```

### ⚠️ Important: Repository Configuration

For maintainers, ensure the following repository setting is enabled:

1. Go to **Settings** → **Actions** → **General**
2. Under "Workflow permissions", check:
   - ✅ **"Allow GitHub Actions to create and approve pull requests"**

This is required for the automated release workflow to create version PRs.

## 💡 Tips

- Keep PRs focused and small
- Write descriptive commit messages
- Add tests for new features
- Update documentation
- Use changesets for tracking changes
- Run `pnpm precommit` before pushing

## 🤝 Getting Help

- Check existing issues and PRs
- Read the documentation
- Ask questions in issues
- Review AGENTS.md for AI-assisted development

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.
