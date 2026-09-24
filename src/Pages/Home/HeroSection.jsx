import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { m } from "motion/react";
import { useContent } from "../../components/ContentContext";
import { RichText } from "../../utils/richText";
import { useFocus } from "../../components/FocusContext";
import FocusSwitch from "../../components/FocusSwitch";
import { CountUp, Typewriter, revealGroup, revealItem } from "../../components/motion";

const CV_PROFILES = ["dev", "data"];
const CV_LANGUAGES = ["fr", "en"];

function CvButton() {
  const { t } = useTranslation();
  const { site, cv } = useContent();
  const { hero } = site;
  const [selectedCv, setSelectedCv] = useState(null);
  const detailsRef = useRef(null);
  const hasCvLinks = CV_PROFILES.some((profile) => CV_LANGUAGES.some((l) => cv[profile]?.[l]));

  if (!hasCvLinks) {
    return (
      <a className="btn-ghost" href={hero.ctaUrl} target="_blank" rel="noreferrer">
        {t("hero.cta_button")}
      </a>
    );
  }

  return (
    <>
      <details ref={detailsRef} className="group relative">
        <summary className="btn-ghost cursor-pointer list-none">
          {t("hero.cta_button")} <span aria-hidden="true" className="transition-transform group-open:rotate-180">▾</span>
        </summary>
        <div className="absolute left-0 z-20 mt-2 flex w-64 flex-col gap-3 rounded-xl border border-line bg-panel p-4 shadow-2xl">
          {CV_PROFILES.map((profile) => (
            <div key={profile} className="flex items-center justify-between gap-2">
              <span className="text-sm text-slate-300">{t(`hero.cv.${profile}`)}</span>
              <div className="flex gap-2">
                {CV_LANGUAGES.filter((l) => cv[profile]?.[l]).map((l) => (
                  <button
                    key={l}
                    type="button"
                    className="cursor-pointer rounded-md border border-line px-2 py-1 font-mono text-xs hover:border-accent"
                    onClick={() => {
                      setSelectedCv({ url: cv[profile][l], label: `${t(`hero.cv.${profile}`)} (${l.toUpperCase()})` });
                      detailsRef.current.open = false;
                    }}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </details>
      {selectedCv && (
        <div className="fixed inset-0 z-70 flex flex-col bg-ink/95 p-4 backdrop-blur" role="dialog" aria-modal="true" aria-label={selectedCv.label}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <span className="font-semibold">{selectedCv.label}</span>
            <div className="flex gap-2">
              <a className="btn-ghost" href={selectedCv.url} target="_blank" rel="noreferrer">{t("hero.cv.view")}</a>
              <a className="btn-ghost" href={selectedCv.url} target="_blank" rel="noreferrer" download>{t("hero.cv.download")}</a>
              <button type="button" className="btn-primary cursor-pointer" onClick={() => setSelectedCv(null)}>{t("hero.cv.close")}</button>
            </div>
          </div>
          <iframe title={t("hero.cv.frame")} src={selectedCv.url} className="w-full flex-1 rounded-xl bg-white" />
        </div>
      )}
    </>
  );
}

export default function HeroSection() {
  const { t } = useTranslation();
  const { focus } = useFocus();
  const { site, projects, skills } = useContent();

  return (
    <section id="heroSection" className="mx-auto grid max-w-7xl gap-10 px-5 pt-10 pb-10 md:px-8 lg:grid-cols-12 lg:gap-12 lg:pt-16 lg:pb-12">
      <m.div className="flex flex-col gap-6 lg:col-span-7 lg:justify-center" variants={revealGroup} initial="hidden" animate="visible">
        <m.div variants={revealItem} className="flex items-center gap-2.5 self-start rounded-full border border-line bg-panel/80 px-3.5 py-2 text-sm text-slate-300">
          <span className="h-2 w-2 animate-pulse-ring rounded-full bg-data" />
          {t("hero.status")}
        </m.div>
        <m.div variants={revealItem} className="self-start md:hidden">
          <FocusSwitch />
        </m.div>
        <m.p variants={revealItem} className="font-mono text-accent transition-colors duration-500">
          {t("hero.prompt")}
        </m.p>
        <m.h1 variants={revealItem} className="text-5xl leading-[1.02] font-extrabold tracking-tight text-white sm:text-6xl xl:text-7xl">
          John David
          <br />
          <span className="bg-linear-to-r from-white via-slate-200 to-accent bg-clip-text text-transparent">Tchomgui</span>
        </m.h1>
        <m.p variants={revealItem} className="min-h-8 font-mono text-lg text-accent sm:text-xl">
          <Typewriter text={t(`hero.role.${focus}`)} />
        </m.p>
        <m.p variants={revealItem} className="max-w-xl text-lg leading-relaxed text-slate-400">
          {t(`hero.pitch.${focus}`)}
        </m.p>
        <m.p variants={revealItem} className="rich max-w-xl text-slate-400">
          <RichText text={t("hero.description_continued")} />
        </m.p>
        <m.div variants={revealItem} className="flex flex-wrap gap-3">
          <a className="btn-primary" href="#MyPortfolio">
            {t(`hero.cta.${focus}`)}
          </a>
          <CvButton />
        </m.div>
      </m.div>

      {/* Round portrait with a slowly turning accent ring and two floating stat badges. */}
      <m.div
        className="relative mx-auto flex w-full max-w-[19rem] items-center justify-center sm:max-w-sm lg:col-span-5 lg:max-w-md lg:self-center"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <div className="relative aspect-square w-full">
          <svg
            className="absolute -inset-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)] animate-[spin_40s_linear_infinite] text-accent transition-colors duration-500"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <circle cx="50" cy="50" r="49" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1.5 3" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 rounded-full bg-accent/20 blur-3xl transition-colors duration-500" aria-hidden="true" />
          <img
            src={site.hero.imageUrl}
            alt={t("about.imageAlt")}
            width="800"
            height="923"
            fetchPriority="high"
            className="relative h-full w-full rounded-full border border-line object-cover object-[center_15%] shadow-2xl"
          />

          <div className="absolute -right-2 -bottom-3 flex flex-col gap-2 sm:-right-4 sm:gap-3 lg:-right-2 xl:-right-3 2xl:-right-8">
            <m.div
              className="flex items-center gap-2 rounded-2xl border border-line bg-panel/90 px-3 py-2 shadow-xl backdrop-blur sm:gap-3 sm:px-4 sm:py-3"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <CountUp value={projects.length} className="text-2xl font-extrabold text-accent transition-colors duration-500 sm:text-3xl" />
              <span className="max-w-24 text-xs leading-tight text-slate-300 sm:text-sm">{t("hero.stats.projects")}</span>
            </m.div>
            <m.div
              className="flex items-center gap-2 rounded-2xl border border-line bg-panel/90 px-3 py-2 shadow-xl backdrop-blur sm:gap-3 sm:px-4 sm:py-3"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            >
              <CountUp value={skills.length} className="text-2xl font-extrabold text-accent transition-colors duration-500 sm:text-3xl" />
              <span className="max-w-24 text-xs leading-tight text-slate-300 sm:text-sm">{t("hero.stats.skills")}</span>
            </m.div>
          </div>
        </div>
      </m.div>
    </section>
  );
}
