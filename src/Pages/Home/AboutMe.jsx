import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { RichText } from '../../utils/richText';

export default function AboutMe() {
  const { t, i18n } = useTranslation();
  const [aboutContent, setAboutContent] = useState(null);

  useEffect(() => {
    const loadAboutContent = async () => {
      try {
        const snapshot = await getDoc(doc(db, 'siteContent', 'home'));
        if (snapshot.exists()) {
          const data = snapshot.data();
          setAboutContent(data.about || null);
        }
      } catch (error) {
        console.error('Erreur chargement about:', error);
      }
    };

    loadAboutContent();
  }, []);

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
