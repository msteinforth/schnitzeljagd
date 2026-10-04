import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { getServerEnv } from "@/env";

// Medien sind privat und nur über kurzlebige, signierte URLs erreichbar (PRD 9.1).
const DEFAULT_URL_TTL_SECONDS = 15 * 60;

let client: S3Client | undefined;

function getClient(): S3Client {
  const env = getServerEnv();
  client ??= new S3Client({
    region: env.S3_REGION,
    endpoint: env.S3_ENDPOINT,
    forcePathStyle: env.S3_FORCE_PATH_STYLE,
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    },
  });
  return client;
}

export function createUploadUrl(
  key: string,
  contentType: string,
  expiresIn = DEFAULT_URL_TTL_SECONDS,
) {
  const command = new PutObjectCommand({
    Bucket: getServerEnv().S3_BUCKET,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(getClient(), command, { expiresIn });
}

export function createDownloadUrl(key: string, expiresIn = DEFAULT_URL_TTL_SECONDS) {
  const command = new GetObjectCommand({ Bucket: getServerEnv().S3_BUCKET, Key: key });
  return getSignedUrl(getClient(), command, { expiresIn });
}
