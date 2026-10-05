import { ZodError } from "zod";

import { getSessionUserId } from "./auth/session";
import { UnauthorizedError } from "./errors";

/** Wandelt Fehler der Service-Schicht in JSON-Antworten mit passendem Status um. */
export function errorResponse(error: unknown): Response {
  if (error instanceof ZodError) {
    return Response.json({ error: "Ungültige Eingabe", issues: error.issues }, { status: 400 });
  }
  if (error instanceof Error && "status" in error && typeof error.status === "number") {
    return Response.json({ error: error.message }, { status: error.status });
  }
  console.error(error);
  return Response.json({ error: "Interner Fehler" }, { status: 500 });
}

/** Führt einen Admin-Handler mit der angemeldeten Spielleitung aus. */
export async function withUser(handler: (userId: string) => Promise<Response>): Promise<Response> {
  try {
    const userId = await getSessionUserId();
    if (!userId) throw new UnauthorizedError();
    return await handler(userId);
  } catch (error) {
    return errorResponse(error);
  }
}

/** Liest den JSON-Body; ungültiges JSON wird zu einem 400er. */
export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ZodError([
      { code: "custom", path: [], message: "Body ist kein gültiges JSON", input: undefined },
    ]);
  }
}
