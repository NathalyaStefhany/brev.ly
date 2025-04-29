import { z } from 'zod';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { Either, makeLeft, makeRight } from '@/shared/either';
import { DuplicateShortenedLink } from '@/app/errors/duplicate-shortened-link';
import postgres from 'postgres';
import { InternalServerError } from '@/app/errors/internal-server-error';
import { createShortenedLinkInputSchema } from '@/app/schemas/create-shortened-link';

type CreateShortenedLinkInput = z.input<typeof createShortenedLinkInputSchema>;

export async function createShortenedLink(
  input: CreateShortenedLinkInput,
): Promise<
  Either<DuplicateShortenedLink | InternalServerError, { id: string }>
> {
  const { originalLink, shortenedLink } =
    createShortenedLinkInputSchema.parse(input);

  const shortenedLinksSchema = schema.shortenedLinks;

  try {
    const [newShortenedLink] = await db
      .insert(shortenedLinksSchema)
      .values({ originalLink, shortenedLink })
      .returning({ id: shortenedLinksSchema.id });

    return makeRight({ id: newShortenedLink.id });
  } catch (error) {
    let code = '0';

    if (error instanceof postgres.PostgresError) {
      code = error.code;
    }

    if (code === '23505') {
      return makeLeft(new DuplicateShortenedLink());
    }

    return makeLeft(new InternalServerError());
  }
}
