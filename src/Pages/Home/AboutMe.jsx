import siteContent from "../../data/site.json";
import { useTranslation } from 'react-i18next';
import { RichText } from '../../utils/richText';

export default function AboutMe() {
  const { t, i18n } = useTranslation();
  const aboutContent = siteContent.about;

  const lang = i18n.language || 'fr';
  const aboutTitle = aboutContent?.title?.[lang] || t('about.title');
  const aboutDescription1 = aboutContent?.description1?.[lang] || t('about.description1');
  const aboutDescription2 = aboutContent?.description2?.[lang] || t('about.description2');
  const aboutImageUrl = aboutContent?.imageUrl || "./img/copie 2.JPG";

  return (
    <section id="AboutMe" className="about--section">
      <div className="about--section--img">
        <img src={aboutImageUrl} alt="About me" loading="lazy" />
      </div>
      <div className="hero--section--content--box about--section--box">
        <div className="hero--section--content">
          <p className="section--title"></p>
          <h1 className="skills--section--heading">{aboutTitle}</h1>
          <p className="hero--section--description">
            <RichText text={aboutDescription1} />
          </p>
          <p className="hero--section--description">
            <RichText text={aboutDescription2} />
          </p>
        </div>
      </div>
    </section>
  );
}
