/** Ressource existiert nicht oder ist für den Nutzer unsichtbar (fremde Jagd → 404). */
export class NotFoundError extends Error {
  readonly status = 404;
  constructor(message = "Nicht gefunden") {
    super(message);
  }
}

/** Nutzer sieht die Ressource, darf sie aber nicht ändern (z. B. Beobachter). */
export class ForbiddenError extends Error {
  readonly status = 403;
  constructor(message = "Keine Berechtigung") {
    super(message);
  }
}

export class UnauthorizedError extends Error {
  readonly status = 401;
  constructor(message = "Nicht angemeldet") {
    super(message);
  }
}

/** Ungültige Eingabe, die sich nicht schon mit zod prüfen lässt. */
export class ValidationError extends Error {
  readonly status = 400;
}
