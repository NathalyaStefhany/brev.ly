import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { Either, makeRight } from '@/shared/either';
import { count, desc } from 'drizzle-orm';
import { z } from 'zod';

const getShortenedLinksInput = z.object({
  page: z.number().min(1).optional().default(1),
  pageSize: z.number().optional().default(20),
});

type GetShortenedLinksInput = z.input<typeof getShortenedLinksInput>;

type GetShortenedLinkOutput = {
  total: number;
  data: {
    id: string;
    originalLink: string;
    shortenedLink: string;
    quantityAccesses: number;
    createdAt: Date;
  }[];
};

export async function getShortenedLinks(
  input: GetShortenedLinksInput,
): Promise<Either<never, GetShortenedLinkOutput>> {
  const { page, pageSize } = getShortenedLinksInput.parse(input);

  const shortenedLinksSchema = schema.shortenedLinks;

  const [shortenedLinks, [{ total }]] = await Promise.all([
    db
      .select({
        id: shortenedLinksSchema.id,
        originalLink: shortenedLinksSchema.originalLink,
        shortenedLink: shortenedLinksSchema.shortenedLink,
        quantityAccesses: shortenedLinksSchema.quantityAccesses,
        createdAt: shortenedLinksSchema.createdAt,
      })
      .from(shortenedLinksSchema)
      .orderBy(desc(shortenedLinksSchema.createdAt))
      .offset((page - 1) * pageSize)
      .limit(pageSize),
    db
      .select({
        total: count(shortenedLinksSchema.id),
      })
      .from(shortenedLinksSchema),
  ]);

  return makeRight({ total, data: shortenedLinks });
}
