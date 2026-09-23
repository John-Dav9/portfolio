import { useTranslation } from "react-i18next";
import siteContent from "../../data/site.json";
import { RichText } from "../../utils/richText";

export default function AboutMe() {
  const { t } = useTranslation();

  return (
    <section id="AboutMe" className="about--section">
      <div className="about--section--img">
        <img src={siteContent.about.imageUrl} alt={t("about.imageAlt")} width="800" height="1067" loading="lazy" />
      </div>
      <div className="hero--section--content--box about--section--box">
        <div className="hero--section--content">
          <h2 className="skills--section--heading">{t("about.title")}</h2>
          <p className="hero--section--description">
            <RichText text={t("about.description1")} />
          </p>
          <p className="hero--section--description">
            <RichText text={t("about.description2")} />
          </p>
        </div>
      </div>
    </section>
  );
}
