import { eq } from "drizzle-orm";
import { beforeAll, describe, expect, it } from "vitest";

import { getDb } from "@/db";
import { runs } from "@/db/schema";
import { createTestUser, hasDatabase } from "@/test/db";
import { createHuntWithPuzzle } from "@/test/fixtures";
import { NotFoundError } from "./errors";
import { generateAccessToken, getRunForPlayer } from "./runs";
import { createHuntVersion } from "./versions";

describe("generateAccessToken", () => {
  it("erzeugt URL-taugliche Tokens mit 256 Bit", () => {
    const token = generateAccessToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(new Set(Array.from({ length: 100 }, generateAccessToken)).size).toBe(100);
  });
});

describe.runIf(hasDatabase)("Durchlauf für die Spieler-App", () => {
  let runId: string;
  let accessToken: string;

  beforeAll(async () => {
    const owner = await createTestUser();
    const { hunt, start } = await createHuntWithPuzzle(owner.id);
    const version = await createHuntVersion(owner.id, hunt.id);
    accessToken = generateAccessToken();
    const [run] = await getDb()
      .insert(runs)
      .values({
        huntVersionId: version.id,
        createdBy: owner.id,
        accessToken,
        emergencyPhone: "+491701234567",
        teamName: "Die Drachenjäger",
        currentStationId: start.id,
      })
      .returning();
    runId = run.id;
  });

  it("liefert den Durchlauf über das Token ohne Lösungen und Notfallnummer", async () => {
    const run = await getRunForPlayer(accessToken);
    expect(run).toMatchObject({
      id: runId,
      state: "navigating",
      teamName: "Die Drachenjäger",
      hunt: { title: "Testjagd", themeKey: "knights" },
    });
    const json = JSON.stringify(run);
    expect(json).not.toContain("+491701234567");
    expect(json).not.toContain("next_station");
    expect(json).not.toContain("Zinnen");
  });

  it("lehnt unbekannte Tokens ab", async () => {
    await expect(getRunForPlayer(generateAccessToken())).rejects.toBeInstanceOf(NotFoundError);
  });

  it("lehnt Tokens beendeter Durchläufe ab", async () => {
    await getDb().update(runs).set({ finishedAt: new Date() }).where(eq(runs.id, runId));
    await expect(getRunForPlayer(accessToken)).rejects.toBeInstanceOf(NotFoundError);
  });
});
