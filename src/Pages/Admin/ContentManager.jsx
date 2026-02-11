import { useEffect, useState } from "react";
import { auth, db, storage } from "../../firebase";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../../Admin.css";
import data from "../../data/index.json";
import frLocale from "../../locales/fr.json";
import enLocale from "../../locales/en.json";

const emptyLocale = { fr: "", en: "" };

const defaultHomeContent = {
  hero: {
    title: { ...emptyLocale },
    subtitle: { ...emptyLocale },
    subtitleSuffix: { ...emptyLocale },
    description: { ...emptyLocale },
    description_continued: { ...emptyLocale },
    ctaLabel: { ...emptyLocale },
    ctaUrl: "",
    imageUrl: ""
  },
  about: {
    title: { ...emptyLocale },
    description1: { ...emptyLocale },
    description2: { ...emptyLocale },
    imageUrl: ""
  }
};

const defaultFooterLinks = {
  facebook: "",
  instagram: "",
  twitter: "",
  linkedin: ""
};

const defaultCvLinks = {
  dev: { fr: "", en: "" },
  data: { fr: "", en: "" }
};

const skillKeyByTitle = {
  "Front-End Development": "frontend",
  "Back-End Development": "backend",
  "Bases de Données & SQL": "database",
  "Data Analysis & BI": "dataAnalysis",
  "Déploiement & DevOps": "deployment",
  "Gestion de Projet Agile": "agile",
  "UX/UI Design": "uxui",
  "Git & Outils Dev": "git"
};

const normalizeImagePath = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return path.startsWith("/") ? path : path.replace("./", "/");
};

export default function ContentManager({ showHeader = true }) {
  const [user, setUser] = useState(null);
  const [homeContent, setHomeContent] = useState(defaultHomeContent);
  const [footerLinks, setFooterLinks] = useState(defaultFooterLinks);
  const [cvLinks, setCvLinks] = useState(defaultCvLinks);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [heroImageFile, setHeroImageFile] = useState(null);
  const [aboutImageFile, setAboutImageFile] = useState(null);
  const [cvFiles, setCvFiles] = useState({
    devFr: null,
    devEn: null,
    dataFr: null,
    dataEn: null
  });

  const [skillForm, setSkillForm] = useState({
    id: null,
    title: { ...emptyLocale },
    description: { ...emptyLocale },
    imageUrl: "",
    imageFile: null
  });

  const [projectForm, setProjectForm] = useState({
    id: null,
    title: { ...emptyLocale },
    description: { ...emptyLocale },
    imageUrl: "",
    imageFile: null,
    url: "",
    site: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadAll();
      } else {
        navigate("/admin/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadAll = async () => {
    setLoading(true);
    try {
      await seedIfEmpty();
      await Promise.all([loadHomeContent(), loadFooterLinks(), loadCvLinks(), loadSkills(), loadProjects()]);
    } catch (error) {
      console.error("Erreur chargement contenu:", error);
    } finally {
      setLoading(false);
    }
  };

  const seedIfEmpty = async () => {
    const [homeSnap, footerSnap, skillsSnap, projectsSnap] = await Promise.all([
      getDoc(doc(db, "siteContent", "home")),
      getDoc(doc(db, "siteContent", "footer")),
      getDocs(query(collection(db, "skills"), orderBy("createdAt", "desc"))),
      getDocs(query(collection(db, "projects"), orderBy("createdAt", "desc")))
    ]);

    if (!homeSnap.exists()) {
      const hero = {
        title: { fr: frLocale.hero.title, en: enLocale.hero.title },
        subtitle: { fr: frLocale.hero.subtitle, en: enLocale.hero.subtitle },
        subtitleSuffix: { fr: "& Data Analyst", en: "& Data Analyst" },
        description: { fr: frLocale.hero.description, en: enLocale.hero.description },
        description_continued: {
          fr: frLocale.hero.description_continued,
          en: enLocale.hero.description_continued
        },
        ctaLabel: { fr: frLocale.hero.cta_button, en: enLocale.hero.cta_button },
        ctaUrl: "https://www.canva.com/design/DAGRbJFBCcQ/ENKhhjbSAB3NvhZBzzCISA/view",
        imageUrl: "/img/copie 3.JPG"
      };

      const about = {
        title: { fr: frLocale.about.title, en: enLocale.about.title },
        description1: { fr: frLocale.about.description1, en: enLocale.about.description1 },
        description2: { fr: frLocale.about.description2, en: enLocale.about.description2 },
        imageUrl: "/img/copie 2.JPG"
      };

      await setDoc(doc(db, "siteContent", "home"), {
        hero,
        about,
        updatedAt: serverTimestamp()
      });
    }

    if (!footerSnap.exists()) {
      await setDoc(doc(db, "siteContent", "footer"), {
        socialLinks: {
          facebook: "https://www.facebook.com/",
          instagram: "https://www.instagram.com/",
          twitter: "https://www.twitter.com/",
          linkedin: "https://www.linkedin.com/in/jd-tchomgui"
        },
        updatedAt: serverTimestamp()
      });
    }

    const cvSnap = await getDoc(doc(db, "siteContent", "cv"));
    if (!cvSnap.exists()) {
      await setDoc(doc(db, "siteContent", "cv"), {
        links: defaultCvLinks,
        updatedAt: serverTimestamp()
      });
    }

    if (skillsSnap.empty) {
      const skillsToSeed = (data?.skills || []).map((skill) => {
        const key = skillKeyByTitle[skill.title];
        return {
          title: {
            fr: frLocale.skills?.[key]?.title || skill.title,
            en: enLocale.skills?.[key]?.title || skill.title
          },
          description: {
            fr: frLocale.skills?.[key]?.description || skill.description,
            en: enLocale.skills?.[key]?.description || skill.description
          },
          imageUrl: normalizeImagePath(skill.src),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
      });

      for (const item of skillsToSeed) {
        await addDoc(collection(db, "skills"), item);
      }
    }

    if (projectsSnap.empty) {
      const projectsToSeed = (data?.portfolio || []).map((project, index) => ({
        title: {
          fr: frLocale.portfolio?.projects?.[index]?.title || project.title,
          en: enLocale.portfolio?.projects?.[index]?.title || project.title
        },
        description: {
          fr: frLocale.portfolio?.projects?.[index]?.description || project.description,
          en: enLocale.portfolio?.projects?.[index]?.description || project.description
        },
        imageUrl: normalizeImagePath(project.src),
        url: project.url || "",
        site: project.site || "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }));

      for (const item of projectsToSeed) {
        await addDoc(collection(db, "projects"), item);
      }
    }
  };

  const loadHomeContent = async () => {
    const docRef = doc(db, "siteContent", "home");
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      setHomeContent({
        ...defaultHomeContent,
        ...snapshot.data()
      });
    }
  };

  const loadFooterLinks = async () => {
    const docRef = doc(db, "siteContent", "footer");
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      setFooterLinks({
        ...defaultFooterLinks,
        ...(data.socialLinks || {})
      });
    }
  };

  const loadCvLinks = async () => {
    const docRef = doc(db, "siteContent", "cv");
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      setCvLinks({
        ...defaultCvLinks,
        ...(data.links || {})
      });
    }
  };

  const loadSkills = async () => {
    const q = query(collection(db, "skills"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data()
    }));
    setSkills(data);
  };

  const loadProjects = async () => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data()
    }));
    setProjects(data);
  };

  const uploadImage = async (file, pathPrefix) => {
    const safeName = file.name.replace(/\s+/g, "-");
    const storageRef = ref(storage, `${pathPrefix}/${Date.now()}-${safeName}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const uploadFile = async (file, path) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSaveHome = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let heroImageUrl = homeContent.hero.imageUrl;
      let aboutImageUrl = homeContent.about.imageUrl;

      if (heroImageFile) {
        heroImageUrl = await uploadImage(heroImageFile, "site/hero");
      }
      if (aboutImageFile) {
        aboutImageUrl = await uploadImage(aboutImageFile, "site/about");
      }

      const payload = {
        hero: {
          ...homeContent.hero,
          imageUrl: heroImageUrl
        },
        about: {
          ...homeContent.about,
          imageUrl: aboutImageUrl
        },
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, "siteContent", "home"), payload, { merge: true });
      setHeroImageFile(null);
      setAboutImageFile(null);
      alert("✅ Contenu Accueil/À propos mis à jour");
    } catch (error) {
      console.error("Erreur sauvegarde home:", error);
      alert("❌ Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFooter = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(
        doc(db, "siteContent", "footer"),
        { socialLinks: footerLinks, updatedAt: serverTimestamp() },
        { merge: true }
      );
      alert("✅ Liens réseaux sociaux mis à jour");
    } catch (error) {
      console.error("Erreur sauvegarde footer:", error);
      alert("❌ Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCv = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let nextLinks = { ...cvLinks };

      if (cvFiles.devFr) {
        nextLinks = { ...nextLinks, dev: { ...nextLinks.dev, fr: await uploadFile(cvFiles.devFr, "cv/dev/fr.pdf") } };
      }
      if (cvFiles.devEn) {
        nextLinks = { ...nextLinks, dev: { ...nextLinks.dev, en: await uploadFile(cvFiles.devEn, "cv/dev/en.pdf") } };
      }
      if (cvFiles.dataFr) {
        nextLinks = { ...nextLinks, data: { ...nextLinks.data, fr: await uploadFile(cvFiles.dataFr, "cv/data/fr.pdf") } };
      }
      if (cvFiles.dataEn) {
        nextLinks = { ...nextLinks, data: { ...nextLinks.data, en: await uploadFile(cvFiles.dataEn, "cv/data/en.pdf") } };
      }

      await setDoc(
        doc(db, "siteContent", "cv"),
        { links: nextLinks, updatedAt: serverTimestamp() },
        { merge: true }
      );

      setCvLinks(nextLinks);
      setCvFiles({ devFr: null, devEn: null, dataFr: null, dataEn: null });
      alert("✅ CV mis à jour");
    } catch (error) {
      console.error("Erreur sauvegarde CV:", error);
      alert("❌ Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const resetSkillForm = () => {
    setSkillForm({
      id: null,
      title: { ...emptyLocale },
      description: { ...emptyLocale },
      imageUrl: "",
      imageFile: null
    });
  };

  const resetProjectForm = () => {
    setProjectForm({
      id: null,
      title: { ...emptyLocale },
      description: { ...emptyLocale },
      imageUrl: "",
      imageFile: null,
      url: "",
      site: ""
    });
  };

  const handleSaveSkill = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = skillForm.imageUrl;
      if (skillForm.imageFile) {
        imageUrl = await uploadImage(skillForm.imageFile, "skills");
      }

      const payload = {
        title: skillForm.title,
        description: skillForm.description,
        imageUrl: imageUrl || "",
        updatedAt: serverTimestamp()
      };

      if (skillForm.id) {
        await updateDoc(doc(db, "skills", skillForm.id), payload);
      } else {
        await addDoc(collection(db, "skills"), {
          ...payload,
          createdAt: serverTimestamp()
        });
      }

      await loadSkills();
      resetSkillForm();
      alert("✅ Compétence enregistrée");
    } catch (error) {
      console.error("Erreur sauvegarde skill:", error);
      alert("❌ Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleEditSkill = (item) => {
    setSkillForm({
      id: item.id,
      title: item.title || { ...emptyLocale },
      description: item.description || { ...emptyLocale },
      imageUrl: item.imageUrl || "",
      imageFile: null
    });
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm("Supprimer cette compétence ?")) return;
    setSaving(true);
    try {
      await deleteDoc(doc(db, "skills", id));
      await loadSkills();
      alert("🗑️ Compétence supprimée");
    } catch (error) {
      console.error("Erreur suppression skill:", error);
      alert("❌ Erreur lors de la suppression");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = projectForm.imageUrl;
      if (projectForm.imageFile) {
        imageUrl = await uploadImage(projectForm.imageFile, "projects");
      }

      const payload = {
        title: projectForm.title,
        description: projectForm.description,
        imageUrl: imageUrl || "",
        url: projectForm.url || "",
        site: projectForm.site || "",
        updatedAt: serverTimestamp()
      };

      if (projectForm.id) {
        await updateDoc(doc(db, "projects", projectForm.id), payload);
      } else {
        await addDoc(collection(db, "projects"), {
          ...payload,
          createdAt: serverTimestamp()
        });
      }

      await loadProjects();
      resetProjectForm();
      alert("✅ Projet enregistré");
    } catch (error) {
      console.error("Erreur sauvegarde project:", error);
      alert("❌ Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleEditProject = (item) => {
    setProjectForm({
      id: item.id,
      title: item.title || { ...emptyLocale },
      description: item.description || { ...emptyLocale },
      imageUrl: item.imageUrl || "",
      imageFile: null,
      url: item.url || "",
      site: item.site || ""
    });
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Supprimer ce projet ?")) return;
    setSaving(true);
    try {
      await deleteDoc(doc(db, "projects", id));
      await loadProjects();
      alert("🗑️ Projet supprimé");
    } catch (error) {
      console.error("Erreur suppression project:", error);
      alert("❌ Erreur lors de la suppression");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-loading">Chargement...</div>
      </div>
    );
  }

  return (
    <div className={showHeader ? "admin-dashboard" : ""}>
      {showHeader && (
        <header className="admin-header">
          <div className="admin-header-content">
            <h1>🛠️ Gestion du Contenu</h1>
            <div className="admin-header-actions">
              <span className="admin-user-info">👤 {user?.email}</span>
              <button onClick={() => navigate("/admin/dashboard")} className="admin-back-btn">
                ← Dashboard
              </button>
            </div>
          </div>
        </header>
      )}

      <div className="admin-content">
        <section className="admin-section">
          <h2>Accueil (Hero)</h2>
          <form onSubmit={handleSaveHome} className="admin-form">
            <div className="admin-form-grid">
              <div className="admin-form-block">
                <h3>FR</h3>
                <label>
                  Titre
                  <input
                    type="text"
                    value={homeContent.hero.title.fr}
                    onChange={(e) =>
                      setHomeContent((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, title: { ...prev.hero.title, fr: e.target.value } }
                      }))
                    }
                  />
                </label>
                <label>
                  Sous-titre
                  <input
                    type="text"
                    value={homeContent.hero.subtitle.fr}
                    onChange={(e) =>
                      setHomeContent((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, subtitle: { ...prev.hero.subtitle, fr: e.target.value } }
                      }))
                    }
                  />
                </label>
                <label>
                  Ligne 2 (suffixe)
                  <input
                    type="text"
                    value={homeContent.hero.subtitleSuffix.fr}
                    onChange={(e) =>
                      setHomeContent((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          subtitleSuffix: { ...prev.hero.subtitleSuffix, fr: e.target.value }
                        }
                      }))
                    }
                  />
                </label>
                <label>
                  Description
                  <textarea
                    rows="4"
                    value={homeContent.hero.description.fr}
                    onChange={(e) =>
                      setHomeContent((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, description: { ...prev.hero.description, fr: e.target.value } }
                      }))
                    }
                  />
                </label>
                <label>
                  Description (suite avec liens)
                  <textarea
                    rows="3"
                    value={homeContent.hero.description_continued.fr}
                    onChange={(e) =>
                      setHomeContent((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          description_continued: { ...prev.hero.description_continued, fr: e.target.value }
                        }
                      }))
                    }
                  />
                </label>
                <label>
                  Bouton (texte)
                  <input
                    type="text"
                    value={homeContent.hero.ctaLabel.fr}
                    onChange={(e) =>
                      setHomeContent((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, ctaLabel: { ...prev.hero.ctaLabel, fr: e.target.value } }
                      }))
                    }
                  />
                </label>
              </div>

              <div className="admin-form-block">
                <h3>EN</h3>
                <label>
                  Title
                  <input
                    type="text"
                    value={homeContent.hero.title.en}
                    onChange={(e) =>
                      setHomeContent((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, title: { ...prev.hero.title, en: e.target.value } }
                      }))
                    }
                  />
                </label>
                <label>
                  Subtitle
                  <input
                    type="text"
                    value={homeContent.hero.subtitle.en}
                    onChange={(e) =>
                      setHomeContent((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, subtitle: { ...prev.hero.subtitle, en: e.target.value } }
                      }))
                    }
                  />
                </label>
                <label>
                  Line 2 (suffix)
                  <input
                    type="text"
                    value={homeContent.hero.subtitleSuffix.en}
                    onChange={(e) =>
                      setHomeContent((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          subtitleSuffix: { ...prev.hero.subtitleSuffix, en: e.target.value }
                        }
                      }))
                    }
                  />
                </label>
                <label>
                  Description
                  <textarea
                    rows="4"
                    value={homeContent.hero.description.en}
                    onChange={(e) =>
                      setHomeContent((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, description: { ...prev.hero.description, en: e.target.value } }
                      }))
                    }
                  />
                </label>
                <label>
                  Description (continued with links)
                  <textarea
                    rows="3"
                    value={homeContent.hero.description_continued.en}
                    onChange={(e) =>
                      setHomeContent((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          description_continued: { ...prev.hero.description_continued, en: e.target.value }
                        }
                      }))
                    }
                  />
                </label>
                <label>
                  Button label
                  <input
                    type="text"
                    value={homeContent.hero.ctaLabel.en}
                    onChange={(e) =>
                      setHomeContent((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, ctaLabel: { ...prev.hero.ctaLabel, en: e.target.value } }
                      }))
                    }
                  />
                </label>
              </div>

              <div className="admin-form-block">
                <h3>Image & Lien</h3>
                <label>
                  URL bouton
                  <input
                    type="url"
                    value={homeContent.hero.ctaUrl}
                    onChange={(e) =>
                      setHomeContent((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, ctaUrl: e.target.value }
                      }))
                    }
                  />
                </label>
                <label>
                  Image Hero
                  <input type="file" accept="image/*" onChange={(e) => setHeroImageFile(e.target.files?.[0] || null)} />
                </label>
                {homeContent.hero.imageUrl && (
                  <img className="admin-image-preview" src={homeContent.hero.imageUrl} alt="Hero preview" />
                )}
              </div>
            </div>

            <h2>À propos</h2>
            <div className="admin-form-grid">
              <div className="admin-form-block">
                <h3>FR</h3>
                <label>
                  Titre
                  <input
                    type="text"
                    value={homeContent.about.title.fr}
                    onChange={(e) =>
                      setHomeContent((prev) => ({
                        ...prev,
                        about: { ...prev.about, title: { ...prev.about.title, fr: e.target.value } }
                      }))
                    }
                  />
                </label>
                <label>
                  Description 1
                  <textarea
                    rows="4"
                    value={homeContent.about.description1.fr}
                    onChange={(e) =>
                      setHomeContent((prev) => ({
                        ...prev,
                        about: { ...prev.about, description1: { ...prev.about.description1, fr: e.target.value } }
                      }))
                    }
                  />
                </label>
                <label>
                  Description 2
                  <textarea
                    rows="4"
                    value={homeContent.about.description2.fr}
                    onChange={(e) =>
                      setHomeContent((prev) => ({
                        ...prev,
                        about: { ...prev.about, description2: { ...prev.about.description2, fr: e.target.value } }
                      }))
                    }
                  />
                </label>
              </div>

              <div className="admin-form-block">
                <h3>EN</h3>
                <label>
                  Title
                  <input
                    type="text"
                    value={homeContent.about.title.en}
                    onChange={(e) =>
                      setHomeContent((prev) => ({
                        ...prev,
                        about: { ...prev.about, title: { ...prev.about.title, en: e.target.value } }
                      }))
                    }
                  />
                </label>
                <label>
                  Description 1
                  <textarea
                    rows="4"
                    value={homeContent.about.description1.en}
                    onChange={(e) =>
                      setHomeContent((prev) => ({
                        ...prev,
                        about: { ...prev.about, description1: { ...prev.about.description1, en: e.target.value } }
                      }))
                    }
                  />
                </label>
                <label>
                  Description 2
                  <textarea
                    rows="4"
                    value={homeContent.about.description2.en}
                    onChange={(e) =>
                      setHomeContent((prev) => ({
                        ...prev,
                        about: { ...prev.about, description2: { ...prev.about.description2, en: e.target.value } }
                      }))
                    }
                  />
                </label>
              </div>

              <div className="admin-form-block">
                <h3>Image</h3>
                <label>
                  Photo About
                  <input type="file" accept="image/*" onChange={(e) => setAboutImageFile(e.target.files?.[0] || null)} />
                </label>
                {homeContent.about.imageUrl && (
                  <img className="admin-image-preview" src={homeContent.about.imageUrl} alt="About preview" />
                )}
              </div>
            </div>

            <button type="submit" className="admin-primary-btn" disabled={saving}>
              {saving ? "Sauvegarde..." : "Sauvegarder Accueil/À propos"}
            </button>
          </form>
        </section>

        <section className="admin-section">
          <h2>Compétences</h2>
          <form onSubmit={handleSaveSkill} className="admin-form">
            <div className="admin-form-grid">
              <div className="admin-form-block">
                <h3>FR</h3>
                <label>
                  Titre
                  <input
                    type="text"
                    value={skillForm.title.fr}
                    onChange={(e) => setSkillForm((prev) => ({ ...prev, title: { ...prev.title, fr: e.target.value } }))}
                  />
                </label>
                <label>
                  Description
                  <textarea
                    rows="4"
                    value={skillForm.description.fr}
                    onChange={(e) =>
                      setSkillForm((prev) => ({ ...prev, description: { ...prev.description, fr: e.target.value } }))
                    }
                  />
                </label>
              </div>
              <div className="admin-form-block">
                <h3>EN</h3>
                <label>
                  Title
                  <input
                    type="text"
                    value={skillForm.title.en}
                    onChange={(e) => setSkillForm((prev) => ({ ...prev, title: { ...prev.title, en: e.target.value } }))}
                  />
                </label>
                <label>
                  Description
                  <textarea
                    rows="4"
                    value={skillForm.description.en}
                    onChange={(e) =>
                      setSkillForm((prev) => ({ ...prev, description: { ...prev.description, en: e.target.value } }))
                    }
                  />
                </label>
              </div>
              <div className="admin-form-block">
                <h3>Image</h3>
                <label>
                  Image compétence
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSkillForm((prev) => ({ ...prev, imageFile: e.target.files?.[0] || null }))}
                  />
                </label>
                {skillForm.imageUrl && (
                  <img className="admin-image-preview" src={skillForm.imageUrl} alt="Skill preview" />
                )}
              </div>
            </div>
            <div className="admin-form-actions">
              <button type="submit" className="admin-primary-btn" disabled={saving}>
                {saving ? "Sauvegarde..." : skillForm.id ? "Modifier la compétence" : "Ajouter la compétence"}
              </button>
              {skillForm.id && (
                <button type="button" className="admin-secondary-btn" onClick={resetSkillForm}>
                  Annuler
                </button>
              )}
            </div>
          </form>

          <div className="admin-list">
            {skills.map((item) => (
              <div key={item.id} className="admin-list-item">
                <div className="admin-list-info">
                  <strong>{item.title?.fr || item.title?.en || "Sans titre"}</strong>
                  <span>{item.description?.fr || item.description?.en || ""}</span>
                </div>
                <div className="admin-list-actions">
                  <button type="button" className="admin-secondary-btn" onClick={() => handleEditSkill(item)}>
                    Modifier
                  </button>
                  <button type="button" className="admin-danger-btn" onClick={() => handleDeleteSkill(item.id)}>
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-section">
          <h2>Projets</h2>
          <form onSubmit={handleSaveProject} className="admin-form">
            <div className="admin-form-grid">
              <div className="admin-form-block">
                <h3>FR</h3>
                <label>
                  Titre
                  <input
                    type="text"
                    value={projectForm.title.fr}
                    onChange={(e) =>
                      setProjectForm((prev) => ({ ...prev, title: { ...prev.title, fr: e.target.value } }))
                    }
                  />
                </label>
                <label>
                  Description
                  <textarea
                    rows="4"
                    value={projectForm.description.fr}
                    onChange={(e) =>
                      setProjectForm((prev) => ({ ...prev, description: { ...prev.description, fr: e.target.value } }))
                    }
                  />
                </label>
              </div>
              <div className="admin-form-block">
                <h3>EN</h3>
                <label>
                  Title
                  <input
                    type="text"
                    value={projectForm.title.en}
                    onChange={(e) =>
                      setProjectForm((prev) => ({ ...prev, title: { ...prev.title, en: e.target.value } }))
                    }
                  />
                </label>
                <label>
                  Description
                  <textarea
                    rows="4"
                    value={projectForm.description.en}
                    onChange={(e) =>
                      setProjectForm((prev) => ({ ...prev, description: { ...prev.description, en: e.target.value } }))
                    }
                  />
                </label>
              </div>
              <div className="admin-form-block">
                <h3>Liens & Image</h3>
                <label>
                  Lien GitHub
                  <input
                    type="url"
                    value={projectForm.url}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, url: e.target.value }))}
                  />
                </label>
                <label>
                  Lien Site
                  <input
                    type="url"
                    value={projectForm.site}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, site: e.target.value }))}
                  />
                </label>
                <label>
                  Image projet
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, imageFile: e.target.files?.[0] || null }))}
                  />
                </label>
                {projectForm.imageUrl && (
                  <img className="admin-image-preview" src={projectForm.imageUrl} alt="Project preview" />
                )}
              </div>
            </div>
            <div className="admin-form-actions">
              <button type="submit" className="admin-primary-btn" disabled={saving}>
                {saving ? "Sauvegarde..." : projectForm.id ? "Modifier le projet" : "Ajouter le projet"}
              </button>
              {projectForm.id && (
                <button type="button" className="admin-secondary-btn" onClick={resetProjectForm}>
                  Annuler
                </button>
              )}
            </div>
          </form>

          <div className="admin-list">
            {projects.map((item) => (
              <div key={item.id} className="admin-list-item">
                <div className="admin-list-info">
                  <strong>{item.title?.fr || item.title?.en || "Sans titre"}</strong>
                  <span>{item.description?.fr || item.description?.en || ""}</span>
                </div>
                <div className="admin-list-actions">
                  <button type="button" className="admin-secondary-btn" onClick={() => handleEditProject(item)}>
                    Modifier
                  </button>
                  <button type="button" className="admin-danger-btn" onClick={() => handleDeleteProject(item.id)}>
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-section">
          <h2>Réseaux sociaux (Footer)</h2>
          <form onSubmit={handleSaveFooter} className="admin-form">
            <div className="admin-form-grid admin-form-grid-2">
              <label>
                Facebook
                <input
                  type="url"
                  value={footerLinks.facebook}
                  onChange={(e) => setFooterLinks((prev) => ({ ...prev, facebook: e.target.value }))}
                />
              </label>
              <label>
                Instagram
                <input
                  type="url"
                  value={footerLinks.instagram}
                  onChange={(e) => setFooterLinks((prev) => ({ ...prev, instagram: e.target.value }))}
                />
              </label>
              <label>
                Twitter
                <input
                  type="url"
                  value={footerLinks.twitter}
                  onChange={(e) => setFooterLinks((prev) => ({ ...prev, twitter: e.target.value }))}
                />
              </label>
              <label>
                LinkedIn
                <input
                  type="url"
                  value={footerLinks.linkedin}
                  onChange={(e) => setFooterLinks((prev) => ({ ...prev, linkedin: e.target.value }))}
                />
              </label>
            </div>
            <button type="submit" className="admin-primary-btn" disabled={saving}>
              {saving ? "Sauvegarde..." : "Sauvegarder les liens"}
            </button>
          </form>
        </section>

        <section className="admin-section">
          <h2>CV (PDF)</h2>
          <form onSubmit={handleSaveCv} className="admin-form">
            <div className="admin-form-grid">
              <div className="admin-form-block">
                <h3>Web Developer</h3>
                <label>
                  FR (PDF)
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setCvFiles((prev) => ({ ...prev, devFr: e.target.files?.[0] || null }))}
                  />
                </label>
                {cvLinks.dev.fr && (
                  <a href={cvLinks.dev.fr} target="_blank" rel="noreferrer">
                    Voir le PDF FR
                  </a>
                )}
                <label>
                  EN (PDF)
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setCvFiles((prev) => ({ ...prev, devEn: e.target.files?.[0] || null }))}
                  />
                </label>
                {cvLinks.dev.en && (
                  <a href={cvLinks.dev.en} target="_blank" rel="noreferrer">
                    View EN PDF
                  </a>
                )}
              </div>

              <div className="admin-form-block">
                <h3>Data Analyst</h3>
                <label>
                  FR (PDF)
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setCvFiles((prev) => ({ ...prev, dataFr: e.target.files?.[0] || null }))}
                  />
                </label>
                {cvLinks.data.fr && (
                  <a href={cvLinks.data.fr} target="_blank" rel="noreferrer">
                    Voir le PDF FR
                  </a>
                )}
                <label>
                  EN (PDF)
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setCvFiles((prev) => ({ ...prev, dataEn: e.target.files?.[0] || null }))}
                  />
                </label>
                {cvLinks.data.en && (
                  <a href={cvLinks.data.en} target="_blank" rel="noreferrer">
                    View EN PDF
                  </a>
                )}
              </div>
            </div>
            <button type="submit" className="admin-primary-btn" disabled={saving}>
              {saving ? "Sauvegarde..." : "Sauvegarder les CV"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
