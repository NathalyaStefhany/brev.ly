import '@testing-library/jest-dom/vitest';
import 'vitest-canvas-mock';

Object.defineProperty(document, 'fonts', {
  value: { ready: Promise.resolve({}) },
});

class ResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

global.ResizeObserver = ResizeObserver;
