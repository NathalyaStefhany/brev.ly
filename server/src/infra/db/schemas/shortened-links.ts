import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';

export const shortenedLinks = pgTable('shortened_links', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  originalLink: text('original_link').notNull(),
  shortenedLink: text('shortened_link').notNull().unique(),
  quantityAccesses: integer('quantity_accesses')
    .$default(() => 0)
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
