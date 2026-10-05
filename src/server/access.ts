import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db";
import { collaborators, hunts } from "@/db/schema";
import { ForbiddenError, NotFoundError } from "./errors";

export type HuntRole = "owner" | "observer";

/** Rolle des Nutzers in einer Jagd oder `null`, wenn er keinen Zugriff hat. */
export async function getHuntRole(userId: string, huntId: string): Promise<HuntRole | null> {
  // IDs aus der URL, die keine UUID sind, können zu keiner Jagd gehören.
  if (!z.uuid().safeParse(huntId).success) return null;
  const [hunt] = await getDb()
    .select({ ownerId: hunts.ownerId, role: collaborators.role })
    .from(hunts)
    .leftJoin(
      collaborators,
      and(eq(collaborators.huntId, hunts.id), eq(collaborators.userId, userId)),
    )
    .where(eq(hunts.id, huntId));
  if (!hunt) return null;
  if (hunt.ownerId === userId) return "owner";
  return hunt.role;
}

/**
 * Stellt sicher, dass der Nutzer die Jagd sehen (`view`) bzw. bearbeiten (`edit`) darf.
 * Fremde Jagden melden 404, damit ihre Existenz nicht verraten wird.
 */
export async function requireHuntAccess(
  userId: string,
  huntId: string,
  access: "view" | "edit",
): Promise<HuntRole> {
  const role = await getHuntRole(userId, huntId);
  if (!role) throw new NotFoundError("Jagd nicht gefunden");
  if (access === "edit" && role !== "owner") throw new ForbiddenError();
  return role;
}
