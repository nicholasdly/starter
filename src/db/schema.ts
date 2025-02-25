import { InferSelectModel } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";

export const users = pgTable("users", (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
  email: t.text().notNull().unique(),
  passwordHash: t.text().notNull(),
  createdAt: t.timestamp({ withTimezone: true }).notNull().defaultNow(),
}));

export type User = InferSelectModel<typeof users>;

export const sessions = pgTable("sessions", (t) => ({
  id: t.text().primaryKey(),
  userId: t
    .uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  expiresAt: t.timestamp({ withTimezone: true }).notNull(),
  createdAt: t.timestamp({ withTimezone: true }).notNull().defaultNow(),
}));

export type Session = InferSelectModel<typeof sessions>;
