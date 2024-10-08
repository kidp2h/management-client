import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const religions = pgTable('religions', {
  id: uuid('id').default('gen_random_uuid()').primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const bloodType = pgTable('blood_type', {
  id: uuid('id').primaryKey(),
  type: text('code').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export type Religions = typeof religions.$inferSelect;
export type BloodType = typeof bloodType.$inferSelect;
