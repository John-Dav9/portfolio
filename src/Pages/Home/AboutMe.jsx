import { useTranslation } from "react-i18next";
import siteContent from "../../data/site.json";
import { RichText } from "../../utils/richText";
import SectionHeading from "../../components/SectionHeading";
import { Reveal, trackSpotlight } from "../../components/motion";

const SCHOOLS = [
  { name: "Le Wagon", url: "https://www.lewagon.com/fr/web-development-course", key: "about.lewagon", color: "bg-dev" },
  {
    name: "Technofutur TIC",
    url: "https://technofuturtic.be/catalogue/formation/developpeur-web-oriente-data-analysis",
    key: "about.technofutur",
    color: "bg-data",
  },
];

export default function AboutMe() {
  const { t } = useTranslation();

  return (
    <section id="AboutMe" className="mx-auto max-w-7xl px-5 py-20 md:px-8">
      <SectionHeading index="02" title={t("about.title")} />
      <div className="grid gap-10 lg:grid-cols-12">
        <Reveal className="rich flex flex-col gap-5 text-lg leading-relaxed text-slate-300 lg:col-span-7">
          <RichText as="p" text={t("about.description1")} />
          <RichText as="p" text={t("about.description2")} />
        </Reveal>
        <div className="flex flex-col gap-4 lg:col-span-5">
          <Reveal delay={0.1} className="spotlight overflow-hidden rounded-3xl" onPointerMove={trackSpotlight}>
            <img
              src={siteContent.about.imageUrl}
              alt={t("about.imageAlt")}
              width="800"
              height="1067"
              loading="lazy"
              className="h-72 w-full object-cover object-top"
            />
          </Reveal>
          <Reveal delay={0.2}>
            <h3 className="mb-3 font-mono text-sm text-slate-400">{t("about.education")}</h3>
            <ol className="relative flex flex-col gap-3 border-l border-line pl-6">
              {SCHOOLS.map((school) => (
                <li key={school.name} className="relative">
                  <span className={`absolute top-2 -left-[29px] h-2.5 w-2.5 rounded-full ${school.color}`} aria-hidden="true" />
                  <a href={school.url} target="_blank" rel="noreferrer" className="font-semibold text-white hover:text-accent">
                    {school.name}
                  </a>
                  <p className="text-sm text-slate-400">{t(school.key)}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
