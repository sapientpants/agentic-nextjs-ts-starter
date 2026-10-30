# Observability Guide

This template ships a health endpoint and relies on Next.js' built-in logging. This guide shows what is included and how to extend it.

## What's Included

### Health Endpoint

`app/api/health/route.ts` exposes `GET /api/health` and returns:

```json
{
  "status": "healthy",
  "timestamp": "2026-01-01T00:00:00.000Z",
  "application": "agentic-nextjs-ts-starter",
  "version": "1.0.0",
  "uptime": 12.34,
  "environment": "production"
}
```

The Dockerfile `HEALTHCHECK` polls this endpoint. See [docs/DOCKER.md](./DOCKER.md) for customizing it.

### Logging

Next.js logs requests, build output and server errors to stdout/stderr. In development, `next dev` also prints fetch timings. Configure request logging in `next.config.ts`:

```typescript
const config: NextConfig = {
  logging: {
    fetches: { fullUrl: true },
  },
};
```

For application logs, use `console.*` with structured objects so log aggregators can index them:

```typescript
console.info(JSON.stringify({ level: 'info', event: 'user.login', userId }));
```

Keep logging in Server Components, Route Handlers and Server Actions. Anything logged in a Client Component ends up in the browser console.

## Extending for Your Project

### Adding OpenTelemetry

Next.js supports OpenTelemetry through an `instrumentation.ts` file at the project root:

```bash
pnpm add @vercel/otel @opentelemetry/api
```

```typescript
// instrumentation.ts
import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel({ serviceName: 'my-app' });
}
```

See the [Next.js OpenTelemetry guide](https://nextjs.org/docs/app/guides/open-telemetry) for exporter configuration.

### Adding a Structured Logger

If you need log levels, child loggers or redaction, add a server-only logger (for example `pino`) and import it only from server code:

```bash
pnpm add pino
```

```typescript
// lib/logger.ts
import 'server-only';
import pino from 'pino';

export const logger = pino({ level: process.env.LOG_LEVEL ?? 'info' });
```

### Adding Metrics

For application metrics, consider:

- **OpenTelemetry Metrics** - Unified with tracing via `instrumentation.ts`
- **Prometheus** - Expose a `/api/metrics` Route Handler
- **Hosting-provider analytics** - Vercel, Cloudflare and others provide request metrics out of the box

### Log Aggregation

In production, send container stdout/stderr to:

- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Datadog** / **New Relic** / **Splunk**
- **AWS CloudWatch** / **Google Cloud Logging**
- **Grafana Loki** for open-source stack

### Environment Variables

```bash
# Server-only
NODE_ENV=production
LOG_LEVEL=info                      # If you add a logger that reads it

# OpenTelemetry (when you add it)
OTEL_SERVICE_NAME=my-app
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

## Tips for Production

1. **Keep `/api/health` cheap** so container orchestrators can poll it frequently
2. **Add dependency checks** (database, cache) to the health endpoint only when they are critical
3. **Avoid logging sensitive data** (request bodies, tokens, personal data)
4. **Use structured JSON logs** for better querying
5. **Correlate requests** by logging a request ID from the `x-request-id` header

## Learn More

- [Next.js OpenTelemetry guide](https://nextjs.org/docs/app/guides/open-telemetry)
- [Next.js instrumentation](https://nextjs.org/docs/app/guides/instrumentation)
- [OpenTelemetry JS](https://opentelemetry.io/docs/languages/js/)
