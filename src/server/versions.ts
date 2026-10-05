import { asc, eq, inArray, max } from "drizzle-orm";

import { getDb } from "@/db";
import { answers, hints, huntVersions, hunts, puzzles, stations } from "@/db/schema";
import type { HuntSnapshot } from "@/db/types";
import { requireHuntAccess } from "./access";

/** Baut den aktuellen Stand einer Jagd als Snapshot zusammen. */
export async function buildHuntSnapshot(huntId: string): Promise<HuntSnapshot> {
  const db = getDb();
  const [hunt] = await db.select().from(hunts).where(eq(hunts.id, huntId));
  const huntStations = await db
    .select()
    .from(stations)
    .where(eq(stations.huntId, huntId))
    .orderBy(asc(stations.sortOrder), asc(stations.createdAt));

  const stationIds = huntStations.map((s) => s.id);
  const huntPuzzles = stationIds.length
    ? await db.select().from(puzzles).where(inArray(puzzles.stationId, stationIds))
    : [];
  const puzzleIds = huntPuzzles.map((p) => p.id);
  const puzzleAnswers = puzzleIds.length
    ? await db
        .select()
        .from(answers)
        .where(inArray(answers.puzzleId, puzzleIds))
        .orderBy(asc(answers.sortOrder))
    : [];
  const puzzleHints = puzzleIds.length
    ? await db
        .select()
        .from(hints)
        .where(inArray(hints.puzzleId, puzzleIds))
        .orderBy(asc(hints.sortOrder))
    : [];

  return {
    hunt: {
      id: hunt.id,
      title: hunt.title,
      birthdayChildName: hunt.birthdayChildName,
      themeKey: hunt.themeKey,
      themeOverrides: hunt.themeOverrides,
      settings: hunt.settings,
      introMediaId: hunt.introMediaId,
      finaleMediaId: hunt.finaleMediaId,
    },
    stations: huntStations.map((station) => {
      const puzzle = huntPuzzles.find((p) => p.stationId === station.id);
      return {
        id: station.id,
        type: station.type,
        name: station.name,
        lat: station.lat,
        lng: station.lng,
        radiusM: station.radiusM,
        locationHint: station.locationHint,
        message: station.message,
        mediaBeforeId: station.mediaBeforeId,
        mediaAfterId: station.mediaAfterId,
        puzzle: puzzle
          ? {
              id: puzzle.id,
              type: puzzle.type,
              title: puzzle.title,
              question: puzzle.question,
              imageMediaId: puzzle.imageMediaId,
              videoMediaId: puzzle.videoMediaId,
              penaltySeconds: puzzle.penaltySeconds,
              answers: puzzleAnswers
                .filter((a) => a.puzzleId === puzzle.id)
                .map((a) => ({
                  id: a.id,
                  label: a.label,
                  acceptedValues: a.acceptedValues,
                  isFallback: a.isFallback,
                  outcome: a.outcome,
                  targetStationId: a.targetStationId,
                  message: a.message,
                })),
              hints: puzzleHints
                .filter((h) => h.puzzleId === puzzle.id)
                .map((h) => ({ id: h.id, text: h.text, mediaId: h.mediaId })),
            }
          : null,
      };
    }),
  };
}

/** Friert den aktuellen Stand der Jagd als neue Version ein (RUN-5). */
export async function createHuntVersion(userId: string, huntId: string) {
  await requireHuntAccess(userId, huntId, "edit");
  const snapshot = await buildHuntSnapshot(huntId);
  return getDb().transaction(async (tx) => {
    // Sperrt die Jagd, damit parallele Aufrufe nicht dieselbe Versionsnummer vergeben.
    await tx.select({ id: hunts.id }).from(hunts).where(eq(hunts.id, huntId)).for("update");
    const [{ latest }] = await tx
      .select({ latest: max(huntVersions.version) })
      .from(huntVersions)
      .where(eq(huntVersions.huntId, huntId));
    const [version] = await tx
      .insert(huntVersions)
      .values({ huntId, version: (latest ?? 0) + 1, snapshot })
      .returning();
    return version;
  });
}
