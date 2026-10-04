import { sql } from "drizzle-orm";

import { getDb } from "@/db";
import { getServerEnv } from "@/env";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await getDb().execute(sql`select 1`);
    return Response.json({ status: "ok", env: getServerEnv().APP_ENV, database: "ok" });
  } catch (error) {
    console.error("Health check failed", error);
    return Response.json({ status: "error", database: "unreachable" }, { status: 503 });
  }
}
