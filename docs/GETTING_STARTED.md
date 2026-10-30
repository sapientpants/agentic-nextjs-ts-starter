# Getting Started Guide

Welcome to the Agentic Next.js + TypeScript Starter! This guide will walk you through transforming this template into your own project in under 10 minutes.

> **What does "Agentic" mean?** This template is designed for AI-assisted development workflows. It includes configurations and commands specifically tailored for working with AI development tools like OpenCode. The template itself is not an AI agent - it's a foundation for building your own applications with the help of AI assistants. The comprehensive testing, documentation, and quality automation make it safe and efficient for AI tools to help you generate, refactor, and maintain code.

## Quick Setup Checklist

Follow these steps in order to customize the template for your project:

### 1. Clone and Initialize

```bash
# Clone the template (replace with your project name)
git clone https://github.com/sapientpants/agentic-nextjs-ts-starter.git your-project-name
cd your-project-name

# Remove template history and start fresh
rm -rf .git
git init
git add .
git commit -m "Initial commit from agentic-nextjs-ts-starter template"
```

### 2. Install Development Environment

Choose your preferred Node.js version manager:

#### Option A: Using mise (Recommended)

The project includes a `mise.toml` file to automatically manage Node.js and pnpm versions:

```bash
# Install mise (if not already installed)
# macOS/Linux: curl https://mise.run | sh
# Or via Homebrew: brew install mise

# Activate mise in your shell (add to ~/.bashrc or ~/.zshrc)
eval "$(mise activate bash)"  # or zsh

# Install the exact versions specified in mise.toml
mise install        # Installs Node 26 and pnpm 12.16.1
pnpm install       # Install dependencies
```

#### Option B: Using nvm or fnm

```bash
# Using nvm
nvm install 26
nvm use 26
npm install -g pnpm@12.16.1

# OR using fnm
fnm install 26
fnm use 26
npm install -g pnpm@12.16.1

# Then install dependencies
pnpm install
```

#### Option C: Manual Installation

1. Install [Node.js 26+](https://nodejs.org/) directly
2. Install pnpm: `npm install -g pnpm@12.16.1`
3. Install dependencies: `pnpm install`

⚠️ **Important**: This project requires:

- Node.js >= 26.0.0
- pnpm 12.16.1 (exact version)

### 3. Set Up Environment Variables (Optional)

Next.js loads environment variables from `.env.local` automatically. The defaults work out of the box, so this step is only needed when you want to override them:

```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local as needed
# Variables prefixed with NEXT_PUBLIC_ are exposed to the browser.
# Everything else is server-only. Never put secrets in NEXT_PUBLIC_ variables.
```

`.env.local` is gitignored. See the [Next.js environment variables guide](https://nextjs.org/docs/app/guides/environment-variables) for load order and conventions.

### 4. Update Project Metadata

Edit `package.json`:

```json
{
  "name": "your-project-name",
  "version": "0.1.0",
  "description": "Your project description",
  "private": true, // or false if publishing to npm
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/your-project.git"
  },
  "keywords": ["your", "keywords"],
  "license": "MIT" // or your preferred license
}
```

Also update the `title` and `description` in `app/layout.tsx` and the `NEXT_PUBLIC_APP_NAME` default in `.env.local.example`.

### 5. Clean Up Example Code

> [!IMPORTANT]
> **Understanding Template Files**
>
> This template includes two types of files:
>
> - **📝 Example Code**: Demonstration files that you will replace with your own application:
>   - `app/page.tsx` - Example home page describing the template
>   - `app/api/health/route.ts` - Example Route Handler (`GET /api/health`) used by the Docker healthcheck
>   - `tests/page.spec.tsx` - Example component tests for the home page
>   - `tests/health-route.spec.ts` - Example Route Handler unit tests
>   - `tests/health-route.property.spec.ts` - Example property-based tests
> - **🏗️ Template Infrastructure**: Production-ready code that you can keep and customize:
>   - `app/layout.tsx` - Root layout and site metadata
>   - `app/globals.css` - Global styles
>   - `tests/setup.ts` and `tests/vitest-jest-dom.ts` - Vitest + Testing Library setup
>   - `tests/templates/` - Unit and property test templates to copy
>   - All configuration files (Next.js, TypeScript, ESLint, Prettier, Vitest, etc.)

Replace the example page with your own:

```bash
# Replace the home page and its test
cat > app/page.tsx << 'EOT'
export default function HomePage() {
  return <main>Hello from my app!</main>;
}
EOT
rm tests/page.spec.tsx

# Keep app/api/health/route.ts unless you also update the Dockerfile HEALTHCHECK
```

Remember that coverage must stay at 90% or higher, so add a test for every file you add under `app/`.

### 6. Update README

Replace the template README with your project-specific content:

```bash
# Backup the template README for reference
mv README.md TEMPLATE_README.md

# Create your project README
cat > README.md << 'EOT'
# Your Project Name

Brief description of your project.

## Installation

\`\`\`bash
pnpm install
\`\`\`

## Usage

\`\`\`bash
pnpm dev         # http://localhost:3000
\`\`\`

## Development

\`\`\`bash
pnpm build       # Production build
pnpm test        # Run tests
pnpm precommit   # Run all checks
\`\`\`

## License

Your license here.
EOT
```

### 7. Configure GitHub Repository

This template's CI/CD workflows require GitHub. Create your repository:

```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/your-project.git
git branch -M main
git push -u origin main
```

### 8. Set Up CI/CD

The template includes comprehensive GitHub Actions workflows that handle PR validation, releases, and publishing. See [.github/WORKFLOWS.md](../.github/WORKFLOWS.md) for the full list of secrets and variables.

#### For Docker publishing (optional):

1. Add `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` secrets
2. Set repository variable `ENABLE_DOCKER_RELEASE` to `true`

### 9. Start Building Your Project

Now that your template is customized, you can start building your project. The template provides a solid foundation for any Next.js + TypeScript application.

## Verify Your Setup

### Post-Setup Validation Checklist

After customization, run through this checklist to ensure everything is properly configured:

```bash
# 1. Verify all quality checks pass
pnpm precommit
# This runs: audit, format, spelling, lint, typecheck, dependency analysis, tests, changeset status

# 2. Check test coverage meets requirements (90% minimum)
pnpm test:coverage
# Should show coverage >= 90% for all metrics

# 3. Ensure the Next.js production build succeeds
pnpm build
# Creates .next/ (standalone output used by the Dockerfile)

# 4. Verify pre-commit hooks are installed
ls .husky/
# Should list pre-commit and commit-msg

# 5. Check that your environment is configured
node -e "console.log('Node:', process.version)"
pnpm --version
# Should show Node 26+ and pnpm 12.16.1

# 6. Start the dev server and open http://localhost:3000
pnpm dev
```

If all checks pass, your project is ready for development!

## Next Steps

1. **Write your first feature**: Start with a test, then implement
2. **Set up your IDE**: Configure VS Code or your preferred editor
3. **Review documentation**:
   - [AGENTS.md](../AGENTS.md) - AI-assisted development with OpenCode
   - [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues and solutions
   - [PROCESS.md](./PROCESS.md) - Development workflow
   - [OBSERVABILITY.md](./OBSERVABILITY.md) - Health checks, logging and monitoring

## Common Customizations

### Add a Page

Create `app/about/page.tsx`:

```tsx
export default function AboutPage() {
  return <main>About</main>;
}
```

It is served at `/about`. With `typedRoutes` enabled in `next.config.ts`, `<Link href="/about">` is type-checked.

### Add an API Endpoint

Create `app/api/hello/route.ts`:

```ts
import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({ message: 'hello' });
}
```

See [docs/PATTERNS.md](./PATTERNS.md) for request validation and error handling patterns.

### Add a Database

For PostgreSQL with Prisma:

```bash
pnpm add @prisma/client
pnpm add -D prisma
npx prisma init
```

Keep database access in Server Components, Route Handlers or Server Actions so credentials never reach the browser.

### Change License

1. Update `LICENSE` file with your preferred license text
2. Update `license` field in `package.json`
3. Update license badge in `README.md` if present

## After Setup - Start Building Your Application

### Next Steps

1. **Verify your environment** (if using mise):

   ```bash
   # Check that mise is managing versions correctly
   mise list          # Shows installed tools
   node --version     # Should show v26.x.x
   pnpm --version     # Should show 12.16.1
   ```

2. **Update project metadata**:
   - Edit `package.json` with your project name and description
   - Update README.md with your project information
   - Configure AGENTS.md for your specific needs

3. **Start developing**:

   ```bash
   # Next.js dev server with hot reload
   pnpm dev

   # Watch tests
   pnpm test:watch
   ```

4. **Add your first feature**:
   - Create pages, layouts and Route Handlers in `app/`
   - Add tests in `tests/`
   - Follow patterns in [docs/PATTERNS.md](./PATTERNS.md)

5. **Before your first commit**:

   ```bash
   # Run all quality checks
   pnpm precommit

   # Create a changeset
   pnpm changeset
   ```

### What to Keep vs What to Change

**Keep These**:

- All configuration files (they're optimized)
- Pre-commit hooks (maintains quality)
- GitHub Actions workflows (CI/CD ready)
- Testing setup (comprehensive coverage)

**Customize These**:

- `app/` - Replace with your pages and API routes
- `tests/` - Replace with your tests
- `README.md` - Your project description
- `AGENTS.md` - Your AI instructions

**Optional to Remove**:

- `.opencode/` directory (if not using OpenCode)
- ADR records (if you prefer different documentation)

## Time-Saving Tips

- **Keep the pre-commit hooks** to maintain code quality
- **Use changesets** for version management from the start
- **Review AGENTS.md** to leverage AI-assisted development effectively
- **Check existing patterns** in the template before adding new ones
- **Use the documentation** - [docs/](../docs/) has examples for everything

## Getting Help

- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues
- Review the [template documentation](https://github.com/sapientpants/agentic-nextjs-ts-starter)
- Open an issue if you find bugs in the template

---

**Estimated time to complete**: 5-10 minutes for basic setup, depending on familiarity with the tools.
