import { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import "../../Admin.css";

export default function AdminTestimonials() {
  const [user, setUser] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [filter, setFilter] = useState("all"); // all, pending, approved
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadTestimonials();
      } else {
        navigate("/admin/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTestimonials(data);
    } catch (error) {
      console.error("Erreur chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await updateDoc(doc(db, "testimonials", id), { status: "approved" });
      await loadTestimonials();
      alert("✅ Témoignage approuvé !");
    } catch (error) {
      console.error("Erreur:", error);
      alert("❌ Erreur lors de l'approbation");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce témoignage ?")) return;
    
    try {
      await deleteDoc(doc(db, "testimonials", id));
      await loadTestimonials();
      alert("🗑️ Témoignage supprimé");
    } catch (error) {
      console.error("Erreur:", error);
      alert("❌ Erreur lors de la suppression");
    }
  };

  const filteredTestimonials = testimonials.filter(t => {
    if (filter === "pending") return t.status === "pending";
    if (filter === "approved") return t.status === "approved" || !t.status;
    return true;
  });

  const pendingCount = testimonials.filter(t => t.status === "pending").length;

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>💬 Gestion des Témoignages</h1>
          <button onClick={() => navigate("/admin/dashboard")} className="admin-back-btn">
            ← Dashboard
          </button>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-filters">
          <button 
            className={filter === "all" ? "active" : ""} 
            onClick={() => setFilter("all")}
          >
            Tous ({testimonials.length})
          </button>
          <button 
            className={filter === "pending" ? "active" : ""} 
            onClick={() => setFilter("pending")}
          >
            En attente ({pendingCount})
          </button>
          <button 
            className={filter === "approved" ? "active" : ""} 
            onClick={() => setFilter("approved")}
          >
            Approuvés ({testimonials.length - pendingCount})
          </button>
        </div>

        {loading ? (
          <div className="admin-loading">Chargement...</div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="admin-empty">Aucun témoignage trouvé</div>
        ) : (
          <div className="admin-testimonials-list">
            {filteredTestimonials.map((testimonial) => (
              <div key={testimonial.id} className={`admin-testimonial-card ${testimonial.status || 'approved'}`}>
                <div className="testimonial-header">
                  <div className="testimonial-author">
                    <h3>{testimonial.author_name}</h3>
                    <p>{testimonial.author_designation}</p>
                  </div>
                  <div className="testimonial-rating">
                    {"⭐".repeat(Number(testimonial.count) || 5)}
                  </div>
                </div>
                
                <p className="testimonial-description">{testimonial.description}</p>
                
                <div className="testimonial-meta">
                  <span className="testimonial-date">
                    {new Date(testimonial.createdAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric"
                    })}
                  </span>
                  <span className={`testimonial-status ${testimonial.status || 'approved'}`}>
                    {testimonial.status === "pending" ? "⏳ En attente" : "✅ Approuvé"}
                  </span>
                </div>

                <div className="testimonial-actions">
                  {testimonial.status === "pending" && (
                    <button 
                      onClick={() => handleApprove(testimonial.id)} 
                      className="btn-approve"
                    >
                      ✅ Approuver
                    </button>
                  )}
                  <button 
                    onClick={() => handleReject(testimonial.id)} 
                    className="btn-delete"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
