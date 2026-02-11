import data from "../../data/index.json";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { db } from "../../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default function MySkills() {
  const { t, i18n } = useTranslation();
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [dynamicSkills, setDynamicSkills] = useState([]);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const q = query(collection(db, "skills"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data()
        }));
        setDynamicSkills(list);
      } catch (error) {
        console.error("Erreur chargement skills:", error);
      }
    };

    loadSkills();
  }, []);

  const skills = dynamicSkills.length > 0 ? dynamicSkills : data?.skills || [];
  const displayedSkills = showAllSkills ? skills : skills.slice(0, 8);
  const lang = i18n.language || "fr";

  // Create a mapping of titles to translations
  const skillTitleMap = {
    "Front-End Development": t('skills.frontend.title'),
    "Back-End Development": t('skills.backend.title'),
    "Bases de Données & SQL": t('skills.database.title'),
    "Data Analysis & BI": t('skills.dataAnalysis.title'),
    "Déploiement & DevOps": t('skills.deployment.title'),
    "Gestion de Projet Agile": t('skills.agile.title'),
    "Design UX/UI": t('skills.uxui.title'),
    "Git & Outils Dev": t('skills.git.title'),
  };

  const skillDescriptionMap = {
    "Création d'interfaces utilisateur réactives et intuitives avec HTML, CSS, JavaScript (ES6+), React, Angular, Vue.js et TypeScript. Maîtrise de Flexbox, Grid et Bootstrap pour des designs responsive.": t('skills.frontend.description'),
    "Développement d'APIs robustes et sécurisées avec Ruby on Rails, Node.js, NestJS, Express et ASP.NET. Gestion de l'authentification JWT et intégration d'APIs REST.": t('skills.backend.description'),
    "Expertise en PostgreSQL et SQL Server pour la conception, modélisation et optimisation de bases de données. Maîtrise de SSMS (SQL Server Management Studio) pour la gestion avancée.": t('skills.database.description'),
    "Analyse de données avec Python (pandas, NumPy, matplotlib, seaborn), SQL et Power BI. Création de dashboards interactifs, data cleaning, modélisation et visualisation décisionnelle pour transformer les données en insights stratégiques.": t('skills.dataAnalysis.description'),
    "Déploiement d'applications sur Heroku, gestion de domaines (Namecheap), configuration serveur et mise en production d'applications web fullstack en autonomie.": t('skills.deployment.description'),
    "Application de méthodologies agiles (Scrum, Kanban) avec des outils comme Trello pour la gestion de tâches, collaboration en équipe et suivi de progression des projets.": t('skills.agile.description'),
    "Conception orientée utilisateur et prototypage avec Figma et Canva. Création de maquettes interactives pour valider l'expérience utilisateur avant le développement.": t('skills.uxui.description'),
    "Maîtrise de Git/GitHub pour le versioning, Visual Studio Code, Postman pour les tests d'API, et workflow collaboratif en équipe avec gestion des branches et pull requests.": t('skills.git.description'),
  };

  const handleSkillClick = (skill) => {
    setSelectedSkill(skill);
  };

  const closeModal = () => {
    setSelectedSkill(null);
  };

  return (
    <section className="skills--section" id="MySkills">
      <div className="portfolio--container">
        <p className="section--title"></p>
        <h2 className="skills--section--heading">{t('skills.title')}</h2>
      </div>
      <div className="skills--section--container">
        {displayedSkills?.map((item) => (
          <div 
            key={item.id} 
            className="skills--section--card"
            onClick={() => handleSkillClick(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSkillClick(item)}
          >
            <div className="skills--section--img">
              <img
                src={item.imageUrl || item.src}
                alt={skillTitleMap[item.title] || item.title || item.title?.[lang] || ""}
                loading="lazy"
              />
            </div>
            <div className="skills--section--card--content">
              <h3 className="skills--section--title">
                {item.title?.[lang] || skillTitleMap[item.title] || item.title}
              </h3>
              <span className="skills--card--learn-more">
                {t('skills.learnMore') || 'En savoir plus'}
              </span>
            </div>
          </div>
        ))}
      </div>
      {skills.length > 8 && (
        <div className="skills--see--all-wrapper">
          <button 
            onClick={() => setShowAllSkills(!showAllSkills)} 
            className="btn-outline-primary" 
            type="button">
            {showAllSkills ? t('show Less') || "Voir moins" : `${t('show All') || "Voir tous mes expertises"} (${skills.length})`}
          </button>
        </div>
      )}

      {/* Skill Modal */}
      {selectedSkill && (
        <div className="skills--modal--overlay" onClick={closeModal}>
          <div className="skills--modal--content" onClick={(e) => e.stopPropagation()}>
            <button className="skills--modal--close" onClick={closeModal} aria-label="Close modal">
              ×
            </button>
            <div className="skills--modal--header">
              <img
                src={selectedSkill.imageUrl || selectedSkill.src}
                alt={skillTitleMap[selectedSkill.title] || selectedSkill.title || selectedSkill.title?.[lang]}
                className="skills--modal--img"
              />
              <h2>{selectedSkill.title?.[lang] || skillTitleMap[selectedSkill.title] || selectedSkill.title}</h2>
            </div>
            <p className="skills--modal--description">
              {selectedSkill.description?.[lang] ||
                skillDescriptionMap[selectedSkill.description] ||
                selectedSkill.description}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
