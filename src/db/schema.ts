// Drizzle-Schema der Kern-Entitäten aus PRD Abschnitt 8.2.
import { sql } from "drizzle-orm";
import {
  type AnyPgColumn,
  bigserial,
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import type { HuntSettings, HuntSnapshot } from "./types";

const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const huntStatus = pgEnum("hunt_status", ["draft", "published", "archived"]);
export const stationType = pgEnum("station_type", ["start", "regular", "wrong", "finish"]);
export const puzzleType = pgEnum("puzzle_type", ["choice", "text", "number"]);
export const answerOutcome = pgEnum("answer_outcome", [
  "next_station",
  "wrong_place",
  "wrong_message",
]);
export const mediaType = pgEnum("media_type", ["video", "image", "audio"]);
export const mediaStatus = pgEnum("media_status", ["uploading", "processing", "ready", "failed"]);
export const collaboratorRole = pgEnum("collaborator_role", ["owner", "observer"]);
export const runState = pgEnum("run_state", [
  "navigating",
  "arrived",
  "video_before",
  "puzzle",
  "video_after",
  "wrong_place",
  "paused",
  "finished",
]);
export const messageSender = pgEnum("message_sender", ["player", "adult", "character"]);
export const messageKind = pgEnum("message_kind", ["text", "photo", "audio", "help", "emergency"]);

// ---------------------------------------------------------------------------
// Konten
// ---------------------------------------------------------------------------

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    name: text("name"),
    // Wird beim Durchlaufstart als Notfallnummer vorbelegt (RUN-7).
    phone: text("phone"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex("users_email_lower_idx").on(sql`lower(${t.email})`)],
);

// ---------------------------------------------------------------------------
// Themes (THM-6: Pakete aus Design-Tokens und Assets)
// ---------------------------------------------------------------------------

export const themes = pgTable("themes", {
  key: text("key").primaryKey(),
  name: text("name").notNull(),
  tokens: jsonb("tokens").$type<Record<string, string>>().notNull().default({}),
  assets: jsonb("assets").$type<Record<string, string>>().notNull().default({}),
  mapStyle: jsonb("map_style").$type<unknown[]>().notNull().default([]),
  vocabulary: jsonb("vocabulary").$type<Record<string, string>>().notNull().default({}),
  createdAt: createdAt(),
});

// ---------------------------------------------------------------------------
// Medien
// ---------------------------------------------------------------------------

export const media = pgTable(
  "media",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // Medienbibliothek pro Jagd; für das Limit von 10 Videos pro Jagd (MED-1).
    huntId: uuid("hunt_id").references((): AnyPgColumn => hunts.id, { onDelete: "set null" }),
    type: mediaType("type").notNull(),
    status: mediaStatus("status").notNull().default("uploading"),
    storageKey: text("storage_key").notNull().unique(),
    contentType: text("content_type").notNull(),
    sizeBytes: integer("size_bytes"),
    hlsUrl: text("hls_url"),
    durationSeconds: real("duration_seconds"),
    createdAt: createdAt(),
  },
  (t) => [index("media_owner_idx").on(t.ownerId), index("media_hunt_idx").on(t.huntId)],
);

// ---------------------------------------------------------------------------
// Jagd, Stationen, Rätsel
// ---------------------------------------------------------------------------

export const hunts = pgTable(
  "hunts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    birthdayChildName: text("birthday_child_name"),
    birthdayChildAge: integer("birthday_child_age"),
    eventDate: timestamp("event_date", { withTimezone: true, mode: "date" }),
    themeKey: text("theme_key")
      .notNull()
      .references(() => themes.key),
    themeOverrides: jsonb("theme_overrides").$type<Record<string, string>>().notNull().default({}),
    status: huntStatus("status").notNull().default("draft"),
    settings: jsonb("settings").$type<HuntSettings>().notNull().default({}),
    // Videos vor Station 1 und im Finale (MED-2).
    introMediaId: uuid("intro_media_id").references((): AnyPgColumn => media.id, {
      onDelete: "set null",
    }),
    finaleMediaId: uuid("finale_media_id").references((): AnyPgColumn => media.id, {
      onDelete: "set null",
    }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("hunts_owner_idx").on(t.ownerId)],
);

export const collaborators = pgTable(
  "collaborators",
  {
    huntId: uuid("hunt_id")
      .notNull()
      .references(() => hunts.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: collaboratorRole("role").notNull().default("observer"),
    createdAt: createdAt(),
  },
  (t) => [
    primaryKey({ columns: [t.huntId, t.userId] }),
    index("collaborators_user_idx").on(t.userId),
  ],
);

export const stations = pgTable(
  "stations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    huntId: uuid("hunt_id")
      .notNull()
      .references(() => hunts.id, { onDelete: "cascade" }),
    type: stationType("type").notNull().default("regular"),
    name: text("name").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    lat: doublePrecision("lat").notNull(),
    lng: doublePrecision("lng").notNull(),
    radiusM: integer("radius_m").notNull().default(20),
    locationHint: text("location_hint"),
    // Nachricht an einem falschen Ort (RAE-5) bzw. am Ziel.
    message: text("message"),
    mediaBeforeId: uuid("media_before_id").references(() => media.id, { onDelete: "set null" }),
    mediaAfterId: uuid("media_after_id").references(() => media.id, { onDelete: "set null" }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("stations_hunt_idx").on(t.huntId, t.sortOrder)],
);

export const puzzles = pgTable("puzzles", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Pro Station genau ein Rätsel (RAE-1).
  stationId: uuid("station_id")
    .notNull()
    .unique()
    .references(() => stations.id, { onDelete: "cascade" }),
  type: puzzleType("type").notNull(),
  title: text("title").notNull(),
  question: text("question").notNull(),
  imageMediaId: uuid("image_media_id").references(() => media.id, { onDelete: "set null" }),
  videoMediaId: uuid("video_media_id").references(() => media.id, { onDelete: "set null" }),
  penaltySeconds: integer("penalty_seconds"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const answers = pgTable(
  "answers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    puzzleId: uuid("puzzle_id")
      .notNull()
      .references(() => puzzles.id, { onDelete: "cascade" }),
    // Multiple Choice: Text des Buttons.
    label: text("label"),
    // Freitext/Zahl: akzeptierte Eingaben (RAE-2, RAE-4).
    acceptedValues: text("accepted_values")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    // Standardfolge für alle Eingaben, die zu keiner anderen Antwort passen (RAE-4).
    isFallback: boolean("is_fallback").notNull().default(false),
    outcome: answerOutcome("outcome").notNull(),
    targetStationId: uuid("target_station_id").references(() => stations.id, {
      onDelete: "set null",
    }),
    message: text("message"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: createdAt(),
  },
  (t) => [index("answers_puzzle_idx").on(t.puzzleId, t.sortOrder)],
);

export const hints = pgTable(
  "hints",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    puzzleId: uuid("puzzle_id")
      .notNull()
      .references(() => puzzles.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull(),
    text: text("text"),
    mediaId: uuid("media_id").references(() => media.id, { onDelete: "set null" }),
    createdAt: createdAt(),
  },
  (t) => [unique("hints_puzzle_order_unique").on(t.puzzleId, t.sortOrder)],
);

// Eingefrorener Stand einer Jagd beim Durchlaufstart (RUN-5).
export const huntVersions = pgTable(
  "hunt_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    huntId: uuid("hunt_id")
      .notNull()
      .references(() => hunts.id, { onDelete: "cascade" }),
    version: integer("version").notNull(),
    snapshot: jsonb("snapshot").$type<HuntSnapshot>().notNull(),
    createdAt: createdAt(),
  },
  (t) => [unique("hunt_versions_hunt_version_unique").on(t.huntId, t.version)],
);

// ---------------------------------------------------------------------------
// Durchläufe
// ---------------------------------------------------------------------------

export const runs = pgTable(
  "runs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    huntVersionId: uuid("hunt_version_id")
      .notNull()
      .references(() => huntVersions.id, { onDelete: "cascade" }),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // Geheimes Zugangs-Token für die Spieler-App (ACC-4).
    accessToken: text("access_token").notNull().unique(),
    // Das eine zugelassene Spielgerät (PLY-19).
    deviceId: text("device_id"),
    emergencyPhone: text("emergency_phone").notNull(),
    teamName: text("team_name"),
    state: runState("state").notNull().default("navigating"),
    // Verweist auf eine Station im Snapshot; deshalb kein Fremdschlüssel.
    currentStationId: uuid("current_station_id"),
    isTest: boolean("is_test").notNull().default(false),
    // Aufbewahrungsfrist für Positionen und Chat (END-3).
    retentionDays: integer("retention_days").notNull().default(30),
    startedAt: timestamp("started_at", { withTimezone: true }),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [index("runs_hunt_version_idx").on(t.huntVersionId)],
);

export const runEvents = pgTable(
  "run_events",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    runId: uuid("run_id")
      .notNull()
      .references(() => runs.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: createdAt(),
  },
  (t) => [index("run_events_run_idx").on(t.runId, t.createdAt)],
);

export const locationPings = pgTable(
  "location_pings",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    runId: uuid("run_id")
      .notNull()
      .references(() => runs.id, { onDelete: "cascade" }),
    lat: doublePrecision("lat").notNull(),
    lng: doublePrecision("lng").notNull(),
    accuracy: real("accuracy"),
    heading: real("heading"),
    batteryLevel: real("battery_level"),
    recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull(),
  },
  (t) => [index("location_pings_run_idx").on(t.runId, t.recordedAt)],
);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    runId: uuid("run_id")
      .notNull()
      .references(() => runs.id, { onDelete: "cascade" }),
    senderType: messageSender("sender_type").notNull(),
    senderUserId: uuid("sender_user_id").references(() => users.id, { onDelete: "set null" }),
    kind: messageKind("kind").notNull().default("text"),
    body: text("body"),
    mediaId: uuid("media_id").references(() => media.id, { onDelete: "set null" }),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [index("messages_run_idx").on(t.runId, t.createdAt)],
);
