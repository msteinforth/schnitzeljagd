import { beforeAll, describe, expect, it } from "vitest";

import { getDb } from "@/db";
import { collaborators } from "@/db/schema";
import { createTestUser, hasDatabase } from "@/test/db";
import { createHuntWithPuzzle } from "@/test/fixtures";
import { ForbiddenError, NotFoundError } from "./errors";
import { createHuntVersion } from "./versions";

describe.runIf(hasDatabase)("Versionen einer Jagd", () => {
  let owner: { id: string };
  let fixture: Awaited<ReturnType<typeof createHuntWithPuzzle>>;

  beforeAll(async () => {
    owner = await createTestUser();
    fixture = await createHuntWithPuzzle(owner.id);
  });

  it("friert Stationen, Rätsel, Antworten und Tipps in einem Snapshot ein", async () => {
    const version = await createHuntVersion(owner.id, fixture.hunt.id);
    const { snapshot } = version;

    expect(version.version).toBe(1);
    expect(snapshot.hunt).toMatchObject({ id: fixture.hunt.id, themeKey: "knights" });
    expect(snapshot.stations.map((s) => s.type)).toEqual(["start", "wrong", "finish"]);

    const puzzle = snapshot.stations[0].puzzle!;
    expect(puzzle.answers.map((a) => [a.label, a.outcome])).toEqual([
      ["4", "next_station"],
      ["6", "wrong_place"],
      ["8", "wrong_message"],
    ]);
    expect(puzzle.answers[1].targetStationId).toBe(fixture.wrong.id);
    expect(puzzle.hints.map((h) => h.text)).toEqual(["Zähl genau!", "Es sind weniger als 5."]);
    expect(snapshot.stations[1]).toMatchObject({
      message: "Hier schläft nur ein Drache …",
      puzzle: null,
    });
  });

  it("zählt die Versionsnummer hoch, auch bei parallelen Aufrufen", async () => {
    const results = await Promise.all([
      createHuntVersion(owner.id, fixture.hunt.id),
      createHuntVersion(owner.id, fixture.hunt.id),
    ]);
    expect(results.map((v) => v.version).sort()).toEqual([2, 3]);
  });

  it("erlaubt nur dem Besitzer, Versionen anzulegen", async () => {
    const [observer, stranger] = await Promise.all([createTestUser(), createTestUser()]);
    await getDb()
      .insert(collaborators)
      .values({ huntId: fixture.hunt.id, userId: observer.id, role: "observer" });

    await expect(createHuntVersion(observer.id, fixture.hunt.id)).rejects.toBeInstanceOf(
      ForbiddenError,
    );
    await expect(createHuntVersion(stranger.id, fixture.hunt.id)).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
