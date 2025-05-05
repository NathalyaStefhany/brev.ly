import { ShortenedLinkNotAvailable } from '@/app/errors/shortened-link-not-available';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { Either, makeLeft, makeRight } from '@/shared/either';
import { eq } from 'drizzle-orm';

type DeleteShortenedLinkOutput = {
  id: string;
  originalLink: string;
  shortenedLink: string;
  quantityAccesses: number;
  createdAt: Date;
};

export async function deleteShortenedLink(
  shortenedLink: string,
): Promise<Either<ShortenedLinkNotAvailable, DeleteShortenedLinkOutput>> {
  const shortenedLinksSchema = schema.shortenedLinks;

  const deletedInfo = await db
    .delete(shortenedLinksSchema)
    .where(eq(shortenedLinksSchema.shortenedLink, shortenedLink))
    .returning();

  if (deletedInfo.length) {
    return makeRight(deletedInfo[0]);
  }

  return makeLeft(new ShortenedLinkNotAvailable());
}
