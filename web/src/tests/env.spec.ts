import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('env.ts tests', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should load and validate environment variables correctly', async () => {
    vi.stubEnv('VITE_PORT', '3000');

    const { env } = await import('@/env');

    expect(env.VITE_PORT).toBe(3000);
  });

  it('should set default to 4000 if VITE_PORT is not set', async () => {
    vi.stubEnv('VITE_PORT', undefined);

    const { env } = await import('@/env');

    expect(env.VITE_PORT).toBe(4000);
  });

  it('should throw an error if VITE_PORT is not a number', async () => {
    vi.stubEnv('VITE_PORT', 'port');

    await expect(import('@/env')).rejects.toThrowError(/VITE_PORT/);
  });
});
