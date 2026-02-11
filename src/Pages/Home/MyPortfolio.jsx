import data from "../../data/index.json";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { db } from "../../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default function MyPortfolio() {
  const { t, i18n } = useTranslation();
  const [dynamicProjects, setDynamicProjects] = useState([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data()
        }));
        setDynamicProjects(list);
      } catch (error) {
        console.error("Erreur chargement projects:", error);
      }
    };

    loadProjects();
  }, []);

  // Create mapping of project titles to translations
  const projectTitleMap = {
    "My Portfolio": t('portfolio.projects.0.title'),
    "LuxeDrive": t('portfolio.projects.1.title'),
    "CMCIEA-France": t('portfolio.projects.2.title'),
    "Analyse BMW - Data Warehouse": t('portfolio.projects.3.title'),
  };

  const projectDescriptionMap = {
    "Un portfolio conçu en React pour présenter mes projets, mes compétences et mon parcours, avec une interface moderne, responsive et orientée expérience utilisateur.": t('portfolio.projects.0.description'),
    "Plateforme fullstack de location de voitures de luxe inspirée d'Airbnb. Système d'authentification sécurisé, espace d'administration, tableau de bord dynamique avec visualisation des ventes. Développé en autonomie avec Ruby on Rails, Bootstrap et versioning Git.": t('portfolio.projects.1.description'),
    "Site institutionnel moderne et responsive pour la Communauté Missionnaire Chrétienne Internationale & Églises Associées France. Déploiement sur Heroku et gestion du nom de domaine via Namecheap.": t('portfolio.projects.2.description'),
    "Projet Data Analysis : Conception d'un Data Warehouse structuré pour analyser les ventes BMW. Analyse exploratoire avec Python (pandas, matplotlib) pour identifier les modèles rentables et tendances par région. Dashboards Power BI interactifs avec recommandations stratégiques orientées client.": t('portfolio.projects.3.description'),
  };

  const projects = dynamicProjects.length > 0 ? dynamicProjects : data?.portfolio || [];
  const lang = i18n.language || "fr";

  return (
    <section className="portfolio--section" id="MyPortfolio">
      <div className="portfolio--container--box">
        <div className="portfolio--container">
          <p className="sub-title"></p>
          <h2 className="sections--heading">{t('portfolio.title')}</h2>
        </div>
        <div>
          <a
            href="https://github.com/John-Dav9"
            target="_blank"
            rel="noreferrer"
            className="btn btn-github"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 33 33"
              fill="none"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.3333 0.166748C7.50028 0.166748 0.333252 7.33378 0.333252 16.1667C0.333252 24.9997 7.50028 32.1667 16.3333 32.1667C25.1489 32.1667 32.3333 24.9997 32.3333 16.1667C32.3333 7.33378 25.1489 0.166748 16.3333 0.166748ZM26.9016 7.54202C28.8105 9.8674 29.9559 12.8348 29.9906 16.0452C29.5394 15.9585 25.0274 15.0387 20.4808 15.6114C20.3767 15.3858 20.2899 15.1428 20.1858 14.8999C19.9081 14.2405 19.5958 13.5637 19.2834 12.9216C24.3159 10.8739 26.6066 7.9238 26.9016 7.54202ZM16.3333 2.52684C19.804 2.52684 22.9797 3.82836 25.3919 5.96285C25.1489 6.30992 23.0838 9.06914 18.2248 10.8912C15.9862 6.77846 13.5047 3.41187 13.1229 2.89126C14.1467 2.64831 15.2227 2.52684 16.3333 2.52684ZM10.5199 3.811C10.8843 4.2969 13.3138 7.68085 15.5871 11.7068C9.20093 13.4075 3.56102 13.3728 2.95364 13.3728C3.83867 9.13855 6.70201 5.61577 10.5199 3.811ZM2.65863 16.1841C2.65863 16.0452 2.65863 15.9064 2.65863 15.7676C3.24865 15.7849 9.87772 15.8717 16.6977 13.824C17.0969 14.5875 17.4613 15.3684 17.8084 16.1493C17.6348 16.2014 17.4439 16.2535 17.2704 16.3055C10.2248 18.5788 6.47642 24.7914 6.16405 25.312C3.99485 22.8999 2.65863 19.6895 2.65863 16.1841ZM16.3333 29.8413C13.1749 29.8413 10.2595 28.7654 7.95147 26.9606C8.19442 26.4574 10.971 21.1125 18.676 18.4227C18.7107 18.4053 18.7281 18.4053 18.7628 18.388C20.689 23.3684 21.47 27.5506 21.6782 28.748C20.0296 29.4595 18.2248 29.8413 16.3333 29.8413ZM23.9515 27.4986C23.8127 26.6656 23.0838 22.6743 21.2964 17.7632C25.5828 17.0864 29.3311 18.1971 29.7997 18.3533C29.2097 22.1537 27.0231 25.4335 23.9515 27.4986Z"
                fill="currentColor"
              />
            </svg>
            Mon GitHub
          </a>
        </div>
      </div>
      <div className="portfolio--section--container">
        {projects?.map((item) => (
          <div key={item.id} className="portfolio--section--img">
            <a href={item.site} target="_blank" rel="noreferrer">
              <img
                src={item.imageUrl || item.src}
                alt={projectTitleMap[item.title] || item.title || item.title?.[lang]}
                loading="lazy"
              />
            </a>
            <div className="portfolio--section--card--content">
              <div>
                <h3 className="portfolio--section--title">
                  {item.title?.[lang] || projectTitleMap[item.title] || item.title}
                </h3>
                <p className="text-md">
                  {item.description?.[lang] || projectDescriptionMap[item.description] || item.description}
                </p>
              </div>
              <div className="portfolio--links">
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noreferrer" aria-label="Voir sur GitHub">
                    <p className="text-sm portfolio--link">
                      {t('portfolio.links.github')}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 20 19"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M4.66667 1.66675H18V15.0001M18 1.66675L2 17.6667L18 1.66675Z"
                          stroke="currentColor"
                          strokeWidth="2.66667"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </p>
                  </a>
                ) : null}
                {item.site ? (
                  <a href={item.site} target="_blank" rel="noreferrer" aria-label="Voir le site">
                    <p className="text-sm portfolio--link">
                      {t('portfolio.links.site')}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 20 19"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M4.66667 1.66675H18V15.0001M18 1.66675L2 17.6667L18 1.66675Z"
                          stroke="currentColor"
                          strokeWidth="2.66667"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </p>
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
