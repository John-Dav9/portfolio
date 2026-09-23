import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useDocumentTitle from "../utils/useDocumentTitle";

export default function NotFound() {
  const { t } = useTranslation();
  useDocumentTitle(t("notFound.title"));

  return (
    <div className="legal-page">
      <div className="legal-content not-found">
        <p className="not-found--code">404</p>
        <h1>{t("notFound.title")}</h1>
        <p>{t("notFound.description")}</p>
        <Link to="/" className="btn btn-primary">
          {t("notFound.back")}
        </Link>
      </div>
    </div>
  );
}
