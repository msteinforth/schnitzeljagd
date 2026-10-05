import { z } from "zod";

type Source = Record<string, string | undefined>;

// Pro Bereich ein eigenes Schema, damit z. B. Datenbankzugriffe nicht an fehlenden
// S3-Zugangsdaten scheitern.
const appEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_ENV: z.enum(["local", "staging", "production"]).default("local"),
});

const databaseEnvSchema = z.object({
  DATABASE_URL: z.url(),
});

const storageEnvSchema = z.object({
  S3_ENDPOINT: z.url().optional(),
  S3_REGION: z.string().min(1).default("eu-central-1"),
  S3_BUCKET: z.string().min(1),
  S3_ACCESS_KEY_ID: z.string().min(1),
  S3_SECRET_ACCESS_KEY: z.string().min(1),
  S3_FORCE_PATH_STYLE: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
});

export type AppEnv = z.infer<typeof appEnvSchema>;
export type DatabaseEnv = z.infer<typeof databaseEnvSchema>;
export type StorageEnv = z.infer<typeof storageEnvSchema>;

/**
 * Liest und validiert einen Bereich der Server-Umgebungsvariablen beim ersten Zugriff.
 * Lazy, damit `next build` ohne Datenbank- und S3-Zugangsdaten durchläuft.
 */
function lazyEnv<T>(schema: z.ZodType<T>) {
  let cached: T | undefined;
  return (source: Source = process.env): T => {
    if (source !== process.env) return schema.parse(source);
    cached ??= schema.parse(source);
    return cached;
  };
}

export const getAppEnv = lazyEnv(appEnvSchema);
export const getDatabaseEnv = lazyEnv(databaseEnvSchema);
export const getStorageEnv = lazyEnv(storageEnvSchema);

/** Öffentliche Variablen werden von Next.js beim Build in das Client-Bundle eingesetzt. */
export const publicEnv = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  googleMapsMapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "",
};
