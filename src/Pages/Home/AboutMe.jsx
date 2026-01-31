import { Trans, useTranslation } from 'react-i18next';

export default function AboutMe() {
  const { t } = useTranslation();

  return (
    <section id="AboutMe" className="about--section">
      <div className="about--section--img">
        <img src="./img/copie 2.JPG" alt="About me" loading="lazy" />
      </div>
      <div className="hero--section--content--box about--section--box">
        <div className="hero--section--content">
          <p className="section--title"></p>
          <h1 className="skills--section--heading">{t('about.title')}</h1>
          <p className="hero--section--description">
            <Trans
              i18nKey="about.description1"
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
          <p className="hero--section--description">
            {t('about.description2')}
          </p>
        </div>
      </div>
    </section>
  );
}
