import { describe, expect, it } from "vitest";

import { getServerEnv } from "./env";

const validEnv = {
  DATABASE_URL: "postgres://user:pass@localhost:5432/db",
  S3_BUCKET: "media",
  S3_ACCESS_KEY_ID: "key",
  S3_SECRET_ACCESS_KEY: "secret",
};

describe("getServerEnv", () => {
  it("setzt Standardwerte für optionale Variablen", () => {
    const env = getServerEnv(validEnv);
    expect(env.APP_ENV).toBe("local");
    expect(env.S3_REGION).toBe("eu-central-1");
    expect(env.S3_FORCE_PATH_STYLE).toBe(false);
  });

  it("wandelt S3_FORCE_PATH_STYLE in einen Boolean um", () => {
    expect(getServerEnv({ ...validEnv, S3_FORCE_PATH_STYLE: "true" }).S3_FORCE_PATH_STYLE).toBe(
      true,
    );
  });

  it("lehnt fehlende Pflichtvariablen ab", () => {
    expect(() => getServerEnv({ ...validEnv, DATABASE_URL: undefined })).toThrow();
  });

  it("lehnt eine unbekannte APP_ENV ab", () => {
    expect(() => getServerEnv({ ...validEnv, APP_ENV: "preview" })).toThrow();
  });
});
