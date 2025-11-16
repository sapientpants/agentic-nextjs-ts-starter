import { NextResponse } from 'next/server';

/**
 * Health check endpoint
 * Returns the health status of the application
 *
 * @returns JSON response with health status
 */
export async function GET() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'agentic-nextjs-ts-starter';

  return NextResponse.json(
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      application: appName,
      version: process.env.npm_package_version || 'unknown',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    },
    { status: 200 },
  );
}
