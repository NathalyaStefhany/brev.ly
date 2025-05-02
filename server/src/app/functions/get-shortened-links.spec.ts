import { getShortenedLinks } from '@/app/functions/get-shortened-links';
import { isRight, unwrapEither } from '@/shared/either';
import { makeShortenedLink } from '@/tests/factories/make-shortened-link';
import { beforeAll, describe, expect, it } from 'vitest';

describe('Get shortened links tests', () => {
  beforeAll(async () => {
    await makeShortenedLink();
    await makeShortenedLink();
    await makeShortenedLink();
    await makeShortenedLink();
    await makeShortenedLink();
  });

  it('should be able to get all shortened links', async () => {
    const sut = await getShortenedLinks({});

    const result = unwrapEither(sut);

    expect(isRight(sut)).toBeTruthy();
    expect(result.total).toBeGreaterThan(5);
    expect(result.data.length).toBeGreaterThanOrEqual(5);

    expect(result.data[0]).toHaveProperty('id');
    expect(result.data[0]).toHaveProperty('originalLink');
    expect(result.data[0]).toHaveProperty('shortenedLink');
    expect(result.data[0]).toHaveProperty('quantityAccesses');
    expect(result.data[0]).toHaveProperty('createdAt');

    for (let i = 0; i < result.data.length - 1; i++) {
      expect(
        new Date(result.data[i].createdAt) >=
          new Date(result.data[i + 1].createdAt),
      ).toBeTruthy();
    }
  });

  it('should be able to get shortened links with pagination', async () => {
    const sut = await getShortenedLinks({ page: 2, pageSize: 2 });

    const result = unwrapEither(sut);

    expect(isRight(sut)).toBeTruthy();
    expect(result.total).toBeGreaterThan(5);
    expect(result.data).length(2);

    expect(
      new Date(result.data[0].createdAt) >= new Date(result.data[1].createdAt),
    ).toBeTruthy();
  });
});
