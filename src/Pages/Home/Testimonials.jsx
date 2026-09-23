import { useState } from "react";
import { useTranslation } from "react-i18next";
import data from "../../data/index.json";
import { StarIcon } from "../../components/Icons";
import { localize } from "../../utils/localize";

const INITIAL_COUNT = 3;
const testimonials = data.testimonials;

export default function Testimonial() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage;
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? testimonials : testimonials.slice(0, INITIAL_COUNT);

  return (
    <section className="testimonial--section" id="testimonial">
      <div className="portfolio--container--box">
        <div className="portfolio--container">
          <h2 className="sections--heading">{t("testimonials.title")}</h2>
        </div>
      </div>
      <div className="portfolio--section--container">
        {visible.map((item) => (
          <figure key={item.id} className="testimonial--section--card">
            <div
              className="testimonial--section--card--review"
              role="img"
              aria-label={t("testimonials.rating", { count: item.rating })}
            >
              {Array.from({ length: item.rating }, (_, starIndex) => (
                <StarIcon key={starIndex} />
              ))}
            </div>
            <blockquote className="text-md">{localize(item.description, lang)}</blockquote>
            <figcaption className="testimonial--section--card--author--detail">
              <img src={item.src} alt="" width="48" height="48" loading="lazy" />
              <div>
                <p className="text-md testimonial--author--name">{item.author_name}</p>
                <p className="text-md testimonial--author--designation">
                  {localize(item.author_designation, lang)}
                </p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      {testimonials.length > INITIAL_COUNT && (
        <div className="testimonial--see--all-wrapper">
          <button
            onClick={() => setShowAll(!showAll)}
            className="btn-outline-primary"
            type="button"
            aria-expanded={showAll}
          >
            {showAll ? t("testimonials.showLess") : t("testimonials.showAll", { count: testimonials.length })}
          </button>
        </div>
      )}
    </section>
  );
}
