import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RichText } from "../../utils/richText";
import useDocumentTitle from "../../utils/useDocumentTitle";
import { LEGAL_CONTENT } from "./content";

export default function LegalPage({ page }) {
  const { t, i18n } = useTranslation();
  const content = LEGAL_CONTENT[page][i18n.resolvedLanguage] ?? LEGAL_CONTENT[page].fr;
  useDocumentTitle(content.title);

  return (
    <div className="legal-page">
      <Link to="/" className="btn-back">
        {t("legal.back")}
      </Link>

      <article className="legal-content">
        <h1>{content.title}</h1>
        {content.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => (
              <RichText key={paragraph} as="p" text={paragraph} />
            ))}
            {section.items && (
              <ul>
                {section.items.map((item) => (
                  <RichText key={item} as="li" text={item} />
                ))}
              </ul>
            )}
          </section>
        ))}
        <p className="last-update">{t("legal.lastUpdate", { date: content.updated })}</p>
      </article>
    </div>
  );
}
