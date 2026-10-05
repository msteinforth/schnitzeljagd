/**
 * Liefert die ID der angemeldeten Spielleitung oder `null`.
 * Login und Sessions kommen mit #5; bis dahin ist niemand angemeldet und
 * alle Admin-Routen antworten mit 401.
 */
export async function getSessionUserId(): Promise<string | null> {
  return null;
}
