import { NextResponse } from 'next/server';
import packageJson from '../../../package.json' with { type: 'json' };
import { getAppName } from '../../lib/app-config';

/**
 * Shape of the JSON body returned by the health check endpoint.
 */
export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  application: string;
  version: string;
  uptime: number;
  environment: string | undefined;
}

/**
 * Health check endpoint
 * Returns the health status of the application
 * @returns JSON response with health status
 */
export function GET() {
  const body: HealthCheckResponse = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    application: getAppName(),
    version: packageJson.version,
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  };

  return NextResponse.json(body, { status: 200 });
}
