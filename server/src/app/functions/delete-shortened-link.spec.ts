import { describe, expect, it } from 'vitest';
import { randomUUID } from 'node:crypto';
import { deleteShortenedLink } from '@/app/functions/delete-shortened-link';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { isLeft, isRight, unwrapEither } from '@/shared/either';
import { ShortenedLinkNotAvailable } from '@/app/errors/shortened-link-not-available';

describe('Delete shortened link tests', () => {
  it('should be able to delete a shortened link', async () => {
    const shortenedLink = randomUUID().replaceAll('-', '');

    const [shortenedLinkInfo] = await db
      .insert(schema.shortenedLinks)
      .values({ originalLink: 'https://test.com', shortenedLink })
      .returning();

    const sut = await deleteShortenedLink(shortenedLinkInfo.id);

    expect(isRight(sut)).toBeTruthy();

    const deletedShortenedLinkInfo = unwrapEither(sut);

    expect(deletedShortenedLinkInfo).toStrictEqual(shortenedLinkInfo);
  });

  it('should not be able to delete a shortened link when id does not exist', async () => {
    const sut = await deleteShortenedLink('1');

    expect(isLeft(sut)).toBeTruthy();

    expect(unwrapEither(sut)).toBeInstanceOf(ShortenedLinkNotAvailable);
  });
});
