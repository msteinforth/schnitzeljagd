import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_ENV: z.enum(["local", "staging", "production"]).default("local"),
  DATABASE_URL: z.url(),
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

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | undefined;

/**
 * Liest und validiert die Server-Umgebungsvariablen beim ersten Zugriff.
 * Lazy, damit `next build` ohne Datenbank- und S3-Zugangsdaten durchläuft.
 */
export function getServerEnv(source: Record<string, string | undefined> = process.env): ServerEnv {
  if (source !== process.env) return serverEnvSchema.parse(source);
  cached ??= serverEnvSchema.parse(source);
  return cached;
}

/** Öffentliche Variablen werden von Next.js beim Build in das Client-Bundle eingesetzt. */
export const publicEnv = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  googleMapsMapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "",
};
