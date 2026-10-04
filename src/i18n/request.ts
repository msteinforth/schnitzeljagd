import { getRequestConfig } from "next-intl/server";

// v1 ist nur auf Deutsch (PRD 9.3). Weitere Sprachen kommen als zusätzliche messages/*.json hinzu.
export const defaultLocale = "de";

export default getRequestConfig(async () => {
  const locale = defaultLocale;
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
