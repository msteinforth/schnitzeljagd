import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Erzeugt ein eigenständiges Server-Bundle für das Docker-Image.
  output: "standalone",
};

export default withNextIntl(nextConfig);
