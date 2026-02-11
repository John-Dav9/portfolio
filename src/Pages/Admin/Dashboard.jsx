import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import "../../Admin.css";
import ContentManager from "./ContentManager";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalTestimonials: 0,
    pendingTestimonials: 0,
    approvedTestimonials: 0,
    totalContacts: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadStats();
      } else {
        navigate("/admin/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadStats = async () => {
    try {
      // Statistiques des témoignages
      const testimonialsSnapshot = await getDocs(collection(db, "testimonials"));
      const testimonials = testimonialsSnapshot.docs.map(doc => doc.data());
      
      const pending = testimonials.filter(t => t.status === "pending").length;
      const approved = testimonials.filter(t => t.status === "approved" || !t.status).length;

      // Statistiques des contacts
      const contactsSnapshot = await getDocs(collection(db, "contacts"));

      setStats({
        totalTestimonials: testimonials.length,
        pendingTestimonials: pending,
        approvedTestimonials: approved,
        totalContacts: contactsSnapshot.size
      });
    } catch (error) {
      console.error("Erreur lors du chargement des stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin/login");
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
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
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>📊 Dashboard Admin</h1>
          <div className="admin-header-actions">
            <span className="admin-user-info">👤 {user?.email}</span>
            <button onClick={handleLogout} className="admin-logout-btn">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="stat-icon">💬</div>
            <div className="stat-info">
              <h3>{stats.totalTestimonials}</h3>
              <p>Total Témoignages</p>
            </div>
          </div>

          <div className="admin-stat-card highlight">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{stats.pendingTestimonials}</h3>
              <p>En attente</p>
            </div>
          </div>

          <div className="admin-stat-card success">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{stats.approvedTestimonials}</h3>
              <p>Approuvés</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon">📧</div>
            <div className="stat-info">
              <h3>{stats.totalContacts}</h3>
              <p>Messages Contact</p>
            </div>
          </div>
        </div>

        <div className="admin-actions-grid">
          <div className="admin-action-card" onClick={() => navigate("/admin/testimonials")}>
            <h3>💬 Gérer les Témoignages</h3>
            <p>Approuver, modifier ou supprimer les avis</p>
            {stats.pendingTestimonials > 0 && (
              <span className="badge">{stats.pendingTestimonials} en attente</span>
            )}
          </div>

          <div className="admin-action-card" onClick={() => navigate("/admin/contacts")}>
            <h3>📧 Messages de Contact</h3>
            <p>Consulter les messages reçus</p>
            <span className="badge">{stats.totalContacts} message{stats.totalContacts > 1 ? 's' : ''}</span>
          </div>

          <div className="admin-action-card" onClick={() => window.open("/", "_blank")}>
            <h3>🌐 Voir le Site</h3>
            <p>Ouvrir le portfolio en direct</p>
          </div>

          <div className="admin-action-card" onClick={() => window.open("https://console.firebase.google.com/project/john-david-portfolio/firestore", "_blank")}>
            <h3>🔥 Firebase Console</h3>
            <p>Accéder à la console Firebase</p>
          </div>
        </div>

        <div className="admin-embedded-content">
          <h2 className="admin-embedded-title">Éditeur du site</h2>
          <ContentManager showHeader={false} />
        </div>
      </div>
    </div>
  );
}
