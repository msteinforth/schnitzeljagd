import { beforeAll, describe, expect, it } from "vitest";
import { ZodError } from "zod";

import { getDb } from "@/db";
import { collaborators } from "@/db/schema";
import { createTestUser, hasDatabase } from "@/test/db";
import { ForbiddenError, NotFoundError, ValidationError } from "./errors";
import { createHunt, deleteHunt, getHunt, listHunts, updateHunt } from "./hunts";

describe.runIf(hasDatabase)("Jagden und Zugriffsrechte", () => {
  let owner: { id: string };
  let stranger: { id: string };
  let observer: { id: string };
  let huntId: string;

  beforeAll(async () => {
    [owner, stranger, observer] = await Promise.all([
      createTestUser(),
      createTestUser(),
      createTestUser(),
    ]);
    const hunt = await createHunt(owner.id, { title: "Ritter Leos Schatz", themeKey: "knights" });
    huntId = hunt.id;
    await getDb().insert(collaborators).values({ huntId, userId: observer.id, role: "observer" });
  });

  it("legt eine Jagd als Entwurf für die Spielleitung an", async () => {
    const hunt = await getHunt(owner.id, huntId);
    expect(hunt).toMatchObject({ title: "Ritter Leos Schatz", status: "draft", role: "owner" });
    expect(hunt.stations).toEqual([]);
  });

  it("listet eigene und beobachtete Jagden, aber keine fremden", async () => {
    expect((await listHunts(owner.id)).map((h) => h.id)).toContain(huntId);
    expect((await listHunts(observer.id)).map((h) => h.id)).toContain(huntId);
    expect((await listHunts(stranger.id)).map((h) => h.id)).not.toContain(huntId);
  });

  it("verbirgt fremde Jagden mit NotFound", async () => {
    await expect(getHunt(stranger.id, huntId)).rejects.toBeInstanceOf(NotFoundError);
    await expect(updateHunt(stranger.id, huntId, { title: "x" })).rejects.toBeInstanceOf(
      NotFoundError,
    );
    await expect(deleteHunt(stranger.id, huntId)).rejects.toBeInstanceOf(NotFoundError);
  });

  it("lässt Beobachter lesen, aber nicht ändern", async () => {
    expect((await getHunt(observer.id, huntId)).role).toBe("observer");
    await expect(updateHunt(observer.id, huntId, { title: "x" })).rejects.toBeInstanceOf(
      ForbiddenError,
    );
    await expect(deleteHunt(observer.id, huntId)).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("behandelt IDs, die keine UUID sind, als nicht gefunden", async () => {
    await expect(getHunt(owner.id, "keine-uuid")).rejects.toBeInstanceOf(NotFoundError);
  });

  it("prüft Eingaben und Theme", async () => {
    await expect(createHunt(owner.id, { title: "", themeKey: "knights" })).rejects.toBeInstanceOf(
      ZodError,
    );
    await expect(
      createHunt(owner.id, { title: "Jagd", themeKey: "unicorns" }),
    ).rejects.toBeInstanceOf(ValidationError);
    await expect(
      updateHunt(owner.id, huntId, { ownerId: stranger.id } as never),
    ).rejects.toBeInstanceOf(ZodError);
  });

  it("akzeptiert ein leeres Update ohne Änderungen", async () => {
    expect(await updateHunt(owner.id, huntId, {})).toMatchObject({ id: huntId });
  });

  it("aktualisiert und löscht eine Jagd als Besitzer", async () => {
    const updated = await updateHunt(owner.id, huntId, {
      title: "Dino-Abenteuer",
      themeKey: "dinos",
      settings: { navigationMode: "hot_cold" },
    });
    expect(updated).toMatchObject({ title: "Dino-Abenteuer", themeKey: "dinos" });
    expect(updated.settings).toEqual({ navigationMode: "hot_cold" });

    await deleteHunt(owner.id, huntId);
    await expect(getHunt(owner.id, huntId)).rejects.toBeInstanceOf(NotFoundError);
  });
});
