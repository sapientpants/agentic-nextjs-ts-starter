import { describe, it, expect, vi, beforeEach } from 'vitest';
import packageJson from '../package.json';
import { GET, type HealthCheckResponse } from '../app/api/health/route';

const DEFAULT_APP_NAME = 'agentic-nextjs-ts-starter';

const getHealth = async (): Promise<HealthCheckResponse> => {
  const response = GET();
  return (await response.json()) as HealthCheckResponse;
};

describe('Health Check API Route', () => {
  beforeEach(() => {
    // Restored automatically after each test via `restoreMocks: true`.
    vi.spyOn(process, 'uptime').mockReturnValue(123.45);
  });

  it('returns a 200 status code', () => {
    const response = GET();
    expect(response.status).toBe(200);
  });

  it('returns JSON with correct structure', async () => {
    const data = await getHealth();

    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('application');
    expect(data).toHaveProperty('version');
    expect(data).toHaveProperty('uptime');
    expect(data).toHaveProperty('environment');
  });

  it('returns healthy status', async () => {
    const data = await getHealth();

    expect(data.status).toBe('healthy');
  });

  it('returns the application name from environment', async () => {
    const data = await getHealth();

    // `tests/setup.ts` sets a value distinct from the hardcoded fallback.
    expect(process.env.NEXT_PUBLIC_APP_NAME).toBe('test-app');
    expect(data.application).toBe('test-app');
    expect(data.application).not.toBe(DEFAULT_APP_NAME);
  });

  it('returns the version from package.json', async () => {
    const data = await getHealth();

    expect(data.version).toBe(packageJson.version);
  });

  it('returns a valid ISO timestamp', async () => {
    const data = await getHealth();

    expect(data.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);

    // Verify it's a valid date
    const timestamp = new Date(data.timestamp);
    expect(timestamp).toBeInstanceOf(Date);
    expect(timestamp.getTime()).not.toBeNaN();
  });

  it('returns process uptime', async () => {
    const data = await getHealth();

    expect(data.uptime).toBeCloseTo(123.45);
    expect(typeof data.uptime).toBe('number');
  });

  it('returns test environment', async () => {
    const data = await getHealth();

    expect(data.environment).toBe('test');
  });

  it('returns Content-Type application/json', () => {
    const response = GET();
    const contentType = response.headers.get('content-type');

    expect(contentType).toContain('application/json');
  });

  it('uses the default application name when NEXT_PUBLIC_APP_NAME is unset', async () => {
    // Undone automatically after each test via `unstubEnvs: true`.
    vi.stubEnv('NEXT_PUBLIC_APP_NAME', undefined);

    const data = await getHealth();

    expect(data.application).toBe(DEFAULT_APP_NAME);
  });

  it('uses the default application name when NEXT_PUBLIC_APP_NAME is empty', async () => {
    vi.stubEnv('NEXT_PUBLIC_APP_NAME', '');

    const data = await getHealth();

    expect(data.application).toBe(DEFAULT_APP_NAME);
  });
});
