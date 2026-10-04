import type { Metadata } from "next";
import { useTranslations } from "next-intl";

export const metadata: Metadata = { title: "Planung – Schnitzeljagd" };

export default function AdminPage() {
  const t = useTranslations("Admin");
  return (
    <main className="container">
      <h1>{t("title")}</h1>
      <p>{t("hello")}</p>
    </main>
  );
}
