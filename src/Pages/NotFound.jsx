import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useDocumentTitle from "../utils/useDocumentTitle";
import { Reveal } from "../components/motion";

export default function NotFound() {
  const { t } = useTranslation();
  useDocumentTitle(t("notFound.title"));

  return (
    <Reveal className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-5 px-5 text-center">
      <p className="font-mono text-7xl font-semibold text-accent">404</p>
      <h1 className="text-3xl font-extrabold text-white">{t("notFound.title")}</h1>
      <p className="text-slate-400">{t("notFound.description")}</p>
      <Link to="/" className="btn-primary">
        {t("notFound.back")}
      </Link>
    </Reveal>
  );
}
