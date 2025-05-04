import { describe, expect, it } from 'vitest';
import { isLeft, isRight, unwrapEither } from '@/shared/either';
import { ShortenedLinkNotAvailable } from '@/app/errors/shortened-link-not-available';
import { makeShortenedLink } from '@/tests/factories/make-shortened-link';
import { updateAccessQuantity } from '@/app/functions/update-access-quantity';

describe('Update access quantity tests', () => {
  it('should be able to update access quantity', async () => {
    const shortenedLinkInfo = await makeShortenedLink();

    const sut = await updateAccessQuantity(shortenedLinkInfo.shortenedLink);

    expect(isRight(sut)).toBeTruthy();

    const result = unwrapEither(sut);

    expect(result).toStrictEqual({
      originalLink: shortenedLinkInfo.originalLink,
      shortenedLink: shortenedLinkInfo.shortenedLink,
      quantityAccesses: 1,
    });
  });

  it('should not be able to update access quantity when shortened link does not exist', async () => {
    const sut = await updateAccessQuantity('1');

    expect(isLeft(sut)).toBeTruthy();

    expect(unwrapEither(sut)).toBeInstanceOf(ShortenedLinkNotAvailable);
  });
});
