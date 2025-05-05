import { describe, expect, it } from 'vitest';
import { deleteShortenedLink } from '@/app/functions/delete-shortened-link';
import { isLeft, isRight, unwrapEither } from '@/shared/either';
import { ShortenedLinkNotAvailable } from '@/app/errors/shortened-link-not-available';
import { makeShortenedLink } from '@/tests/factories/make-shortened-link';

describe('Delete shortened link tests', () => {
  it('should be able to delete a shortened link', async () => {
    const shortenedLinkInfo = await makeShortenedLink();

    const sut = await deleteShortenedLink(shortenedLinkInfo.shortenedLink);

    expect(isRight(sut)).toBeTruthy();

    const deletedShortenedLinkInfo = unwrapEither(sut);

    expect(deletedShortenedLinkInfo).toStrictEqual(shortenedLinkInfo);
  });

  it('should not be able to delete a shortened link when shortened link does not exist', async () => {
    const sut = await deleteShortenedLink('1');

    expect(isLeft(sut)).toBeTruthy();

    expect(unwrapEither(sut)).toBeInstanceOf(ShortenedLinkNotAvailable);
  });
});
