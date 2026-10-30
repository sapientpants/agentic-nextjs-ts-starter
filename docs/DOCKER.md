# Docker Configuration Guide

This guide explains how the included Dockerfile packages the Next.js application and how to adapt its healthcheck when you change the port or the health endpoint.

## Table of Contents

- [Understanding the Default Configuration](#understanding-the-default-configuration)
- [Healthcheck Requirements](#healthcheck-requirements)
- [Customizing the Health Endpoint](#customizing-the-health-endpoint)
- [Building and Running](#building-and-running)
- [Container Orchestration](#container-orchestration)
- [Troubleshooting](#troubleshooting)

## Understanding the Default Configuration

The template includes a production-ready Dockerfile with:

- **Multi-stage build**: `pnpm build` runs in a builder stage; only the [standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output) is copied into the final image
- **Non-root user**: The server runs as `nodejs` (uid 1001)
- **Signal handling**: Proper shutdown via dumb-init
- **Health check**: Polls the `/api/health` Route Handler

`next.config.ts` sets `output: 'standalone'`, which makes `next build` emit a self-contained `server.js` plus the minimal `node_modules` it needs under `.next/standalone`. The final image starts it with `node server.js` on port 3000.

### ⚠️ Important: Build-Time Environment Variables

`NEXT_PUBLIC_*` variables are inlined into the client bundle during `pnpm build`, which runs inside the builder stage. Pass them as build arguments (or bake an `.env.production` into the image) rather than at `docker run` time. Server-only variables can be supplied at runtime as usual.

## Healthcheck Requirements

The default healthcheck configuration:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1
```

This healthcheck:

- Runs every 30 seconds
- Times out after 3 seconds
- Allows 10 seconds for startup
- Retries 3 times before marking unhealthy
- Expects HTTP 200 response from `http://localhost:3000/api/health`

The endpoint is implemented in `app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    { status: 200 },
  );
}
```

## Customizing the Health Endpoint

### Adding Dependency Checks

Return `503` when a critical dependency is down so the orchestrator stops routing traffic:

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Record<string, { status: 'up' | 'down'; responseTime?: number; error?: string }>;
  timestamp: string;
  uptime: number;
}

async function check(name: string, probe: () => Promise<unknown>, health: HealthStatus) {
  const start = Date.now();
  try {
    await probe();
    health.checks[name] = { status: 'up', responseTime: Date.now() - start };
  } catch (error) {
    health.status = 'unhealthy';
    health.checks[name] = {
      status: 'down',
      error: error instanceof Error ? error.message : 'unknown',
    };
  }
}

export async function GET() {
  const health: HealthStatus = {
    status: 'healthy',
    checks: {},
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };

  // await check('database', () => db.query('SELECT 1'), health);
  // await check('cache', () => redis.ping(), health);

  return NextResponse.json(health, { status: health.status === 'healthy' ? 200 : 503 });
}
```

Keep the endpoint cheap: it is polled every 30 seconds by Docker and more often by Kubernetes probes.

### Renaming or Moving the Endpoint

If you move the handler (for example to `app/healthz/route.ts`), update both the Dockerfile `HEALTHCHECK` URL and any orchestrator probe paths shown below.

### Changing the Port

Next.js standalone reads `PORT` and `HOSTNAME` from the environment:

```dockerfile
ENV PORT=8080
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1
```

### Disabling the Healthcheck

If your platform runs its own probes, remove the `HEALTHCHECK` instruction or add `HEALTHCHECK NONE` after it.

## Building and Running

### Basic Docker Commands

```bash
# Build the image
docker build -t my-app .

# Run the production server
docker run -p 3000:3000 my-app

# Pass server-only environment variables at runtime
docker run -p 3000:3000 -e DATABASE_URL=postgres://... my-app

# Run without healthcheck (override at runtime)
docker run --no-healthcheck -p 3000:3000 my-app

# Check health status
docker inspect --format='{{.State.Health.Status}}' <container-id>
```

### Local Security Scan

```bash
pnpm scan:container   # Builds the image and scans it with Trivy
```

### Docker Compose Configuration

```yaml
# docker-compose.yml
services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=postgres://db:5432/app
    # Override healthcheck if needed
    healthcheck:
      test:
        [
          'CMD',
          'node',
          '-e',
          "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})",
        ]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 10s
    # Or disable healthcheck
    # healthcheck:
    #   disable: true
```

## Container Orchestration

### Kubernetes

For Kubernetes deployments, use native probes instead of Docker healthchecks:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  template:
    spec:
      containers:
        - name: app
          image: my-app:latest
          ports:
            - containerPort: 3000
          # Liveness probe (restarts container if unhealthy)
          livenessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 30
          # Readiness probe (removes from load balancer if not ready)
          readinessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 10
```

### AWS ECS

For ECS task definitions:

```json
{
  "family": "my-app",
  "containerDefinitions": [
    {
      "name": "app",
      "image": "my-app:latest",
      "portMappings": [
        {
          "containerPort": 3000
        }
      ],
      "healthCheck": {
        "command": [
          "CMD-SHELL",
          "node -e \"require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})\" || exit 1"
        ],
        "interval": 30,
        "timeout": 3,
        "retries": 3,
        "startPeriod": 10
      }
    }
  ]
}
```

The Alpine base image does not ship `curl`, so probes use `node -e` instead.

## Troubleshooting

### Common Issues

#### Build Fails with "Cannot find module"

The standalone output only includes files that Next.js' file tracer detects. If a dependency is loaded dynamically, add it to `outputFileTracingIncludes` in `next.config.ts` or copy it explicitly in the Dockerfile (see the `@swc/helpers` workaround already present).

#### Container Never Becomes Healthy

Check these common causes:

1. **Port mismatch**: Verify `PORT` matches the healthcheck URL
2. **Path mismatch**: Ensure the Route Handler path matches the healthcheck
3. **Slow startup**: Increase `--start-period` if the server needs longer to boot

Debug with:

```bash
# Check container logs
docker logs <container-id>

# Execute healthcheck manually
docker exec <container-id> node -e "require('http').get('http://localhost:3000/api/health', (r) => {console.log('Status:', r.statusCode)})"

# Inspect health status
docker inspect <container-id> | jq '.[0].State.Health'
```

#### Static Assets Return 404

The Dockerfile copies `.next/static` and `public/` next to the standalone server. If you add a custom `assetPrefix` or `basePath`, make sure those paths still line up.

### Testing Healthchecks Locally

```bash
# Build and run with health status monitoring
docker build -t test-health .
docker run -d --name test-health-container test-health

# Watch health status
watch docker inspect --format='{{.State.Health.Status}}' test-health-container

# View health check logs
docker inspect test-health-container | jq '.[0].State.Health.Log'

# Clean up
docker stop test-health-container
docker rm test-health-container
```

## Best Practices

1. **Keep health endpoints simple**: Avoid expensive operations in health checks
2. **Use appropriate timeouts**: Balance between quick failure detection and false positives
3. **Consider dependencies**: Only check critical dependencies in health endpoints
4. **Log health checks sparingly**: Help with debugging but avoid log spam
5. **Secure detailed health information**: Return only `status` publicly if the response reveals internals
6. **Version your health API**: The default response already includes the package version
7. **Monitor trends**: Track health check failures over time

## Additional Resources

- [Next.js: Deploying with Docker](https://nextjs.org/docs/app/getting-started/deploying#docker)
- [Docker HEALTHCHECK documentation](https://docs.docker.com/engine/reference/builder/#healthcheck)
- [Kubernetes Probes documentation](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
- [The Twelve-Factor App: Disposability](https://12factor.net/disposability)
- [Health Check Response Format for HTTP APIs (RFC)](https://datatracker.ietf.org/doc/html/draft-inadarei-api-health-check)
