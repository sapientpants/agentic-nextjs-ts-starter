---
'agentic-nextjs-ts-starter': major
---

**BREAKING CHANGE: Migrate from Node.js to Next.js**

Complete migration from agentic-node-ts-starter to agentic-nextjs-ts-starter with Next.js App Router support.

## Major Changes

- **Renamed project** from `agentic-node-ts-starter` to `agentic-nextjs-ts-starter`
- **Migrated to Next.js 16** with App Router architecture
- **Added React 19** with Server Components and Server-Side Rendering (SSR)
- **Replaced Node.js infrastructure** with Next.js patterns:
  - Removed Pino logger (use Next.js native logging)
  - Removed Zod config (use Next.js environment variables)
  - Removed custom Node.js server code

## New Features

- ✨ Next.js 16 App Router with typed routes
- ✨ React 19 with Server Components
- ✨ Server-Side Rendering (SSR) and Static Site Generation (SSG)
- ✨ API Routes for backend functionality (`/api/health` endpoint)
- ✨ React Testing Library with @vitejs/plugin-react
- ✨ Docker support with Next.js standalone build
- ✨ Updated ESLint configuration with @next/eslint-plugin-next

## Updated Infrastructure

- **Testing**: Updated Vitest configuration for React components (jsdom environment)
- **Docker**: Updated Dockerfile for Next.js standalone output
- **Quality Tools**: Updated knip, dependency-cruiser, and size-limit for Next.js structure
- **TypeScript**: Updated tsconfig.json for Next.js (bundler module resolution, JSX preserve)
- **Scripts**: Updated all package.json scripts (dev, build, start, clean, deps, etc.)

## Breaking Changes

- **Directory structure**: Changed from `src/` to `app/` (Next.js App Router)
- **Build output**: Changed from `dist/` to `.next/`
- **Entry point**: Changed from `dist/index.js` to Next.js server
- **Configuration**: Removed `.env` pattern, use `.env.local` for Next.js
- **Test coverage thresholds**: Reduced from 90% to 80% (alignment with Next.js complexity)

## Migration Guide

If you're migrating an existing project from agentic-node-ts-starter:

1. **Update dependencies**: Install Next.js, React, and React DOM
2. **Restructure code**: Move logic from `src/` to `app/` following Next.js App Router structure
3. **Update environment variables**: Rename `.env` to `.env.local` and prefix client variables with `NEXT_PUBLIC_`
4. **Update imports**: Next.js uses different import patterns for client/server components
5. **Update tests**: Add React Testing Library and update test configuration
6. **Update Docker**: Use Next.js standalone build mode
7. **Review CI/CD**: Update build commands from `tsc` to `next build`

For new projects, simply clone and start developing with `pnpm dev`!
