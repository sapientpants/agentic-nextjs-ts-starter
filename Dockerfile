# Build stage
FROM node:24-alpine AS builder

# Install pnpm
RUN corepack enable

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml .npmrc ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build Next.js application (output mode: standalone)
RUN pnpm build

# Production stage
FROM node:24-alpine

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

# Copy the complete @swc/helpers package from the builder's pnpm store
# to fix the missing esm/ subpath files (Next.js nft file tracer silently
# drops ESM variants when resolving transitive dependencies in pnpm mode)
COPY --from=builder /app/node_modules/.pnpm/@swc+helpers@0.5.23/node_modules/@swc/helpers /app/node_modules/.pnpm/@swc+helpers@0.5.23/node_modules/@swc/helpers

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
