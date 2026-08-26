import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { GET } from '../app/api/health/route';

interface HealthCheckResponse {
  status: string;
  timestamp: string;
  application: string;
  version: string;
  uptime: number;
  environment: string | undefined;
}

describe('Health Check Property Tests', () => {
  it('always returns a response with status 200', () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fast-check asyncProperty handles async callbacks
    fc.assert(
      fc.asyncProperty(
        fc.string(),
        // eslint-disable-next-line @typescript-eslint/require-await -- fast-check manages async lifecycle
        async () => {
          const response = GET();
          expect(response.status).toBe(200);
        },
      ),
    );
  });

  it('always returns a valid ISO timestamp', () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fast-check asyncProperty handles async callbacks
    fc.assert(
      fc.asyncProperty(fc.string(), async () => {
        const response = GET();
        const data = (await response.json()) as HealthCheckResponse;
        expect(data.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        const timestamp = new Date(data.timestamp);
        expect(timestamp).toBeInstanceOf(Date);
        expect(timestamp.getTime()).not.toBeNaN();
      }),
    );
  });

  it('always returns non-negative uptime', () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fast-check asyncProperty handles async callbacks
    fc.assert(
      fc.asyncProperty(fc.string(), async () => {
        const response = GET();
        const data = (await response.json()) as HealthCheckResponse;
        expect(data.uptime).toBeGreaterThanOrEqual(0);
      }),
    );
  });

  it('always returns the expected structure', () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fast-check asyncProperty handles async callbacks
    fc.assert(
      fc.asyncProperty(fc.string(), async () => {
        const response = GET();
        const data = (await response.json()) as HealthCheckResponse;
        expect(typeof data.status).toBe('string');
        expect(typeof data.timestamp).toBe('string');
        expect(typeof data.application).toBe('string');
        expect(typeof data.version).toBe('string');
        expect(typeof data.uptime).toBe('number');
        expect(typeof data.environment).toBe('string');
      }),
    );
  });
});
