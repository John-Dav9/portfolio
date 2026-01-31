import { Trans, useTranslation } from 'react-i18next';

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section id="heroSection" className="hero--section">
      <div className="hero--section--content--box">
        <div className="hero--section--content">
          <h1 className="section--title">
            <span>{t('hero.title')}</span>
          </h1>
          <h2 className="hero--section--title">
            <span className="hero--section--title--color">{t('hero.subtitle')}</span>{" "}
            <br />
            & Data Analyst
          </h2>
          <p className="hero--section--description">
            {t('hero.description')}
            <br />
            <Trans
              i18nKey="hero.description_continued"
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
            />
          </p>
        </div>
        <a
          className="btn btn-primary"
          href="https://www.canva.com/design/DAGRbJFBCcQ/ENKhhjbSAB3NvhZBzzCISA/view"
          target="_blank"
          rel="noreferrer"
        >
          {t('hero.cta_button')}
        </a>
      </div>
      <div className="hero--section--img">
        <img src="./img/copie 3.JPG" alt="Hero section" />
      </div>
    </section>
  );
}
