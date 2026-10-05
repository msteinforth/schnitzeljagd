import { describe, expect, it } from "vitest";

import { getAppEnv, getDatabaseEnv, getStorageEnv } from "./env";

const storageEnv = {
  S3_BUCKET: "media",
  S3_ACCESS_KEY_ID: "key",
  S3_SECRET_ACCESS_KEY: "secret",
};

describe("getAppEnv", () => {
  it("setzt Standardwerte", () => {
    expect(getAppEnv({}).APP_ENV).toBe("local");
  });

  it("lehnt eine unbekannte APP_ENV ab", () => {
    expect(() => getAppEnv({ APP_ENV: "preview" })).toThrow();
  });
});

describe("getDatabaseEnv", () => {
  it("braucht nur DATABASE_URL, keine S3-Zugangsdaten", () => {
    const env = getDatabaseEnv({ DATABASE_URL: "postgres://user:pass@localhost:5432/db" });
    expect(env.DATABASE_URL).toBe("postgres://user:pass@localhost:5432/db");
  });

  it("lehnt eine fehlende DATABASE_URL ab", () => {
    expect(() => getDatabaseEnv({})).toThrow();
  });
});

describe("getStorageEnv", () => {
  it("setzt Standardwerte für optionale Variablen", () => {
    const env = getStorageEnv(storageEnv);
    expect(env.S3_REGION).toBe("eu-central-1");
    expect(env.S3_FORCE_PATH_STYLE).toBe(false);
  });

  it("wandelt S3_FORCE_PATH_STYLE in einen Boolean um", () => {
    expect(getStorageEnv({ ...storageEnv, S3_FORCE_PATH_STYLE: "true" }).S3_FORCE_PATH_STYLE).toBe(
      true,
    );
  });

  it("lehnt fehlende Zugangsdaten ab", () => {
    expect(() => getStorageEnv({ ...storageEnv, S3_BUCKET: undefined })).toThrow();
  });
});
