// JSON-Strukturen, die in jsonb-Spalten gespeichert werden.

export type NavigationMode = "map" | "hot_cold";

/** Einstellungen einer Jagd (PLY-4, RAE-7). */
export interface HuntSettings {
  navigationMode?: NavigationMode;
  penaltySeconds?: number;
}

export interface SnapshotAnswer {
  id: string;
  label: string | null;
  acceptedValues: string[];
  isFallback: boolean;
  outcome: "next_station" | "wrong_place" | "wrong_message";
  targetStationId: string | null;
  message: string | null;
}

export interface SnapshotHint {
  id: string;
  text: string | null;
  mediaId: string | null;
}

export interface SnapshotPuzzle {
  id: string;
  type: "choice" | "text" | "number";
  title: string;
  question: string;
  imageMediaId: string | null;
  videoMediaId: string | null;
  penaltySeconds: number | null;
  answers: SnapshotAnswer[];
  hints: SnapshotHint[];
}

export interface SnapshotStation {
  id: string;
  type: "start" | "regular" | "wrong" | "finish";
  name: string;
  lat: number;
  lng: number;
  radiusM: number;
  locationHint: string | null;
  message: string | null;
  mediaBeforeId: string | null;
  mediaAfterId: string | null;
  puzzle: SnapshotPuzzle | null;
}

/** Eingefrorener Stand einer Jagd, auf dem ein Durchlauf läuft (RUN-5). */
export interface HuntSnapshot {
  hunt: {
    id: string;
    title: string;
    birthdayChildName: string | null;
    themeKey: string;
    themeOverrides: Record<string, string>;
    settings: HuntSettings;
    introMediaId: string | null;
    finaleMediaId: string | null;
  };
  stations: SnapshotStation[];
}
