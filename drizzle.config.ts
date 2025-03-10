import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: [".env", ".env.local"] });

export default defineConfig({
  schema: "src/db/schema.ts",
  out: "src/db/migrations/",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    // biome-ignore lint/style/noNonNullAssertion: Necessary since we're unable to use type-safe environment variables here.
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
