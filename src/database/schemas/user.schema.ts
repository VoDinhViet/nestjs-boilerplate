import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { sessions } from './session.schema';

export const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar({ length: 255 }).notNull().unique(),
  full_name: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

/*******************************************************************
 * Relations Users with Sessions - One to Many
 *******************************************************************/
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(sessions),
}));
