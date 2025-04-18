import '@testing-library/jest-dom/vitest';
import 'vitest-canvas-mock';

Object.defineProperty(document, 'fonts', {
  value: { ready: Promise.resolve({}) },
});
