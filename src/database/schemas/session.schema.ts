import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './user.schema';

export const sessions = pgTable('sessions', {
  id: uuid().primaryKey().defaultRandom(),
  hash: varchar({ length: 255 }).notNull(),
  created_at: timestamp().notNull().defaultNow(),
  author_id: uuid().notNull(),
  updated_at: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

/*******************************************************************
 * Relations Sessions with Users - Many to One
 *******************************************************************/
export const sessionsRelations = relations(sessions, ({ one }) => ({
  author: one(users, {
    fields: [sessions.author_id],
    references: [users.id],
  }),
}));
