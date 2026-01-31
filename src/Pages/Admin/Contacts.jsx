import { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, deleteDoc, query, orderBy } from "firebase/firestore";

export default function AdminContacts() {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadContacts();
      } else {
        navigate("/admin/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setContacts(data);
    } catch (error) {
      console.error("Erreur chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce message ?")) return;
    
    try {
      await deleteDoc(doc(db, "contacts", id));
      await loadContacts();
      alert("🗑️ Message supprimé");
    } catch (error) {
      console.error("Erreur:", error);
      alert("❌ Erreur lors de la suppression");
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>📧 Messages de Contact</h1>
          <button onClick={() => navigate("/admin/dashboard")} className="admin-back-btn">
            ← Dashboard
          </button>
        </div>
      </header>

      <div className="admin-content">
        {loading ? (
          <div className="admin-loading">Chargement...</div>
        ) : contacts.length === 0 ? (
          <div className="admin-empty">Aucun message trouvé</div>
        ) : (
          <div className="admin-contacts-list">
            {contacts.map((contact) => (
              <div key={contact.id} className="admin-contact-card">
                <div className="contact-header">
                  <div className="contact-info">
                    <h3>{contact.firstName} {contact.lastName}</h3>
                    <p className="contact-email">📧 {contact.email}</p>
                    {contact.phoneNumber && (
                      <p className="contact-phone">📱 {contact.phoneNumber}</p>
                    )}
                  </div>
                  <div className="contact-date">
                    {new Date(contact.createdAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </div>
                </div>

                {contact.subject && (
                  <div className="contact-subject">
                    <strong>Sujet :</strong> {contact.subject}
                  </div>
                )}

                <div className="contact-message">
                  <p>{contact.message}</p>
                </div>

                <div className="contact-actions">
                  <a 
                    href={`mailto:${contact.email}?subject=Re: ${contact.subject || 'Votre message'}`}
                    className="btn-reply"
                  >
                    ↩️ Répondre
                  </a>
                  <button 
                    onClick={() => handleDelete(contact.id)} 
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
