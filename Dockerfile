# Build stage
FROM node:26-alpine AS builder

# Install pnpm via Corepack, which reads the exact version from the
# `packageManager` field in package.json. Node.js 25+ images no longer bundle
# Corepack, so it has to be installed first. The version is pinned like every
# other dependency in this project; bump it deliberately.
RUN npm install -g corepack@0.36.0 && corepack enable

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build Next.js application (output mode: standalone)
RUN pnpm build

# Workaround: the Next.js file tracer (@vercel/nft) drops most of
# @swc/helpers/esm/ when it traces pnpm's isolated node_modules layout into
# the standalone output (with Next.js 16.4.3 the esm/ directory holds 108
# files in node_modules but only 2 in .next/standalone), so `node server.js`
# crashes with MODULE_NOT_FOUND. Copy the complete package into the standalone
# tree for whichever version pnpm installed, so a Next.js or @swc/helpers bump
# cannot silently break this step. Closest upstream report:
# https://github.com/vercel/next.js/issues/65636
#
# Remove this step once both commands print the same number after `pnpm build`:
#   find node_modules/.pnpm/@swc+helpers@*/node_modules/@swc/helpers/esm -type f | wc -l
#   find .next/standalone/node_modules/.pnpm/@swc+helpers@*/node_modules/@swc/helpers/esm -type f | wc -l
RUN set -eu; \
    for dir in node_modules/.pnpm/@swc+helpers@*/node_modules/@swc/helpers; do \
      [ -d "$dir" ] || continue; \
      mkdir -p ".next/standalone/$(dirname "$dir")"; \
      rm -rf ".next/standalone/$dir"; \
      cp -R "$dir" ".next/standalone/$dir"; \
    done

# Production stage
FROM node:26-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy standalone output from builder
# Next.js standalone output includes minimal dependencies
COPY --from=builder --chown=nodejs:nodejs /app/.next/standalone ./

# Copy static assets and public directory
COPY --from=builder --chown=nodejs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nodejs:nodejs /app/public ./public

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check for Next.js application
# Checks the /api/health endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start Next.js production server
CMD ["node", "server.js"]
