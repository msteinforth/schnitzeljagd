import { asc, desc, eq, inArray, or } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db";
import { collaborators, hunts, stations, themes } from "@/db/schema";
import { requireHuntAccess } from "./access";
import { ValidationError } from "./errors";

const settingsSchema = z
  .object({
    navigationMode: z.enum(["map", "hot_cold"]).optional(),
    penaltySeconds: z.number().int().min(0).max(600).optional(),
  })
  .strict();

export const createHuntSchema = z
  .object({
    title: z.string().trim().min(1).max(120),
    description: z.string().trim().max(2000).nullish(),
    birthdayChildName: z.string().trim().max(80).nullish(),
    birthdayChildAge: z.number().int().min(1).max(18).nullish(),
    eventDate: z.coerce.date().nullish(),
    themeKey: z.string().min(1),
    settings: settingsSchema.optional(),
  })
  .strict();

export const updateHuntSchema = createHuntSchema
  .partial()
  .extend({ status: z.enum(["draft", "published", "archived"]).optional() })
  .strict();

export type CreateHuntInput = z.input<typeof createHuntSchema>;
export type UpdateHuntInput = z.input<typeof updateHuntSchema>;

/** Alle Jagden, die der Nutzer besitzt oder beobachtet. */
export async function listHunts(userId: string) {
  const db = getDb();
  const shared = db
    .select({ huntId: collaborators.huntId })
    .from(collaborators)
    .where(eq(collaborators.userId, userId));
  return db
    .select()
    .from(hunts)
    .where(or(eq(hunts.ownerId, userId), inArray(hunts.id, shared)))
    .orderBy(desc(hunts.updatedAt));
}

/** Eine Jagd mit ihren Stationen. */
export async function getHunt(userId: string, huntId: string) {
  const role = await requireHuntAccess(userId, huntId, "view");
  const db = getDb();
  const [hunt] = await db.select().from(hunts).where(eq(hunts.id, huntId));
  const huntStations = await db
    .select()
    .from(stations)
    .where(eq(stations.huntId, huntId))
    .orderBy(asc(stations.sortOrder), asc(stations.createdAt));
  return { ...hunt, role, stations: huntStations };
}

async function assertThemeExists(themeKey: string) {
  const [theme] = await getDb()
    .select({ key: themes.key })
    .from(themes)
    .where(eq(themes.key, themeKey));
  if (!theme) throw new ValidationError(`Unbekanntes Theme: ${themeKey}`);
}

export async function createHunt(userId: string, input: CreateHuntInput) {
  const data = createHuntSchema.parse(input);
  await assertThemeExists(data.themeKey);
  const [hunt] = await getDb()
    .insert(hunts)
    .values({ ...data, ownerId: userId })
    .returning();
  return hunt;
}

export async function updateHunt(userId: string, huntId: string, input: UpdateHuntInput) {
  await requireHuntAccess(userId, huntId, "edit");
  const data = updateHuntSchema.parse(input);
  if (data.themeKey) await assertThemeExists(data.themeKey);
  if (Object.keys(data).length === 0) {
    const [hunt] = await getDb().select().from(hunts).where(eq(hunts.id, huntId));
    return hunt;
  }
  const [hunt] = await getDb().update(hunts).set(data).where(eq(hunts.id, huntId)).returning();
  return hunt;
}

export async function deleteHunt(userId: string, huntId: string) {
  await requireHuntAccess(userId, huntId, "edit");
  await getDb().delete(hunts).where(eq(hunts.id, huntId));
}
