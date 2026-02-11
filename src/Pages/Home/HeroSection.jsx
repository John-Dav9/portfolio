import { Trans, useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function HeroSection() {
  const { t, i18n } = useTranslation();
  const [heroContent, setHeroContent] = useState(null);
  const [cvLinks, setCvLinks] = useState(null);
  const [selectedCvUrl, setSelectedCvUrl] = useState("");
  const [selectedCvLabel, setSelectedCvLabel] = useState("");
  const cvDropdownRef = useRef(null);

  useEffect(() => {
    const loadHeroContent = async () => {
      try {
        const snapshot = await getDoc(doc(db, 'siteContent', 'home'));
        if (snapshot.exists()) {
          const data = snapshot.data();
          setHeroContent(data.hero || null);
        }
        const cvSnap = await getDoc(doc(db, 'siteContent', 'cv'));
        if (cvSnap.exists()) {
          const data = cvSnap.data();
          setCvLinks(data.links || null);
        }
      } catch (error) {
        console.error('Erreur chargement hero:', error);
      }
    };

    loadHeroContent();
  }, []);

  const lang = i18n.language || 'fr';
  const heroTitle = heroContent?.title?.[lang] || t('hero.title');
  const heroSubtitle = heroContent?.subtitle?.[lang] || t('hero.subtitle');
  const heroDescription = heroContent?.description?.[lang] || t('hero.description');
  const heroDescriptionContinued =
    heroContent?.description_continued?.[lang] || t('hero.description_continued');
  const heroSubtitleSuffix =
    heroContent?.subtitleSuffix?.[lang] ?? "& Data Analyst";
  const heroCtaLabel = heroContent?.ctaLabel?.[lang] || t('hero.cta_button');
  const heroCtaUrl =
    heroContent?.ctaUrl ||
    "https://www.canva.com/design/DAGRbJFBCcQ/ENKhhjbSAB3NvhZBzzCISA/view";
  const heroImageUrl = heroContent?.imageUrl || "./img/copie 3.JPG";
  const hasCvLinks =
    cvLinks?.dev?.fr || cvLinks?.dev?.en || cvLinks?.data?.fr || cvLinks?.data?.en;


  return (
    <section id="heroSection" className="hero--section">
      <div className="hero--section--content--box">
        <div className="hero--section--content">
          <h1 className="section--title">
            <span>{heroTitle}</span>
          </h1>
          <h2 className="hero--section--title">
            <span className="hero--section--title--color">{heroSubtitle}</span>{" "}
            <br />
            {heroSubtitleSuffix}
          </h2>
          <p className="hero--section--description">
            {heroDescription}
            <br />
            <Trans
              components={{
                lewagon: (
                  <a
                    href="https://www.lewagon.com/fr/web-development-course"
                    target="_blank"
                    rel="noreferrer"
                  />
                ),
                technofutur: (
                  <a
                    href="https://technofuturtic.be/catalogue/formation/developpeur-web-oriente-data-analysis"
                    target="_blank"
                    rel="noreferrer"
                  />
                )
              }}
            >
              {heroDescriptionContinued}
            </Trans>
          </p>
        </div>
        {!hasCvLinks ? (
          <a
            className="btn btn-primary"
            href={heroCtaUrl}
            target="_blank"
            rel="noreferrer"
          >
            {heroCtaLabel}
          </a>
        ) : (
          <details className="cv-dropdown" ref={cvDropdownRef}>
            <summary className="cv-dropdown-trigger">
              {lang === "fr" ? "Voir mon CV" : "View my CV"}
              <span className="cv-caret" aria-hidden="true">▾</span>
            </summary>
            <div className="cv-dropdown-menu" role="menu">
              <div className="cv-dropdown-group">
                <p>{lang === "fr" ? "Développeur Web" : "Web Developer"}</p>
                <div className="cv-dropdown-actions">
                  {cvLinks?.dev?.fr && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCvUrl(cvLinks.dev.fr);
                        setSelectedCvLabel(lang === "fr" ? "Développeur Web (FR)" : "Web Developer (FR)");
                        if (cvDropdownRef.current) cvDropdownRef.current.open = false;
                      }}
                    >
                      FR
                    </button>
                  )}
                  {cvLinks?.dev?.en && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCvUrl(cvLinks.dev.en);
                        setSelectedCvLabel(lang === "fr" ? "Développeur Web (EN)" : "Web Developer (EN)");
                        if (cvDropdownRef.current) cvDropdownRef.current.open = false;
                      }}
                    >
                      EN
                    </button>
                  )}
                </div>
              </div>
              <div className="cv-dropdown-group">
                <p>{lang === "fr" ? "Data Analyst" : "Data Analyst"}</p>
                <div className="cv-dropdown-actions">
                  {cvLinks?.data?.fr && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCvUrl(cvLinks.data.fr);
                        setSelectedCvLabel(lang === "fr" ? "Data Analyst (FR)" : "Data Analyst (FR)");
                        if (cvDropdownRef.current) cvDropdownRef.current.open = false;
                      }}
                    >
                      FR
                    </button>
                  )}
                  {cvLinks?.data?.en && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCvUrl(cvLinks.data.en);
                        setSelectedCvLabel(lang === "fr" ? "Data Analyst (EN)" : "Data Analyst (EN)");
                        if (cvDropdownRef.current) cvDropdownRef.current.open = false;
                      }}
                    >
                      EN
                    </button>
                  )}
                </div>
              </div>
            </div>
          </details>
        )}
      </div>
      <div className="hero--section--img">
        <img src={heroImageUrl} alt="Hero section" />
      </div>
      {selectedCvUrl && (
        <div className="cv-inline-viewer">
          <div className="cv-viewer-header">
            <span>{selectedCvLabel}</span>
            <div className="cv-viewer-actions">
              <a className="btn btn-primary" href={selectedCvUrl} target="_blank" rel="noreferrer">
                {lang === "fr" ? "Voir le CV" : "View CV"}
              </a>
              <a className="btn btn-primary" href={selectedCvUrl} target="_blank" rel="noreferrer" download>
                {lang === "fr" ? "Télécharger" : "Download"}
              </a>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setSelectedCvUrl("");
                  setSelectedCvLabel("");
                }}
              >
                {lang === "fr" ? "Fermer" : "Close"}
              </button>
            </div>
          </div>
          <iframe title="CV PDF" src={selectedCvUrl} className="cv-iframe" />
        </div>
      )}
    </section>
  );
}
