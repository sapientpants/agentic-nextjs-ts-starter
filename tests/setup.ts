import '@testing-library/jest-dom';
import './vitest-jest-dom';

// Mock Next.js environment variables for tests.
// Deliberately different from the hardcoded fallback in the app so tests can
// tell the "read from env" path apart from the "use default" path.
process.env.NEXT_PUBLIC_APP_NAME = 'test-app';
