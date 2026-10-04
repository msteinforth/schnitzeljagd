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
| `pnpm test`                         | Unit-Tests (Vitest)                       |
| `pnpm format` / `pnpm format:check` | Prettier                                  |
| `pnpm db:generate`                  | Migration aus `src/db/schema.ts` erzeugen |
| `pnpm db:migrate`                   | Migrationen anwenden                      |
| `pnpm db:studio`                    | Drizzle Studio                            |

## Struktur

```
src/
  app/
    admin/        Admin-Oberfläche
    play/         Spieler-App
    api/health/   Health-Check (prüft die Datenbankverbindung)
  db/             Drizzle-Schema und Datenbank-Client
  i18n/           next-intl-Konfiguration
  lib/storage.ts  S3-Client und signierte Upload-/Download-URLs
  env.ts          Validierung der Umgebungsvariablen
messages/         Übersetzungen
drizzle/          SQL-Migrationen
```

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
