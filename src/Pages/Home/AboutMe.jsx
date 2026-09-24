import { useTranslation } from "react-i18next";
import { useContent } from "../../components/ContentContext";
import { localize } from "../../utils/localize";
import { RichText } from "../../utils/richText";
import SectionHeading from "../../components/SectionHeading";
import { Reveal, trackSpotlight } from "../../components/motion";

const DOT_COLORS = { dev: "bg-dev", data: "bg-data", other: "bg-slate-400" };

export default function AboutMe() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage;
  const { site, timeline } = useContent();

  return (
    <section id="AboutMe" className="mx-auto max-w-7xl px-5 py-12 sm:py-14 md:px-8 lg:py-16">
      <SectionHeading index="02" title={t("about.title")} />
      <div className="grid gap-10 lg:grid-cols-12">
        <Reveal className="rich flex flex-col gap-5 text-lg leading-relaxed text-slate-300 lg:col-span-7">
          <RichText as="p" text={t("about.description1")} />
          <RichText as="p" text={t("about.description2")} />
        </Reveal>
        <div className="flex flex-col gap-4 lg:col-span-5">
          <Reveal delay={0.1} className="spotlight mx-auto w-full max-w-sm overflow-hidden rounded-3xl lg:max-w-none" onPointerMove={trackSpotlight}>
            <img
              src={site.about.imageUrl}
              alt={t("about.imageAlt")}
              width="800"
              height="1067"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover object-[center_20%] lg:aspect-[4/3.4]"
            />
          </Reveal>
          <Reveal delay={0.2} className="mx-auto w-full max-w-sm lg:max-w-none">
            <h3 className="mb-3 font-mono text-sm text-slate-400">{t("about.education")}</h3>
            <ol className="relative flex flex-col gap-4 border-l border-line pl-6">
              {timeline.map((step) => {
                const title = localize(step.title, lang);
                const detail = localize(step.detail, lang);
                return (
                  <li key={step.id} className="relative">
                    <span
                      className={`absolute top-1.5 -left-[29px] h-2.5 w-2.5 rounded-full ${DOT_COLORS[step.kind] ?? DOT_COLORS.other} ${
                        step.current ? "animate-pulse-ring" : ""
                      }`}
                      aria-hidden="true"
                    />
                    <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-mono text-xs text-accent transition-colors duration-500">{step.period}</span>
                      {step.url ? (
                        <a href={step.url} target="_blank" rel="noreferrer" className="font-semibold text-white hover:text-accent">
                          {title}
                        </a>
                      ) : (
                        <span className="font-semibold text-white">{title}</span>
                      )}
                      {step.current && (
                        <span className="rounded-full border border-data/40 px-2 py-0.5 text-[11px] text-data">{t("about.current")}</span>
                      )}
                    </p>
                    {detail && <p className="text-sm text-slate-400">{detail}</p>}
                  </li>
                );
              })}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
