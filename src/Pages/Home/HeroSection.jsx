import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import siteContent from "../../data/site.json";
import { RichText } from "../../utils/richText";
import { localize } from "../../utils/localize";

const CV_PROFILES = ["dev", "data"];
const CV_LANGUAGES = ["fr", "en"];

export default function HeroSection() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage;
  const { hero, cv } = siteContent;
  const [selectedCv, setSelectedCv] = useState(null);
  const cvDropdownRef = useRef(null);

  const hasCvLinks = CV_PROFILES.some((profile) => CV_LANGUAGES.some((l) => cv[profile]?.[l]));

  const openCv = (profile, cvLang) => {
    setSelectedCv({ url: cv[profile][cvLang], label: `${t(`hero.cv.${profile}`)} (${cvLang.toUpperCase()})` });
    if (cvDropdownRef.current) cvDropdownRef.current.open = false;
  };

  return (
    <section id="heroSection" className="hero--section">
      <div className="hero--section--content--box">
        <div className="hero--section--content">
          <h1 className="section--title">
            <span>{t("hero.title")}</span>
          </h1>
          <h2 className="hero--section--title">
            <span className="hero--section--title--color">{t("hero.subtitle")}</span> <br />
            {localize(hero.subtitleSuffix, lang)}
          </h2>
          <p className="hero--section--description">
            {t("hero.description")}
            <br />
            <RichText text={t("hero.description_continued")} />
          </p>
        </div>
        {!hasCvLinks ? (
          <a className="btn btn-primary" href={hero.ctaUrl} target="_blank" rel="noreferrer">
            {t("hero.cta_button")}
          </a>
        ) : (
          <details className="cv-dropdown" ref={cvDropdownRef}>
            <summary className="cv-dropdown-trigger">
              {t("hero.cta_button")}
              <span className="cv-caret" aria-hidden="true">▾</span>
            </summary>
            <div className="cv-dropdown-menu">
              {CV_PROFILES.map((profile) => (
                <div key={profile} className="cv-dropdown-group">
                  <p>{t(`hero.cv.${profile}`)}</p>
                  <div className="cv-dropdown-actions">
                    {CV_LANGUAGES.filter((cvLang) => cv[profile]?.[cvLang]).map((cvLang) => (
                      <button key={cvLang} type="button" onClick={() => openCv(profile, cvLang)}>
                        {cvLang.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
      <div className="hero--section--img">
        <img src={hero.imageUrl} alt={t("hero.imageAlt")} width="800" height="923" fetchPriority="high" />
      </div>
      {selectedCv && (
        <div className="cv-inline-viewer">
          <div className="cv-viewer-header">
            <span>{selectedCv.label}</span>
            <div className="cv-viewer-actions">
              <a className="btn btn-primary" href={selectedCv.url} target="_blank" rel="noreferrer">
                {t("hero.cv.view")}
              </a>
              <a className="btn btn-primary" href={selectedCv.url} target="_blank" rel="noreferrer" download>
                {t("hero.cv.download")}
              </a>
              <button type="button" className="btn btn-primary" onClick={() => setSelectedCv(null)}>
                {t("hero.cv.close")}
              </button>
            </div>
          </div>
          <iframe title={t("hero.cv.frame")} src={selectedCv.url} className="cv-iframe" />
        </div>
      )}
    </section>
  );
}
