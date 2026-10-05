import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";

import { getDb } from "@/db";
import { huntVersions, runs } from "@/db/schema";
import { NotFoundError } from "./errors";

/** Erzeugt ein nicht erratbares Zugangs-Token mit 256 Bit Zufall (ACC-4, PRD 9.1). */
export function generateAccessToken(): string {
  return randomBytes(32).toString("base64url");
}

/**
 * Lädt einen Durchlauf über sein Zugangs-Token für die Spieler-App.
 * Gibt bewusst nur unkritische Felder zurück: keine Lösungen, keine Notfallnummer.
 */
export async function getRunForPlayer(accessToken: string) {
  const [row] = await getDb()
    .select({
      id: runs.id,
      state: runs.state,
      teamName: runs.teamName,
      currentStationId: runs.currentStationId,
      finishedAt: runs.finishedAt,
      snapshot: huntVersions.snapshot,
    })
    .from(runs)
    .innerJoin(huntVersions, eq(huntVersions.id, runs.huntVersionId))
    .where(eq(runs.accessToken, accessToken));
  // Nach Ende des Durchlaufs ist der Link nicht mehr gültig (RUN-3).
  if (!row || row.finishedAt) throw new NotFoundError("Durchlauf nicht gefunden");

  const { hunt } = row.snapshot;
  return {
    id: row.id,
    state: row.state,
    teamName: row.teamName,
    currentStationId: row.currentStationId,
    hunt: {
      title: hunt.title,
      birthdayChildName: hunt.birthdayChildName,
      themeKey: hunt.themeKey,
      themeOverrides: hunt.themeOverrides,
    },
  };
}
