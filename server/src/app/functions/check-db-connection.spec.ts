import { describe, expect, it, vi } from 'vitest';
import { isLeft, isRight, unwrapEither } from '@/shared/either';
import { checkDbConnection } from '@/app/functions/check-db-connection';
import { db } from '@/infra/db';

describe('Check DB connection tests', () => {
  it('should check if the connection to the database was successful', async () => {
    const sut = await checkDbConnection();

    expect(isRight(sut)).toBeTruthy();

    if (isRight(sut)) {
      const responseTimeMs = unwrapEither(sut).responseTimeMs;

      expect(typeof responseTimeMs).toBe('number');
    }
  });

  it('should check if the connection to the database has failed', async () => {
    const originalExecute = db.execute;

    db.execute = vi.fn().mockRejectedValue(new Error('Connection failed'));

    const sut = await checkDbConnection();

    expect(isLeft(sut)).toBeTruthy();

    expect(unwrapEither(sut)).toEqual({ error: 'Connection failed' });

    db.execute = originalExecute;
  });
});
