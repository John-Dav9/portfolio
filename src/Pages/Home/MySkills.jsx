import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, m } from "motion/react";
import data from "../../data/index.json";
import { localize } from "../../utils/localize";
import { useFocus } from "../../components/FocusContext";
import SectionHeading from "../../components/SectionHeading";
import { revealGroup, revealItem, trackSpotlight } from "../../components/motion";

// Bento layout: the first two and last two tiles are wide on large screens.
const WIDE = new Set([0, 1, 6, 7]);

function SkillDialog({ skill, lang, onClose }) {
  const { t } = useTranslation();
  const closeRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeRef.current?.focus();
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <m.div
      className="fixed inset-0 z-70 flex items-center justify-center bg-ink/70 p-5 backdrop-blur-sm"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <m.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="skill-dialog-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl border border-line bg-panel p-8 shadow-2xl"
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.25 }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t("skills.close")}
          className="absolute top-4 right-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-line text-xl text-slate-300 hover:border-accent"
        >
          ×
        </button>
        <p className="mb-2 font-mono text-sm text-accent">{skill.tag}</p>
        <h2 id="skill-dialog-title" className="mb-4 text-2xl font-bold text-white">
          {localize(skill.title, lang)}
        </h2>
        <p className="leading-relaxed text-slate-300">{localize(skill.description, lang)}</p>
      </m.div>
    </m.div>
  );
}

export default function MySkills() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage;
  const { focus } = useFocus();
  const [selected, setSelected] = useState(null);
  const close = useCallback(() => setSelected(null), []);

  return (
    <section id="MySkills" className="mx-auto max-w-7xl px-5 py-20 md:px-8">
      <SectionHeading index="01" title={t("skills.title")} />
      <m.ul
        className="grid gap-4 sm:grid-cols-2 lg:auto-rows-[170px] lg:grid-cols-4"
        variants={revealGroup}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {data.skills.map((skill, index) => {
          const highlighted = skill.focus === "both" || skill.focus === focus;
          return (
            <m.li key={skill.id} variants={revealItem} className={WIDE.has(index) ? "lg:col-span-2" : ""}>
              <button
                type="button"
                onClick={() => setSelected(skill)}
                onPointerMove={trackSpotlight}
                aria-haspopup="dialog"
                className={`spotlight group flex h-full w-full cursor-pointer flex-col gap-3 rounded-3xl p-6 text-left ${
                  highlighted ? "" : "opacity-45 hover:opacity-100"
                }`}
              >
                <span className="font-mono text-sm text-accent transition-colors duration-500">{skill.tag}</span>
                <span className="text-xl font-bold text-white">{localize(skill.title, lang)}</span>
                <span className="text-sm leading-relaxed text-slate-400">{localize(skill.tools, lang)}</span>
                <span className="mt-auto text-sm text-slate-500 transition-colors group-hover:text-accent">
                  {t("skills.learnMore")} →
                </span>
              </button>
            </m.li>
          );
        })}
      </m.ul>

      <AnimatePresence>
        {selected && <SkillDialog key={selected.id} skill={selected} lang={lang} onClose={close} />}
      </AnimatePresence>
    </section>
  );
}
