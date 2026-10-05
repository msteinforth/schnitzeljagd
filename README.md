# Schnitzeljagd

Web-App zum Planen und Spielen von Schnitzeljagden für Kindergeburtstage. Anforderungen: [`docs/PRD.md`](docs/PRD.md).

## Stack

| Bereich    | Technik                                                                          |
| ---------- | -------------------------------------------------------------------------------- |
| Web-App    | Next.js 16 (App Router), React 19, TypeScript                                    |
| Bereiche   | `/admin` (Planung), `/play` (Spieler-App)                                        |
| Datenbank  | PostgreSQL 16, Drizzle ORM, Migrationen mit drizzle-kit                          |
| Medien     | S3-kompatibler Objektspeicher (lokal MinIO), private Buckets mit signierten URLs |
| i18n       | next-intl, v1 nur Deutsch (`messages/de.json`)                                   |
| Qualität   | ESLint, Prettier, Vitest, GitHub Actions                                         |
| Deployment | Docker-Image (Next.js-Standalone)                                                |

## Lokale Entwicklung

Voraussetzungen: Node.js 22, pnpm 10, Docker.

```bash
pnpm install
cp .env.example .env
docker compose up -d      # PostgreSQL + MinIO (Bucket wird automatisch angelegt)
pnpm db:migrate
pnpm db:seed         # optional: Beispieljagd „Ritter Leos Schatz“
pnpm dev
```

- App: <http://localhost:3000> (`/admin`, `/play`)
- Health-Check: <http://localhost:3000/api/health>
- MinIO-Konsole: <http://localhost:9001> (Login `schnitzeljagd` / `schnitzeljagd-secret`)

## Skripte

| Befehl                              | Zweck                                     |
| ----------------------------------- | ----------------------------------------- |
| `pnpm dev`                          | Entwicklungsserver                        |
| `pnpm build` / `pnpm start`         | Produktions-Build und -Server             |
| `pnpm lint`                         | ESLint                                    |
| `pnpm typecheck`                    | TypeScript-Prüfung                        |
| `pnpm test`                         | Tests (Vitest), Datenbanktests mit `.env` |
| `pnpm format` / `pnpm format:check` | Prettier                                  |
| `pnpm db:generate`                  | Migration aus `src/db/schema.ts` erzeugen |
| `pnpm db:migrate`                   | Migrationen anwenden                      |
| `pnpm db:studio`                    | Drizzle Studio                            |
| `pnpm db:seed`                      | Beispieljagd anlegen                      |

## Struktur

```
src/
  app/
    admin/        Admin-Oberfläche
    play/         Spieler-App
    api/          REST-API (siehe unten)
  db/             Drizzle-Schema, Datenbank-Client, Seed-Skript
  server/         Service-Schicht mit Zugriffsprüfung (Jagden, Versionen, Durchläufe)
  test/           Test-Helfer und Fixtures
  i18n/           next-intl-Konfiguration
  lib/storage.ts  S3-Client und signierte Upload-/Download-URLs
  env.ts          Validierung der Umgebungsvariablen
messages/         Übersetzungen
drizzle/          SQL-Migrationen
```

## Datenmodell und API

Das Schema in `src/db/schema.ts` bildet die Kern-Entitäten aus PRD 8.2 ab. Die Geschäftslogik liegt in `src/server/`; Route Handler und künftige Server Actions rufen nur diese Schicht auf.

**Zugriffsregeln**

- Die Spielleitung sieht und bearbeitet nur eigene Jagden. Beobachter (`collaborators`) dürfen lesen, aber nicht ändern (403).
- Fremde oder unbekannte Jagden liefern 404, damit ihre Existenz nicht verraten wird.
- Die Spieler-App greift nur über das geheime Durchlauf-Token zu und bekommt weder Lösungen noch die Notfallnummer.
- Beim Durchlaufstart wird die Jagd als `hunt_versions.snapshot` eingefroren.

| Methode                    | Pfad                  | Zweck                                        |
| -------------------------- | --------------------- | -------------------------------------------- |
| `GET` / `POST`             | `/api/hunts`          | Eigene und beobachtete Jagden / Jagd anlegen |
| `GET` / `PATCH` / `DELETE` | `/api/hunts/{huntId}` | Jagd mit Stationen lesen / ändern / löschen  |
| `GET`                      | `/api/play/{token}`   | Durchlauf für die Spieler-App                |
| `GET`                      | `/api/health`         | Health-Check                                 |

Bis Login und Sessions mit #5 kommen, antworten die Admin-Routen mit 401.

## Umgebungsvariablen

Siehe [`.env.example`](.env.example). Server-Variablen werden beim ersten Zugriff mit zod geprüft (`src/env.ts`). Der Build läuft auch ohne sie. `NEXT_PUBLIC_*`-Variablen werden beim Build in das Client-Bundle eingesetzt und müssen deshalb beim Docker-Build als `--build-arg` übergeben werden.

## Deployment

```bash
docker build \
  --build-arg NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=... \
  --build-arg NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=... \
  -t schnitzeljagd .
docker run -p 3000:3000 --env-file .env schnitzeljagd
```

Vor dem Start einer neuen Version `pnpm db:migrate` gegen die Zieldatenbank ausführen.

Alle Dienste (App, Datenbank, Objektspeicher) müssen in einer EU-Region laufen (PRD 9.1). Es gibt zwei Umgebungen, `staging` und `production`, unterschieden über `APP_ENV`.
