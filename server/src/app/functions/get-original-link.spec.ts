import { describe, expect, it } from 'vitest';
import { getOriginalLink } from '@/app/functions/get-original-link';
import { isLeft, isRight, unwrapEither } from '@/shared/either';
import { ShortenedLinkNotAvailable } from '@/app/errors/shortened-link-not-available';
import { makeShortenedLink } from '@/tests/factories/make-shortened-link';

describe('Get original link tests', () => {
  it('should be able to get the original link', async () => {
    const shortenedLinkInfo = await makeShortenedLink();

    const sut = await getOriginalLink(shortenedLinkInfo.shortenedLink);

    expect(isRight(sut)).toBeTruthy();

    const originalLink = unwrapEither(sut);

    expect(originalLink).toStrictEqual({
      originalLink: shortenedLinkInfo.originalLink,
    });
  });

  it('should not be able to get the original link when shortened link does not exist', async () => {
    const sut = await getOriginalLink('1');

    expect(isLeft(sut)).toBeTruthy();

    expect(unwrapEither(sut)).toBeInstanceOf(ShortenedLinkNotAvailable);
  });
});
