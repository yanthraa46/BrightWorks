import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  const error = vi.spyOn(console, 'error').mockImplementation((...args) => {
    throw new Error(`Unexpected console.error: ${args.join(' ')}`);
  });
  const warn = vi.spyOn(console, 'warn').mockImplementation((...args) => {
    throw new Error(`Unexpected console.warn: ${args.join(' ')}`);
  });

  vi.stubGlobal('consoleErrorSpy', error);
  vi.stubGlobal('consoleWarnSpy', warn);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

export { axe };
