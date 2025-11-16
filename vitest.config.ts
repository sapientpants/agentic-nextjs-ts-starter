import react from '@vitejs/plugin-react';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    exclude: [...configDefaults.exclude, '**/.next/**'],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary', 'lcov'],
      exclude: [
        'coverage/**',
        '.next/**',
        '*.config.js',
        '*.config.ts',
        '.*.js',
        '**/*.d.ts',
        'tests/**',
        'test/**',
        '**/*.spec.ts',
        '**/*.test.ts',
        'docs/**',
        '.github/**',
        '.changeset/**',
        '.claude/**',
        'node_modules/**',
        'app/layout.tsx', // Layout wrapper - difficult to test in isolation
        'app/globals.css', // CSS file
      ],
      thresholds: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
  },
});
