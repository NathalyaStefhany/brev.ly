import { describe, expect, it, vi } from 'vitest';
import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { createShortenedLink } from '@/app/functions/create-shortened-link';
import { isLeft, isRight, unwrapEither } from '@/shared/either';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { DuplicateShortenedLink } from '@/app/errors/duplicate-shortened-link';
import { ZodError } from 'zod';

describe('Create shortened link tests', () => {
  it('should be able to create a shortened link', async () => {
    const shortenedLink = randomUUID().replaceAll('-', '');

    const sut = await createShortenedLink({
      originalLink: 'https://test.com',
      shortenedLink,
    });

    expect(isRight(sut)).toBeTruthy();

    const result = await db
      .select()
      .from(schema.shortenedLinks)
      .where(eq(schema.shortenedLinks.shortenedLink, shortenedLink));

    expect(result).toHaveLength(1);
  });

  it('should not be able to create a shortened link when it has an invalid original link', async () => {
    const error = await createShortenedLink({
      originalLink: 'test',
      shortenedLink: 'test',
    }).catch((e) => e);

    expect(error).toBeInstanceOf(ZodError);

    expect((error as ZodError).errors[0].message).toContain('Invalid url');
  });

  it('should not be able to create a shortened link when it has an invalid shortened link', async () => {
    const error = await createShortenedLink({
      originalLink: 'https://test.com',
      shortenedLink: 'test/123',
    }).catch((e) => e);

    expect(error).toBeInstanceOf(ZodError);

    expect((error as ZodError).errors[0].message).toContain(
      'The provided shortened link is invalid. It must be lowercase, and cannot contain spaces or special characters.',
    );
  });

  it('should not be able to create a shortened link when it already exists', async () => {
    const [{ shortenedLink }] = await db
      .select()
      .from(schema.shortenedLinks)
      .limit(1);

    const sut = await createShortenedLink({
      originalLink: 'https://test.com',
      shortenedLink,
    });

    expect(isLeft(sut)).toBeTruthy();

    expect(unwrapEither(sut)).toBeInstanceOf(DuplicateShortenedLink);
  });

  it('should not be able to create a shortened link when it fails', async () => {
    const originalExecute = db.insert;

    db.insert = vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockRejectedValue(new Error('Creation failure')),
      }),
    });

    await expect(
      createShortenedLink({
        originalLink: 'https://test.com',
        shortenedLink: 'test',
      }),
    ).rejects.toThrow('Creation failure');

    db.insert = originalExecute;
  });
});
