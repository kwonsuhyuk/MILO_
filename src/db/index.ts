import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("서버 환경변수 DATABASE_URL이 설정되지 않았습니다.");
}

const client = postgres(databaseUrl, { prepare: false });

export const db = drizzle({ client });
