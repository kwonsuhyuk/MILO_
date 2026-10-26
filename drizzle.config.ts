import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

loadEnvConfig(process.cwd());

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL이 없습니다. .env.example을 참고해 .env.local에 설정해 주세요.",
  );
}

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  schemaFilter: ["public"],
  strict: true,
  verbose: true,
  entities: {
    roles: {
      provider: "supabase",
    },
  },
});
