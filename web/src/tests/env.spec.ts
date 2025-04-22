import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('env.ts tests', () => {
  beforeEach(() => {
    vi.resetModules();

    vi.stubEnv('VITE_SENTRY_ORG', 'org');
    vi.stubEnv('VITE_SENTRY_PROJECT', 'project');
    vi.stubEnv('VITE_SENTRY_DSN', 'https://dsn.com');
    vi.stubEnv('VITE_SENTRY_AUTH_TOKEN', 'token');
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

  it('should throw an error if VITE_SENTRY_DSN is not a valid url', async () => {
    vi.stubEnv('VITE_SENTRY_DSN', 'dsn');

    await expect(import('@/env')).rejects.toThrowError(/VITE_SENTRY_DSN/);
  });

  it('should throw an error if VITE_SENTRY_ORG is empty', async () => {
    vi.stubEnv('VITE_SENTRY_ORG', undefined);

    await expect(import('@/env')).rejects.toThrowError(/VITE_SENTRY_ORG/);
  });

  it('should throw an error if VITE_SENTRY_PROJECT is empty', async () => {
    vi.stubEnv('VITE_SENTRY_PROJECT', undefined);

    await expect(import('@/env')).rejects.toThrowError(/VITE_SENTRY_PROJECT/);
  });

  it('should throw an error if VITE_SENTRY_AUTH_TOKEN is empty', async () => {
    vi.stubEnv('VITE_SENTRY_AUTH_TOKEN', undefined);

    await expect(import('@/env')).rejects.toThrowError(
      /VITE_SENTRY_AUTH_TOKEN/,
    );
  });
});
