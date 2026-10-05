import { getDb } from "@/db";
import { answers, hints, puzzles, stations } from "@/db/schema";
import { createHunt } from "@/server/hunts";

/** Kleine Jagd mit Start, Rätsel inkl. falschem Ort und Ziel (vgl. PRD 8.1). */
export async function createHuntWithPuzzle(ownerId: string) {
  const db = getDb();
  const hunt = await createHunt(ownerId, { title: "Testjagd", themeKey: "knights" });
  const [start, wrong, finish] = await db
    .insert(stations)
    .values([
      { huntId: hunt.id, type: "start", name: "Haustür", sortOrder: 0, lat: 52.52, lng: 13.405 },
      {
        huntId: hunt.id,
        type: "wrong",
        name: "Drachenhöhle",
        sortOrder: 1,
        lat: 52.521,
        lng: 13.406,
        message: "Hier schläft nur ein Drache …",
      },
      { huntId: hunt.id, type: "finish", name: "Schatz", sortOrder: 2, lat: 52.522, lng: 13.407 },
    ])
    .returning();
  const [puzzle] = await db
    .insert(puzzles)
    .values({ stationId: start.id, type: "choice", title: "Burg", question: "Wie viele Zinnen?" })
    .returning();
  await db.insert(answers).values([
    { puzzleId: puzzle.id, label: "4", outcome: "next_station", targetStationId: finish.id },
    {
      puzzleId: puzzle.id,
      label: "6",
      outcome: "wrong_place",
      targetStationId: wrong.id,
      sortOrder: 1,
    },
    {
      puzzleId: puzzle.id,
      label: "8",
      outcome: "wrong_message",
      message: "Leider falsch",
      sortOrder: 2,
    },
  ]);
  await db.insert(hints).values([
    { puzzleId: puzzle.id, sortOrder: 0, text: "Zähl genau!" },
    { puzzleId: puzzle.id, sortOrder: 1, text: "Es sind weniger als 5." },
  ]);
  return { hunt, start, wrong, finish, puzzle };
}
