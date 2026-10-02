import 'vitest';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

// Vitest 5 declares `Assertion<R, T>`; @testing-library/jest-dom 7.0.1 still
// augments the old single-parameter `Assertion<T>`, so its matchers are lost.
// Augment the generic `Matchers<R, T>` interface instead.
declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars
  interface Matchers<R, T> extends TestingLibraryMatchers<unknown, R> {}
}
