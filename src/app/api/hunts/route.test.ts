import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { createHunt } from "@/server/hunts";
import { createTestUser, hasDatabase } from "@/test/db";
import { GET as getHuntRoute } from "./[huntId]/route";
import { GET as listRoute, POST as createRoute } from "./route";

const session = vi.hoisted(() => ({ userId: null as string | null }));
vi.mock("@/server/auth/session", () => ({ getSessionUserId: async () => session.userId }));

const ctx = (huntId: string) => ({ params: Promise.resolve({ huntId }) });
const jsonRequest = (body: unknown) =>
  new Request("http://localhost/api/hunts", { method: "POST", body: JSON.stringify(body) });

describe.runIf(hasDatabase)("API /api/hunts", () => {
  let owner: { id: string };
  let stranger: { id: string };
  let huntId: string;

  beforeAll(async () => {
    [owner, stranger] = await Promise.all([createTestUser(), createTestUser()]);
    huntId = (await createHunt(owner.id, { title: "API-Jagd", themeKey: "pirates" })).id;
  });

  beforeEach(() => {
    session.userId = null;
  });

  it("antwortet ohne Anmeldung mit 401", async () => {
    expect((await listRoute()).status).toBe(401);
    expect((await getHuntRoute(new Request("http://localhost"), ctx(huntId))).status).toBe(401);
  });

  it("liefert die eigene Jagd", async () => {
    session.userId = owner.id;
    const response = await getHuntRoute(new Request("http://localhost"), ctx(huntId));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ id: huntId, title: "API-Jagd" });
  });

  it("antwortet bei fremder Jagd mit 404", async () => {
    session.userId = stranger.id;
    const response = await getHuntRoute(new Request("http://localhost"), ctx(huntId));
    expect(response.status).toBe(404);
  });

  it("legt eine Jagd an und lehnt ungültige Eingaben mit 400 ab", async () => {
    session.userId = owner.id;
    const created = await createRoute(jsonRequest({ title: "Neue Jagd", themeKey: "space" }));
    expect(created.status).toBe(201);

    expect((await createRoute(jsonRequest({ title: "" }))).status).toBe(400);
    expect(
      (await createRoute(new Request("http://localhost", { method: "POST", body: "{" }))).status,
    ).toBe(400);
  });
});
