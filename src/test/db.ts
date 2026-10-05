import { randomUUID } from "node:crypto";

import { getDb } from "@/db";
import { users } from "@/db/schema";

/** Datenbanktests laufen nur, wenn eine Datenbank konfiguriert ist (lokal via .env, in CI immer). */
export const hasDatabase = Boolean(process.env.DATABASE_URL);

export async function createTestUser() {
  const [user] = await getDb()
    .insert(users)
    .values({ email: `test-${randomUUID()}@example.test`, name: "Test" })
    .returning();
  return user;
}
