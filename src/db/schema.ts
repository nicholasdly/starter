import { InferSelectModel } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";

export const users = pgTable("users", (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
}));

export type User = InferSelectModel<typeof users>;
