import { describe, expect, vi } from 'vitest';
import { fc, it } from '@fast-check/vitest';
import { GET, type HealthCheckResponse } from '../app/api/health/route';

const DEFAULT_APP_NAME = 'agentic-nextjs-ts-starter';
const ISO_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

/** Non-empty app names that survive the `||` fallback in the route. */
const appNameArb = fc.string({ minLength: 1 });

/** Values that make `NEXT_PUBLIC_APP_NAME` falsy: unset or empty string. */
const missingAppNameArb = fc.constantFrom<string | undefined>(undefined, '');

/**
 * Stub the env var for the current property run. Stubs are undone after each
 * test by `unstubEnvs: true` in `vitest.config.ts`.
 */
const setAppName = (value: string | undefined): void => {
  vi.stubEnv('NEXT_PUBLIC_APP_NAME', value);
};

const getHealth = async (): Promise<HealthCheckResponse> => {
  const response = GET();
  expect(response.status).toBe(200);
  return (await response.json()) as HealthCheckResponse;
};

describe('Health Check Property Tests', () => {
  it.prop([appNameArb])(
    'round-trips any non-empty NEXT_PUBLIC_APP_NAME into application',
    async (name) => {
      setAppName(name);
      const data = await getHealth();
      expect(data.application).toBe(name);
    },
  );

  it.prop([missingAppNameArb])(
    'falls back to the default name when NEXT_PUBLIC_APP_NAME is unset or empty',
    async (name) => {
      setAppName(name);
      const data = await getHealth();
      expect(data.application).toBe(DEFAULT_APP_NAME);
    },
  );

  it.prop([fc.option(appNameArb, { nil: undefined })])(
    'keeps the response shape stable regardless of app name',
    async (name) => {
      setAppName(name);
      const data = await getHealth();
      expect(data.status).toBe('healthy');
      expect(data.timestamp).toMatch(ISO_TIMESTAMP);
      expect(new Date(data.timestamp).getTime()).not.toBeNaN();
      expect(typeof data.version).toBe('string');
      expect(data.uptime).toBeGreaterThanOrEqual(0);
      expect(typeof data.environment).toBe('string');
    },
  );
});
