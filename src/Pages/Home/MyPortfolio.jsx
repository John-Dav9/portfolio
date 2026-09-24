import { useTranslation } from "react-i18next";
import { m } from "motion/react";
import { useContent } from "../../components/ContentContext";
import { ArrowIcon, GithubIcon } from "../../components/Icons";
import { localize } from "../../utils/localize";
import { useFocus } from "../../components/FocusContext";
import SectionHeading from "../../components/SectionHeading";
import { revealGroup, revealItem, trackSpotlight } from "../../components/motion";

function ProjectCard({ project, lang, highlighted }) {
  const { t } = useTranslation();
  const title = localize(project.title, lang);
  const mainUrl = project.site || project.repo;

  return (
    <m.article
      variants={revealItem}
      onPointerMove={trackSpotlight}
      className={`spotlight group flex flex-col overflow-hidden rounded-3xl ${highlighted ? "" : "opacity-45 hover:opacity-100"}`}
    >
      <a href={mainUrl} target="_blank" rel="noreferrer" tabIndex={-1} aria-hidden="true" className="block overflow-hidden">
        <img
          src={project.src}
          alt=""
          width="1200"
          height="900"
          loading="lazy"
          className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </a>
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <span
          className={`self-start rounded-full px-2.5 py-1 font-mono text-xs font-semibold text-ink ${
            project.domain === "dev" ? "bg-dev" : "bg-data"
          }`}
        >
          {t(`portfolio.domains.${project.domain}`)}
        </span>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-slate-400" title={localize(project.description, lang)}>
          {localize(project.description, lang)}
        </p>
        {project.stack?.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 pt-1" aria-label={t("portfolio.stack")}>
            {project.stack.map((tech) => (
              <li key={tech} className="rounded-md border border-line bg-ink/60 px-2 py-0.5 font-mono text-[11px] text-slate-300">
                {tech}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex flex-wrap gap-4 pt-2 text-sm font-semibold">
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              aria-label={t("portfolio.links.githubLabel", { title })}
              className="inline-flex items-center gap-2 text-slate-200 hover:text-accent"
            >
              {t("portfolio.links.github")} <ArrowIcon />
            </a>
          )}
          {project.site && (
            <a
              href={project.site}
              target="_blank"
              rel="noreferrer"
              aria-label={t("portfolio.links.siteLabel", { title })}
              className="inline-flex items-center gap-2 text-slate-200 hover:text-accent"
            >
              {t("portfolio.links.site")} <ArrowIcon />
            </a>
          )}
        </div>
      </div>
    </m.article>
  );
}

export default function MyPortfolio() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage;
  const { focus } = useFocus();
  const { site, projects } = useContent();

  return (
    <section id="MyPortfolio" className="mx-auto max-w-7xl px-5 py-12 sm:py-14 md:px-8 lg:py-16">
      <SectionHeading index="03" title={t("portfolio.title")}>
        <a
          href={site.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:border-accent hover:text-accent"
        >
          <GithubIcon size={18} />
          {t("portfolio.github")}
        </a>
      </SectionHeading>
      <m.div
        // 4 per row, or 3 when a lone card would be left on the last row (5, 9… projects).
        className={`grid gap-5 sm:grid-cols-2 ${projects.length % 4 === 1 ? "lg:grid-cols-3" : "xl:grid-cols-4"}`}
        variants={revealGroup}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} lang={lang} highlighted={project.domain === focus} />
        ))}
      </m.div>
    </section>
  );
}
