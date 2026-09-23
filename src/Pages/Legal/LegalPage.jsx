import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RichText } from "../../utils/richText";
import useDocumentTitle from "../../utils/useDocumentTitle";
import { Reveal } from "../../components/motion";
import { LEGAL_CONTENT } from "./content";

export default function LegalPage({ page }) {
  const { t, i18n } = useTranslation();
  const content = LEGAL_CONTENT[page][i18n.resolvedLanguage] ?? LEGAL_CONTENT[page].fr;
  useDocumentTitle(content.title);

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 md:px-8">
      <Link to="/" className="btn-ghost mb-8">
        {t("legal.back")}
      </Link>
      <Reveal as="article" className="prose-legal rounded-3xl border border-line bg-panel/80 p-6 sm:p-12">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white">{content.title}</h1>
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
        <p className="mt-8 text-sm text-slate-500">{t("legal.lastUpdate", { date: content.updated })}</p>
      </Reveal>
    </div>
  );
}
