import { createRequire } from 'node:module';
import { NextResponse } from 'next/server';

const require = createRequire(import.meta.url);

interface PackageJson {
  version: string;
}

const packageJson = require('../../../package.json') as PackageJson;

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
 * @returns {NextResponse} JSON response with health status
 */
export function GET() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'agentic-nextjs-ts-starter';

  const body: HealthCheckResponse = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    application: appName,
    version: packageJson.version,
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  };

  return NextResponse.json(body, { status: 200 });
}
