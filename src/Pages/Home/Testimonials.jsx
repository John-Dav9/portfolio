import data from "../../data/index.json";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { db } from "../../firebase";
import { collection, addDoc, getDocs, orderBy, query } from "firebase/firestore";

export default function Testimonial() {
  const { t } = useTranslation();
  const [testimonials, setTestimonials] = useState(data?.testimonials || []);
  const [showModal, setShowModal] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    author_name: "",
    author_designation: "",
    description: "",
    count: "5"
  });

  // Charger les avis depuis Firestore au démarrage
  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const firestoreTestimonials = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Ne charger que les témoignages approuvés pour le public
      const approvedTestimonials = firestoreTestimonials.filter(t => t.status === "approved" || !t.status);
      
      // Combiner les avis approuvés avec ceux de Firestore et les avis statiques
      setTestimonials([...approvedTestimonials, ...data?.testimonials || []]);
    } catch (error) {
      console.error("Erreur lors du chargement des avis:", error);
      // En cas d'erreur, garder les avis statiques
      setTestimonials(data?.testimonials || []);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const newTestimonial = {
        author_name: formData.author_name,
        author_designation: formData.author_designation,
        description: formData.description,
        count: formData.count,
        src: "./img/avatar-image.png",
        status: "pending", // Avis en attente d'approbation
        createdAt: new Date().toISOString()
      };
      
      // Sauvegarder dans Firestore
      await addDoc(collection(db, "testimonials"), newTestimonial);
      
      // Recharger les avis
      await loadTestimonials();
      
      setShowModal(false);
      setFormData({
        author_name: "",
        author_designation: "",
        description: "",
        count: "5"
      });
      
      alert("✅ Merci pour votre avis ! Il sera publié après validation.");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'avis:", error);
      alert("❌ Erreur: Impossible d'enregistrer l'avis. Vérifiez votre configuration Firebase.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="testimonial--section" id="testimonial">
      <div className="portfolio--container--box">
        <div className="portfolio--container">
          <p className="sub-title"></p>
          <h2 className="sections--heading">{t('testimonials.title')}</h2>
        </div>
      </div>
      <div className="portfolio--section--container">
        {(showAll ? testimonials : testimonials.slice(0, 3))?.map((item) => (
          <div key={item.id} className="testimonial--section--card">
            <div className="testimonial--section--card--review">
              {Array.from({ length: Number(item.count) || 5 }, (_, starIndex) => (
                <svg
                  key={`${item.id}-star-${starIndex}`}
                  xmlns="http://www.w3.org/2000/svg"
                  width="27"
                  height="26"
                  viewBox="0 0 27 26"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M12.0945 0.953177C12.5528 -0.135435 14.1138 -0.135434 14.5722 0.95318L17.2772 7.37836C17.4705 7.8373 17.9074 8.15087 18.4089 8.19059L25.4302 8.74669C26.6199 8.84091 27.1022 10.3076 26.1959 11.0746L20.8464 15.6016C20.4643 15.925 20.2973 16.4324 20.4141 16.9158L22.0484 23.6847C22.3253 24.8315 21.0625 25.7381 20.044 25.1235L14.0327 21.4961C13.6033 21.237 13.0633 21.237 12.634 21.4961L6.62265 25.1235C5.60415 25.7381 4.34127 24.8315 4.61818 23.6847L6.25256 16.9158C6.3693 16.4324 6.20243 15.925 5.82034 15.6016L0.47075 11.0746C-0.435624 10.3076 0.0467572 8.84091 1.23639 8.74669L8.25781 8.19059C8.75933 8.15087 9.19621 7.8373 9.38942 7.37836L12.0945 0.953177Z"
                    fill="#006B6A"
                  />
                </svg>
              ))}
            </div>
            <p className="text-md">{item.description}</p>
            <div className="testimonial--section--card--author--detail">
              <img src={item.src} alt={item.author_name} loading="lazy" />
              <div>
                <p className="text-md testimonial--author--name">
                  {item.author_name}
                </p>
                <p className="text-md testimonial--author--designation">
                  {item.author_designation}
                </p>
              </div>
            </div>
          </div>
        ))}
        <button 
          onClick={() => setShowModal(true)} 
          className="testimonial--add--card"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>{t('testimonials.leaveReview')}</span>
        </button>
      </div>

      {testimonials.length > 3 && (
        <div className="testimonial--see--all-wrapper">
          <button 
            onClick={() => setShowAll(!showAll)} 
            className="btn-outline-primary"
            type="button"
          >
            {showAll ? "Voir moins d'avis" : `Voir tous les avis (${testimonials.length})`}
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal--overlay" onClick={() => setShowModal(false)}>
          <div className="modal--content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal--close" 
              onClick={() => setShowModal(false)}
              type="button"
            >
              ×
            </button>
            <h3>Laisser un avis</h3>
            <form onSubmit={handleSubmit} className="testimonial--form">
              <div className="form--group">
                <label htmlFor="name">Votre nom *</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.author_name}
                  onChange={(e) => setFormData({...formData, author_name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div className="form--group">
                <label htmlFor="designation">Fonction / Entreprise *</label>
                <input
                  id="designation"
                  type="text"
                  required
                  value={formData.author_designation}
                  onChange={(e) => setFormData({...formData, author_designation: e.target.value})}
                  placeholder="Développeur chez XYZ"
                />
              </div>
              <div className="form--group">
                <label htmlFor="rating">Note *</label>
                <select
                  id="rating"
                  value={formData.count}
                  onChange={(e) => setFormData({...formData, count: e.target.value})}
                >
                  <option value="5">5 étoiles</option>
                  <option value="4">4 étoiles</option>
                  <option value="3">3 étoiles</option>
                  <option value="2">2 étoiles</option>
                  <option value="1">1 étoile</option>
                </select>
              </div>
              <div className="form--group">
                <label htmlFor="comment">Votre commentaire *</label>
                <textarea
                  id="comment"
                  required
                  rows="5"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Partagez votre expérience..."
                />
              </div>
              <div className="form--actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" disabled={loading}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "Publication..." : "Publier l'avis"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
