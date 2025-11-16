import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../app/api/health/route';

interface HealthCheckResponse {
  status: string;
  timestamp: string;
  application: string;
  version: string;
  uptime: number;
  environment: string;
}

describe('Health Check API Route', () => {
  beforeEach(() => {
    // Mock process.uptime()
    vi.spyOn(process, 'uptime').mockReturnValue(123.45);
  });

  it('returns a 200 status code', () => {
    const response = GET();
    expect(response.status).toBe(200);
  });

  it('returns JSON with correct structure', async () => {
    const response = GET();
    const data = (await response.json()) as HealthCheckResponse;

    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('application');
    expect(data).toHaveProperty('version');
    expect(data).toHaveProperty('uptime');
    expect(data).toHaveProperty('environment');
  });

  it('returns healthy status', async () => {
    const response = GET();
    const data = (await response.json()) as HealthCheckResponse;

    expect(data.status).toBe('healthy');
  });

  it('returns the application name from environment', async () => {
    const response = GET();
    const data = (await response.json()) as HealthCheckResponse;

    expect(data.application).toBe('agentic-nextjs-ts-starter');
  });

  it('returns a valid ISO timestamp', async () => {
    const response = GET();
    const data = (await response.json()) as HealthCheckResponse;

    expect(data.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);

    // Verify it's a valid date
    const timestamp = new Date(data.timestamp);
    expect(timestamp).toBeInstanceOf(Date);
    expect(timestamp.getTime()).not.toBeNaN();
  });

  it('returns process uptime', async () => {
    const response = GET();
    const data = (await response.json()) as HealthCheckResponse;

    expect(data.uptime).toBe(123.45);
    expect(typeof data.uptime).toBe('number');
  });

  it('returns test environment', async () => {
    const response = GET();
    const data = (await response.json()) as HealthCheckResponse;

    expect(data.environment).toBe('test');
  });

  it('returns Content-Type application/json', () => {
    const response = GET();
    const contentType = response.headers.get('content-type');

    expect(contentType).toContain('application/json');
  });

  it('uses default values when environment variables are not set', async () => {
    const originalAppName = process.env.NEXT_PUBLIC_APP_NAME;
    const originalVersion = process.env.npm_package_version;

    delete process.env.NEXT_PUBLIC_APP_NAME;
    delete process.env.npm_package_version;

    const response = GET();
    const data = (await response.json()) as HealthCheckResponse;

    expect(data.application).toBe('agentic-nextjs-ts-starter');
    expect(data.version).toBe('unknown');

    process.env.NEXT_PUBLIC_APP_NAME = originalAppName;
    process.env.npm_package_version = originalVersion;
  });
});
