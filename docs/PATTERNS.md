# Code Patterns & Examples

Copy-paste ready patterns for common tasks in your Next.js + TypeScript application.

## Table of Contents

- [Route Handlers](#route-handlers)
- [Input Validation](#input-validation)
- [Property-Based Testing](#property-based-testing)
- [Testing Route Handlers and Components](#testing-route-handlers-and-components)
- [Error Handling](#error-handling)
- [Async Patterns](#async-patterns)
- [Type-Safe Environment Variables](#type-safe-environment-variables)

## Route Handlers

### JSON Endpoint

```typescript
// app/api/hello/route.ts
import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({ message: 'hello' });
}
```

### Reading the Request

```typescript
// app/api/posts/route.ts
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body: unknown = await request.json();
  const page = request.nextUrl.searchParams.get('page') ?? '1';

  // Validate `body` before using it (see Input Validation below)
  return NextResponse.json({ received: body, page: Number(page) }, { status: 201 });
}
```

### Dynamic Segments

```typescript
// app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return NextResponse.json({ id });
}
```

## Input Validation

Validate everything that crosses a trust boundary (request bodies, search params, form data) at the edge. Use hand-rolled type guards for small shapes, or a schema library such as `zod` for larger ones.

### Hand-Rolled Type Guard (no dependencies)

```typescript
// lib/validation.ts
export interface CreatePostInput {
  title: string;
  content: string;
  tags: string[];
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

export function isCreatePostInput(value: unknown): value is CreatePostInput {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.title === 'string' &&
    record.title.length > 0 &&
    record.title.length <= 200 &&
    typeof record.content === 'string' &&
    record.content.length >= 10 &&
    isStringArray(record.tags) &&
    record.tags.length <= 5
  );
}
```

```typescript
// app/api/posts/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { isCreatePostInput } from '@/lib/validation';

export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null);

  if (!isCreatePostInput(body)) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // `body` is now typed as CreatePostInput
  return NextResponse.json({ id: 'post-123', ...body }, { status: 201 });
}
```

### Schema Validation with Zod (optional dependency)

```bash
pnpm add zod
```

```typescript
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

const CreatePostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(10),
  tags: z.array(z.string()).max(5).default([]),
  published: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  const result = CreatePostSchema.safeParse(await request.json().catch(() => null));

  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  return NextResponse.json({ id: 'post-123', ...result.data }, { status: 201 });
}
```

## Property-Based Testing

### Basic Property Test

```typescript
import { describe, it, expect } from 'vitest';
import { fc } from '@fast-check/vitest';

// Function to test
function reverseString(s: string): string {
  return s.split('').reverse().join('');
}

describe('reverseString', () => {
  // Property: reversing twice returns original
  it.prop([fc.string()])('reversing twice returns original', (str) => {
    expect(reverseString(reverseString(str))).toBe(str);
  });

  // Property: length is preserved
  it.prop([fc.string()])('preserves string length', (str) => {
    expect(reverseString(str).length).toBe(str.length);
  });
});
```

### Testing Business Logic

```typescript
import { describe, it, expect } from 'vitest';
import { fc } from '@fast-check/vitest';

// Business logic: Calculate discount
function calculateDiscount(price: number, discountPercent: number): number {
  if (price < 0 || discountPercent < 0 || discountPercent > 100) {
    throw new Error('Invalid input');
  }
  return price * (1 - discountPercent / 100);
}

describe('calculateDiscount', () => {
  // Property: discount never makes price negative
  it.prop([fc.float({ min: 0, max: 10000 }), fc.float({ min: 0, max: 100 })])(
    'never returns negative price',
    (price, discount) => {
      const result = calculateDiscount(price, discount);
      expect(result).toBeGreaterThanOrEqual(0);
    },
  );

  // Property: 0% discount returns original price
  it.prop([fc.float({ min: 0, max: 10000 })])('0% discount returns original price', (price) => {
    expect(calculateDiscount(price, 0)).toBe(price);
  });

  // Property: 100% discount returns 0
  it.prop([fc.float({ min: 0, max: 10000 })])('100% discount returns 0', (price) => {
    expect(calculateDiscount(price, 100)).toBe(0);
  });
});
```

### Property Test for a Route Handler

```typescript
import { describe, it, expect } from 'vitest';
import { fc } from '@fast-check/vitest';
import { GET } from '../app/api/health/route';

describe('GET /api/health', () => {
  it.prop([fc.string({ minLength: 1 })])('echoes NEXT_PUBLIC_APP_NAME', async (appName) => {
    vi.stubEnv('NEXT_PUBLIC_APP_NAME', appName);
    const body = await GET().json();
    expect(body.application).toBe(appName);
    vi.unstubAllEnvs();
  });
});
```

## Testing Route Handlers and Components

### Route Handler Unit Test

```typescript
import { describe, it, expect } from 'vitest';
import { POST } from '../app/api/posts/route';

describe('POST /api/posts', () => {
  it('rejects an invalid body', async () => {
    const request = new Request('http://localhost/api/posts', {
      method: 'POST',
      body: JSON.stringify({ title: '' }),
      headers: { 'content-type': 'application/json' },
    });

    const response = await POST(request as never);
    expect(response.status).toBe(400);
  });
});
```

### Component Test

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HomePage from '../app/page';

describe('HomePage', () => {
  it('renders the main heading', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
```

## Error Handling

### Custom Error Classes

```typescript
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}
```

### Mapping Errors to Responses in a Route Handler

```typescript
import { NextResponse } from 'next/server';
import { AppError, NotFoundError } from '@/lib/errors';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const user = await findUser(id);
    if (!user) throw new NotFoundError('User');
    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.code, message: error.message },
        { status: error.statusCode },
      );
    }
    console.error(error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
```

### Error Boundaries for Pages

Add an `error.tsx` next to a page to catch rendering errors in that segment:

```tsx
// app/dashboard/error.tsx
'use client';

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main>
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </main>
  );
}
```

### Error Handling with Result Pattern

```typescript
type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

export async function fetchUserSafe(id: string): Promise<Result<User>> {
  try {
    const user = await fetchUser(id);
    return { success: true, data: user };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

// Usage
const result = await fetchUserSafe('123');
if (result.success) {
  console.log('User:', result.data);
} else {
  console.error('Error:', result.error.message);
}
```

## Async Patterns

### Promise with Timeout

```typescript
export function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), timeoutMs),
    ),
  ]);
}

// Usage
try {
  const data = await withTimeout(fetchData(), 5000);
  console.log('Data received:', data);
} catch (error) {
  console.error('Failed to fetch data:', error);
}
```

### Retry Pattern

```typescript
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    attempts?: number;
    delay?: number;
    backoff?: number;
  } = {},
): Promise<T> {
  const { attempts = 3, delay = 1000, backoff = 2 } = options;

  let lastError: Error;

  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');

      if (i < attempts - 1) {
        const waitTime = delay * Math.pow(backoff, i);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError || new Error('Unknown error');
}

// Usage
const data = await retry(() => fetch('/api/data').then((r) => r.json()), {
  attempts: 3,
  delay: 1000,
  backoff: 2,
});
```

### Data Fetching in Server Components

```tsx
// app/posts/page.tsx
export default async function PostsPage() {
  const response = await fetch('https://api.example.com/posts', { next: { revalidate: 60 } });
  const posts: Array<{ id: string; title: string }> = await response.json();

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

## Type-Safe Environment Variables

Next.js exposes `NEXT_PUBLIC_*` variables to the browser and keeps everything else server-only. Read them through a single module so typos fail fast:

```typescript
// lib/env.ts
import 'server-only';

function required(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optional(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}

export const env = {
  nodeEnv: optional('NODE_ENV', 'development') as 'development' | 'production' | 'test',
  databaseUrl: required('DATABASE_URL'),
  apiKey: required('API_KEY'),
  enableFeature: optional('ENABLE_FEATURE', 'false') === 'true',
} as const;
```

```typescript
// lib/public-env.ts (safe to import from Client Components)
export const publicEnv = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'my-app',
} as const;
```

Notes:

- `NEXT_PUBLIC_*` values are inlined at build time, so reference them as `process.env.NEXT_PUBLIC_X` literally (no dynamic keys).
- `import 'server-only'` turns an accidental client import into a build error.

## Testing Patterns

### Test Fixtures

```typescript
import { beforeEach, afterEach } from 'vitest';

export function setupTestDatabase() {
  let db: Database;

  beforeEach(async () => {
    db = await createTestDatabase();
    await db.migrate();
  });

  afterEach(async () => {
    await db.close();
    await db.destroy();
  });

  return () => db;
}

// Usage in tests
describe('User Service', () => {
  const getDb = setupTestDatabase();

  it('creates a user', async () => {
    const db = getDb();
    const user = await db.createUser({ name: 'Test' });
    expect(user.id).toBeDefined();
  });
});
```

---

_These patterns are designed to be copied and adapted for your specific needs. `@fast-check/vitest`, `@testing-library/react` and `next` are already installed; add `zod` or `server-only` if you use those snippets._
