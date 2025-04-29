import { z } from 'zod';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { Either, makeRight } from '@/shared/either';

const createShortenedLinkInput = z.object({
  originalLink: z.string().url(),
  shortenedLink: z.string(),
});

type CreateShortenedLinkInput = z.input<typeof createShortenedLinkInput>;

export async function createShortenedLink(
  input: CreateShortenedLinkInput,
): Promise<Either<never, { id: string }>> {
  const { originalLink, shortenedLink } = createShortenedLinkInput.parse(input);

  const shortenedLinksSchema = schema.shortenedLinks;

  const [newShortenedLink] = await db
    .insert(shortenedLinksSchema)
    .values({ originalLink, shortenedLink })
    .returning({ id: shortenedLinksSchema.id });

  return makeRight({ id: newShortenedLink.id });
}
