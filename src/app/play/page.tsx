import type { Metadata } from "next";
import { useTranslations } from "next-intl";

export const metadata: Metadata = { title: "Spieler-App – Schnitzeljagd" };

export default function PlayPage() {
  const t = useTranslations("Play");
  return (
    <main className="container">
      <h1>{t("title")}</h1>
      <p>{t("hello")}</p>
    </main>
  );
}
