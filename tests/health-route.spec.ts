import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../app/api/health/route';

describe('Health Check API Route', () => {
  beforeEach(() => {
    // Mock process.uptime()
    vi.spyOn(process, 'uptime').mockReturnValue(123.45);
  });

  it('returns a 200 status code', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
  });

  it('returns JSON with correct structure', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('application');
    expect(data).toHaveProperty('version');
    expect(data).toHaveProperty('uptime');
    expect(data).toHaveProperty('environment');
  });

  it('returns healthy status', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data.status).toBe('healthy');
  });

  it('returns the application name from environment', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data.application).toBe('agentic-nextjs-ts-starter');
  });

  it('returns a valid ISO timestamp', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);

    // Verify it's a valid date
    const timestamp = new Date(data.timestamp);
    expect(timestamp).toBeInstanceOf(Date);
    expect(timestamp.getTime()).not.toBeNaN();
  });

  it('returns process uptime', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data.uptime).toBe(123.45);
    expect(typeof data.uptime).toBe('number');
  });

  it('returns test environment', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data.environment).toBe('test');
  });

  it('returns Content-Type application/json', async () => {
    const response = await GET();
    const contentType = response.headers.get('content-type');

    expect(contentType).toContain('application/json');
  });
});
