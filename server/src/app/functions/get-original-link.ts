import { ShortenedLinkNotAvailable } from '@/app/errors/shortened-link-not-available';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { Either, makeLeft, makeRight } from '@/shared/either';
import { eq } from 'drizzle-orm';

export async function getOriginalLink(
  shortenedLink: string,
): Promise<Either<ShortenedLinkNotAvailable, { originalLink: string }>> {
  const shortenedLinksSchema = schema.shortenedLinks;

  const [shortenedLinkInfo] = await db
    .select({ originalLink: shortenedLinksSchema.originalLink })
    .from(shortenedLinksSchema)
    .where(eq(shortenedLinksSchema.shortenedLink, shortenedLink));

  if (!shortenedLinkInfo) {
    return makeLeft(new ShortenedLinkNotAvailable());
  }

  return makeRight({ originalLink: shortenedLinkInfo.originalLink });
}
