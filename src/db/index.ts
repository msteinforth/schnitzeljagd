import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { getDatabaseEnv } from "@/env";
import * as schema from "./schema";

type Database = ReturnType<typeof createDb>;

function createDb() {
  const client = postgres(getDatabaseEnv().DATABASE_URL, { max: 10 });
  return drizzle(client, { schema });
}

// Im Dev-Modus überlebt die Verbindung so Hot Reloads, statt pro Reload einen Pool zu öffnen.
const globalForDb = globalThis as unknown as { db?: Database };

export function getDb(): Database {
  globalForDb.db ??= createDb();
  return globalForDb.db;
}
