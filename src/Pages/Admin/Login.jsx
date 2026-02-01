import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "../../Admin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Erreur de connexion:", err);
      if (err.code === "auth/invalid-credential") {
        setError("Email ou mot de passe incorrect");
      } else if (err.code === "auth/user-not-found") {
        setError("Aucun compte trouvé avec cet email");
      } else if (err.code === "auth/wrong-password") {
        setError("Mot de passe incorrect");
      } else {
        setError("Erreur de connexion. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h1>🔐 Connexion Admin</h1>
        <p className="admin-login-subtitle">Accès au panel d'administration</p>
        
        {error && <div className="admin-error-message">{error}</div>}
        
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              autoComplete="email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          
          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        
        <div className="admin-login-footer">
          <a href="/" className="back-to-site">← Retour au portfolio</a>
        </div>
      </div>
    </div>
  );
}
