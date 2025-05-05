import { randomUUID } from 'node:crypto';
import { InferInsertModel } from 'drizzle-orm';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';

export async function makeShortenedLink(
  overrides?: Partial<InferInsertModel<typeof schema.shortenedLinks>>,
) {
  const shortenedLink = randomUUID().replaceAll('-', '');

  const [result] = await db
    .insert(schema.shortenedLinks)
    .values({
      originalLink: `www.${shortenedLink}.com`,
      shortenedLink,
      ...overrides,
    })
    .returning();

  return result;
}
