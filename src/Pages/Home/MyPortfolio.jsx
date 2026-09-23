import { useTranslation } from "react-i18next";
import data from "../../data/index.json";
import siteContent from "../../data/site.json";
import { ArrowIcon, GithubIcon } from "../../components/Icons";
import { localize } from "../../utils/localize";

const DOMAINS = ["dev", "data"];

function ProjectCard({ project, lang }) {
  const { t } = useTranslation();
  const title = localize(project.title, lang);
  const mainUrl = project.site || project.repo;

  return (
    <div className="portfolio--section--img">
      <a href={mainUrl} target="_blank" rel="noreferrer" tabIndex={-1} aria-hidden="true">
        <img src={project.src} alt="" width="1200" height="900" loading="lazy" />
      </a>
      <div className="portfolio--section--card--content">
        <div>
          <h4 className="portfolio--section--title">{title}</h4>
          <p className="text-md">{localize(project.description, lang)}</p>
        </div>
        <div className="portfolio--links">
          {project.repo && (
            <a href={project.repo} target="_blank" rel="noreferrer" aria-label={t("portfolio.links.githubLabel", { title })}>
              <span className="text-sm portfolio--link">
                {t("portfolio.links.github")}
                <ArrowIcon />
              </span>
            </a>
          )}
          {project.site && (
            <a href={project.site} target="_blank" rel="noreferrer" aria-label={t("portfolio.links.siteLabel", { title })}>
              <span className="text-sm portfolio--link">
                {t("portfolio.links.site")}
                <ArrowIcon />
              </span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyPortfolio() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage;

  return (
    <section className="portfolio--section" id="MyPortfolio">
      <div className="portfolio--container--box">
        <div className="portfolio--container">
          <h2 className="sections--heading">{t("portfolio.title")}</h2>
        </div>
        <div>
          <a href={siteContent.githubUrl} target="_blank" rel="noreferrer" className="btn btn-github">
            <GithubIcon size={28} />
            {t("portfolio.github")}
          </a>
        </div>
      </div>
      {DOMAINS.map((domain) => {
        const projects = data.portfolio.filter((project) => project.domain === domain);
        if (projects.length === 0) return null;
        return (
          <div key={domain} className="portfolio--domain--section">
            <h3 className="portfolio--domain--title">{t(`portfolio.domains.${domain}`)}</h3>
            <div className="portfolio--section--container">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} lang={lang} />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
