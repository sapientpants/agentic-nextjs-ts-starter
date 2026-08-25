import { createRequire } from 'node:module';
import { NextResponse } from 'next/server';

const require = createRequire(import.meta.url);

interface PackageJson {
  version: string;
}

const packageJson = require('../../../package.json') as PackageJson;

/**
 * Health check endpoint
 * Returns the health status of the application
 * @returns {NextResponse} JSON response with health status
 */
export function GET() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'agentic-nextjs-ts-starter';

  return NextResponse.json(
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      application: appName,
      version: packageJson.version,
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
    },
    { status: 200 },
  );
}
