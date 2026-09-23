import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import data from "../../data/index.json";
import { localize } from "../../utils/localize";

const skills = data.skills;

function cardsForWidth(width) {
  if (width >= 1200) return 4;
  if (width >= 576) return 2;
  return 1;
}

function SkillModal({ skill, lang, onClose }) {
  const { t } = useTranslation();
  const closeButtonRef = useRef(null);
  const title = localize(skill.title, lang);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeButtonRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="skills--modal--overlay" onClick={onClose}>
      <div
        className="skills--modal--content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="skill-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="skills--modal--close"
          onClick={onClose}
          aria-label={t("skills.close")}
        >
          ×
        </button>
        <div className="skills--modal--header">
          <img src={skill.src} alt="" className="skills--modal--img" />
          <h2 id="skill-modal-title">{title}</h2>
        </div>
        <p className="skills--modal--description">{localize(skill.description, lang)}</p>
      </div>
    </div>
  );
}

export default function MySkills() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage;
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(() => cardsForWidth(window.innerWidth));

  useEffect(() => {
    const updateCardsPerView = () => setCardsPerView(cardsForWidth(window.innerWidth));
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  const closeModal = useCallback(() => setSelectedSkill(null), []);

  const maxIndex = Math.max(0, skills.length - cardsPerView);
  const startIndex = Math.min(currentIndex, maxIndex);
  const displayedSkills = skills.slice(startIndex, startIndex + cardsPerView);

  const onCardKeyDown = (e, skill) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedSkill(skill);
    }
  };

  return (
    <section className="skills--section" id="MySkills">
      <div className="portfolio--container">
        <h2 className="skills--section--heading">{t("skills.title")}</h2>
      </div>
      <div className="skills--carousel--layout">
        <button
          type="button"
          className="skills--carousel--btn"
          onClick={() => setCurrentIndex(Math.max(startIndex - cardsPerView, 0))}
          disabled={startIndex === 0}
          aria-label={t("skills.carousel.previous")}
        >
          ‹
        </button>
        <div
          className="skills--section--container"
          style={{ gridTemplateColumns: `repeat(${cardsPerView}, minmax(0, 1fr))` }}
          aria-live="polite"
        >
          {displayedSkills.map((skill) => (
            <div
              key={skill.id}
              className="skills--section--card"
              onClick={() => setSelectedSkill(skill)}
              onKeyDown={(e) => onCardKeyDown(e, skill)}
              role="button"
              tabIndex={0}
              aria-haspopup="dialog"
            >
              <div className="skills--section--img">
                <img src={skill.src} alt="" width="800" height="533" loading="lazy" />
              </div>
              <div className="skills--section--card--content">
                <h3 className="skills--section--title">{localize(skill.title, lang)}</h3>
                <span className="skills--card--learn-more">{t("skills.learnMore")}</span>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="skills--carousel--btn"
          onClick={() => setCurrentIndex(Math.min(startIndex + cardsPerView, maxIndex))}
          disabled={startIndex >= maxIndex}
          aria-label={t("skills.carousel.next")}
        >
          ›
        </button>
      </div>

      {selectedSkill && (
        <SkillModal skill={selectedSkill} lang={lang} onClose={closeModal} />
      )}
    </section>
  );
}
