// Legt eine Beispieljagd für Entwicklung und Tests an: `pnpm db:seed`.
// Mehrfach ausführbar: Die Beispieljagd des Demo-Nutzers wird jedes Mal neu erzeugt.
import "dotenv/config";

import { and, eq, sql } from "drizzle-orm";

import { getDb } from "./index";
import { answers, hints, hunts, puzzles, stations, users } from "./schema";

const DEMO_EMAIL = "demo@schnitzeljagd.local";
const DEMO_TITLE = "Ritter Leos Schatz";

async function main() {
  const db = getDb();

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(sql`lower(${users.email})`, DEMO_EMAIL));
  const user =
    existing ??
    (
      await db
        .insert(users)
        .values({ email: DEMO_EMAIL, name: "Demo-Spielleitung", phone: "+491701234567" })
        .returning()
    )[0];

  await db.delete(hunts).where(and(eq(hunts.ownerId, user.id), eq(hunts.title, DEMO_TITLE)));

  const [hunt] = await db
    .insert(hunts)
    .values({
      ownerId: user.id,
      title: DEMO_TITLE,
      description: "Beispieljagd rund um den Tiergarten in Berlin.",
      birthdayChildName: "Leo",
      birthdayChildAge: 9,
      themeKey: "knights",
      settings: { navigationMode: "map", penaltySeconds: 30 },
    })
    .returning();

  const [start, burg, drachenhoehle, bruecke, schatz] = await db
    .insert(stations)
    .values(
      (
        [
          { type: "start", name: "Burgtor", lat: 52.5145, lng: 13.35, sortOrder: 0 },
          { type: "regular", name: "Alte Eiche", lat: 52.5152, lng: 13.3531, sortOrder: 1 },
          {
            type: "wrong",
            name: "Drachenhöhle",
            lat: 52.5139,
            lng: 13.3548,
            sortOrder: 2,
            message: "Psst! Hier schläft nur ein alter Drache. Versucht es noch einmal!",
          },
          { type: "regular", name: "Steinbrücke", lat: 52.5161, lng: 13.3567, sortOrder: 3 },
          {
            type: "finish",
            name: "Schatzkammer",
            lat: 52.5149,
            lng: 13.3592,
            sortOrder: 4,
            message: "Ihr habt den Schatz von Ritter Leo gefunden!",
          },
        ] satisfies Omit<typeof stations.$inferInsert, "huntId">[]
      ).map((s) => ({ ...s, huntId: hunt.id })),
    )
    .returning();

  const [p1, p2, p3] = await db
    .insert(puzzles)
    .values([
      {
        stationId: start.id,
        type: "choice",
        title: "Die Burgzinnen",
        question: "Wie viele Zinnen hat der Turm auf dem Wappen?",
      },
      {
        stationId: burg.id,
        type: "text",
        title: "Das Wappentier",
        question: "Welches Tier speit Feuer und bewacht den Schatz?",
      },
      {
        stationId: bruecke.id,
        type: "number",
        title: "Die Brückenzahl",
        question: "Wie viele Bögen hat die Steinbrücke?",
      },
    ])
    .returning();

  await db.insert(answers).values([
    { puzzleId: p1.id, label: "4", outcome: "next_station", targetStationId: burg.id },
    {
      puzzleId: p1.id,
      label: "6",
      outcome: "wrong_place",
      targetStationId: drachenhoehle.id,
      sortOrder: 1,
    },
    {
      puzzleId: p1.id,
      label: "8",
      outcome: "wrong_message",
      message: "Leider falsch, zählt noch einmal!",
      sortOrder: 2,
    },
    {
      puzzleId: p2.id,
      acceptedValues: ["Drache", "Drachen"],
      outcome: "next_station",
      targetStationId: bruecke.id,
    },
    {
      puzzleId: p2.id,
      isFallback: true,
      outcome: "wrong_message",
      message: "Das ist es nicht. Denkt an Feuer!",
      sortOrder: 1,
    },
    {
      puzzleId: p3.id,
      acceptedValues: ["3"],
      outcome: "next_station",
      targetStationId: schatz.id,
    },
    {
      puzzleId: p3.id,
      isFallback: true,
      outcome: "wrong_message",
      message: "Zählt die Bögen noch einmal.",
      sortOrder: 1,
    },
  ]);

  await db.insert(hints).values([
    { puzzleId: p1.id, sortOrder: 0, text: "Schaut euch das Wappen ganz genau an." },
    { puzzleId: p1.id, sortOrder: 1, text: "Es sind weniger als fünf." },
    { puzzleId: p2.id, sortOrder: 0, text: "Es hat Flügel und Schuppen." },
  ]);

  console.log(`Beispieljagd „${DEMO_TITLE}" angelegt (Jagd-ID ${hunt.id}, Nutzer ${DEMO_EMAIL}).`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
