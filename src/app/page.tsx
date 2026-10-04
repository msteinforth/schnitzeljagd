import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Home");
  return (
    <main className="container">
      <h1>{t("title")}</h1>
      <p>{t("subtitle")}</p>
      <nav className="links">
        <Link href="/admin">{t("admin")}</Link>
        <Link href="/play">{t("play")}</Link>
      </nav>
    </main>
  );
}
